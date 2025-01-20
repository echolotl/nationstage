// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::{engine::general_purpose::STANDARD, Engine as _};
use reqwest::Client;
use serde_json;
use std::env;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::Manager;
use tauri::State;

struct AuthState(Mutex<Option<AuthStateData>>);

#[derive(Clone, serde::Serialize, serde::Deserialize)]
struct AuthCredentials {
    nation: String,
    autologin: String,
    region: String,
}

#[derive(Clone, serde::Serialize, serde::Deserialize)]
struct SavedAccounts {
    accounts: Vec<AuthCredentials>,
}

#[derive(Clone)]
struct AuthStateData {
    credentials: AuthCredentials,
    pin: String, // PIN stored only in memory
}

fn get_credentials_path() -> PathBuf {
    let mut path = if cfg!(windows) {
        match env::var("APPDATA") {
            Ok(dir) => PathBuf::from(dir),
            Err(_) => env::current_dir().unwrap_or_default(),
        }
    } else {
        match env::var("HOME") {
            Ok(dir) => PathBuf::from(dir).join(".config"),
            Err(_) => env::current_dir().unwrap_or_default(),
        }
    };

    // Add the application identifier path
    path.push("com.nationstage.dev");
    path.push("credentials.json");
    println!("Credentials path: {:?}", path); // Debug
    path
}

fn load_saved_credentials() -> Option<AuthCredentials> {
    let path = get_credentials_path();
    println!("Looking for credentials at: {:?}", path); // Debug

    if path.exists() {
        println!("Credentials file exists"); // Debug
        match fs::read_to_string(&path) {
            Ok(contents) => {
                println!("Read contents: {}", contents); // Debug
                match serde_json::from_str(&contents) {
                    Ok(creds) => {
                        println!("Successfully parsed credentials"); // Debug
                        Some(creds)
                    }
                    Err(e) => {
                        println!("Failed to parse credentials: {}", e); // Debug
                        None
                    }
                }
            }
            Err(e) => {
                println!("Failed to read credentials file: {}", e); // Debug
                None
            }
        }
    } else {
        println!("No credentials file found"); // Debug
        None
    }
}

fn save_credentials(credentials: &AuthCredentials) -> Result<(), String> {
    let path = get_credentials_path();
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string(&credentials).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

fn save_accounts(accounts: &SavedAccounts) -> Result<(), String> {
    let mut path = get_credentials_path();
    path.set_file_name("accounts.json");
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string(&accounts).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

fn clear_saved_credentials() {
    let path = get_credentials_path();
    let _ = fs::remove_file(path);
}

#[tauri::command]
fn get_user_agent() -> String {
    format!("NationStage/0.1.0 (by Taelboa)")
}

#[tauri::command]
async fn fetch_image(url: String) -> Result<String, String> {
    let client = Client::new();
    let response = client
        .get(url)
        .header("User-Agent", "NationStage")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let bytes = response.bytes().await.map_err(|e| e.to_string())?;

    Ok(format!("data:image/png;base64,{}", STANDARD.encode(&bytes)))
}

#[tauri::command]
async fn save_auth(
    state: State<'_, AuthState>,
    nation: String,
    autologin: String,
    region: String,
) -> Result<(), String> {
    let credentials = AuthCredentials {
        nation,
        autologin,
        region,
    };
    let auth_data = AuthStateData {
        credentials: credentials.clone(),
        pin: String::new(), // Initialize with empty PIN
    };
    *state.0.lock().unwrap() = Some(auth_data);
    save_credentials(&credentials)?;
    Ok(())
}

#[tauri::command]
async fn update_pin(state: State<'_, AuthState>, pin: String) -> Result<(), String> {
    let mut state_guard = state.0.lock().unwrap();
    if let Some(mut auth_data) = state_guard.clone() {
        auth_data.pin = pin;
        *state_guard = Some(auth_data);
        Ok(())
    } else {
        Err("No auth state found".into())
    }
}

#[tauri::command]
async fn get_saved_auth() -> Option<AuthCredentials> {
    println!("get_saved_auth called"); // Debug
    let creds = load_saved_credentials();
    println!("Loaded credentials: {:?}", creds.is_some()); // Debug
    creds
}

#[tauri::command]
async fn get_saved_accounts() -> Option<SavedAccounts> {
    // Similar to get_saved_auth implementation but for multiple accounts
    let path = get_credentials_path();
    let mut accounts_path = path.clone();
    accounts_path.set_file_name("accounts.json");
    println!("Looking for accounts at: {:?}", accounts_path); // Debug

    if accounts_path.exists() {
        println!("Accounts file exists"); // Debug
        match fs::read_to_string(&accounts_path) {
            Ok(contents) => {
                println!("Read contents: {}", contents); // Debug
                match serde_json::from_str(&contents) {
                    Ok(accounts) => {
                        println!("Successfully parsed accounts"); // Debug
                        Some(accounts)
                    }
                    Err(e) => {
                        println!("Failed to parse accounts: {}", e); // Debug
                        None
                    }
                }
            }
            Err(e) => {
                println!("Failed to read accounts file: {}", e); // Debug
                None
            }
        }
    } else {
        println!("No accounts file found"); // Debug
        None
    }
}

#[tauri::command]
async fn clear_auth(state: State<'_, AuthState>) -> Result<(), String> {
    *state.0.lock().unwrap() = None;
    clear_saved_credentials();
    Ok(())
}

#[tauri::command]
fn get_auth(state: State<'_, AuthState>) -> Option<AuthCredentials> {
    state
        .0
        .lock()
        .unwrap()
        .as_ref()
        .map(|data| data.credentials.clone())
}

#[tauri::command]
fn get_pin(state: State<'_, AuthState>) -> Option<String> {
    state
        .0
        .lock()
        .unwrap()
        .as_ref()
        .map(|data| data.pin.clone())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Initialize auth state from saved credentials on startup
            let state: State<AuthState> = app.state();
            if let Some(credentials) = load_saved_credentials() {
                *state.0.lock().unwrap() = Some(AuthStateData {
                    credentials,
                    pin: String::new(),
                });
            }
            Ok(())
        })
        .manage(AuthState(Default::default()))
        .invoke_handler(tauri::generate_handler![
            save_auth,
            get_auth,
            get_saved_auth,
            get_saved_accounts,
            clear_auth,
            get_user_agent,
            fetch_image,
            update_pin,
            get_pin
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
