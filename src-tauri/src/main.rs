// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod discord;
mod nscode;
mod scraper;

use base64::{engine::general_purpose::STANDARD, Engine as _};
use reqwest::Client;
use serde_json;
use std::env;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::Manager;
use tauri::State;
use crate::discord::{DiscordState, initialize_discord, update_discord_presence, toggle_discord_rpc, get_discord_setting};
use crate::nscode::BBCodeParser;
use std::sync::Arc;
use window_vibrancy::*;
use futures_util::StreamExt;
use std::io::Write;
use flate2::read::GzDecoder;
use tauri::Emitter;
use tauri::AppHandle;

struct AuthState(Mutex<Option<AuthStateData>>);

#[derive(Clone, serde::Serialize, serde::Deserialize)]
struct AuthCredentials {
    nation: String,
    autologin: String,
    region: String,
    leader_name: Option<String>, // Add leader name field
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

#[derive(Clone, serde::Serialize, serde::Deserialize)]
struct Bookmark {
    id: String,
    name: String,
    r#type: String, // "nation" or "region"
    flag: String,
    banner: String,  // Add banner field
}

#[derive(Clone, serde::Serialize, serde::Deserialize)]
struct Bookmarks {
    items: Vec<Bookmark>,
}

#[derive(Clone, serde::Serialize, serde::Deserialize)]
struct UserData {
    leader_name: Option<String>,
    // Add other user-specific data here in the future
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
    path.push("com.echolotl.lol");
    path.push("nationstage");
    path.push("credentials.json");
    println!("Credentials path: {:?}", path); // Debug
    path
}

fn get_bookmarks_path() -> PathBuf {
    let mut path = get_credentials_path();
    path.set_file_name("bookmarks.json");
    path
}

fn get_data_path() -> PathBuf {
    let mut path = get_credentials_path();
    path.set_file_name("data.json");
    path
}

fn get_dumps_path() -> PathBuf {
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

    path.push("com.echolotl.lol");
    path.push("nationstage");
    path.push("dumps");
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

fn load_user_data() -> UserData {
    let path = get_data_path();
    if path.exists() {
        if let Ok(contents) = fs::read_to_string(&path) {
            if let Ok(data) = serde_json::from_str(&contents) {
                return data;
            }
        }
    }
    UserData { leader_name: None }
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
    format!("NationStage/0.3.6 (by Taelboa)")
}

#[tauri::command]
async fn fetch_page(url: String) -> Result<scraper::ScraperResponse, String> {
    scraper::fetch_html(&url, &get_user_agent())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn fetch_image(url: String) -> Result<String, String> {
    let client = Client::new();
    let response = client
        .get(url)
        .header("User-Agent", get_user_agent())
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
        leader_name: None, // Initialize with None
    };
    let auth_data = AuthStateData {
        credentials: credentials.clone(),
        pin: String::new(), // Initialize with empty PIN
    };
    *state.0.lock().unwrap() = Some(auth_data);
    save_credentials(&credentials)?;

    // Load existing accounts
    let mut accounts = load_saved_accounts().unwrap_or(SavedAccounts { accounts: vec![] });

    // Add or update the account
    accounts.accounts.retain(|acc| acc.nation != credentials.nation);
    accounts.accounts.push(credentials);

    // Save the updated accounts
    save_accounts(&accounts)?;

    Ok(())
}

fn load_saved_accounts() -> Option<SavedAccounts> {
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

#[tauri::command]
async fn save_bookmark(bookmark: Bookmark) -> Result<(), String> {
    let path = get_bookmarks_path();
    let mut bookmarks = if path.exists() {
        let contents = fs::read_to_string(&path).map_err(|e| e.to_string())?;
        serde_json::from_str(&contents).unwrap_or(Bookmarks { items: vec![] })
    } else {
        Bookmarks { items: vec![] }
    };

    // Remove if already exists
    bookmarks.items.retain(|b| b.id != bookmark.id);
    bookmarks.items.push(bookmark);

    let json = serde_json::to_string(&bookmarks).map_err(|e| e.to_string())?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn remove_bookmark(id: String) -> Result<(), String> {
    let path = get_bookmarks_path();
    if !path.exists() {
        return Ok(());
    }

    let contents = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut bookmarks: Bookmarks = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
    bookmarks.items.retain(|b| b.id != id);

    let json = serde_json::to_string(&bookmarks).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn get_bookmarks() -> Result<Bookmarks, String> {
    let path = get_bookmarks_path();
    if (!path.exists()) {
        return Ok(Bookmarks { items: vec![] });
    }

    let contents = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let bookmarks: Bookmarks = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
    Ok(bookmarks)
}

#[tauri::command]
async fn update_leader_name(name: String) -> Result<(), String> {
    let path = get_data_path();
    let mut data = load_user_data();
    data.leader_name = Some(name);
    
    let json = serde_json::to_string(&data).map_err(|e| e.to_string())?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn get_user_data() -> Result<UserData, String> {
    Ok(load_user_data())
}

#[tauri::command]
fn parse_bbcode(input: String) -> String {
    println!("BBCode parser received input length: {}", input.chars().count());
    // Use safe string slicing for UTF-8
    let preview: String = input.chars().take(100).collect();
    println!("First 100 chars of input: {}", preview);
    
    let parser = BBCodeParser::new();
    let result = parser.parse(&input);
    
    println!("BBCode parser result length: {}", result.chars().count());
    let result_preview: String = result.chars().take(100).collect();
    println!("First 100 chars of result: {}", result_preview);
    
    result
}

#[tauri::command]
fn add_custom_tag(name: String, template: String) -> Result<(), String> {
    let mut parser = BBCodeParser::new();
    parser.add_simple_tag(&name, &template);
    Ok(())
}

#[tauri::command]
fn change_mica_theme(window: tauri::Window, dark: bool) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        apply_mica(&window, Some(dark)).map_err(|e| e.to_string())
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Unsupported platform! 'apply_mica' is only supported on Windows".into())
    }
}

#[derive(Clone, serde::Serialize)]
struct DownloadProgress {
    message: String,
    progress: f64,
    is_extracting: bool,
}

async fn download_dump(client: &Client, url: &str, filename: &str, app_handle: &AppHandle) -> Result<PathBuf, String> {
    let dumps_path = get_dumps_path();
    fs::create_dir_all(&dumps_path).map_err(|e| e.to_string())?;
    
    app_handle.emit("download-progress", DownloadProgress {
        message: format!("Starting download of {}", filename),
        progress: 0.0,
        is_extracting: false,
    }).map_err(|e| e.to_string())?;
    
    let target_path = dumps_path.join(filename);
    let temp_path = target_path.with_extension("tmp");

    let res = client
        .get(url)
        .header("User-Agent", get_user_agent())
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let total_size = res.content_length().unwrap_or(0);
    let mut downloaded = 0;
    let mut last_progress = -1.0;
    
    let mut file = fs::File::create(&temp_path).map_err(|e| e.to_string())?;
    let mut stream = res.bytes_stream();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| e.to_string())?;
        file.write_all(&chunk).map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;
        
        let progress = if total_size > 0 {
            (downloaded as f64 / total_size as f64) * 100.0
        } else {
            0.0
        };

        if (progress - last_progress).abs() >= 1.0 {
            app_handle.emit("download-progress", DownloadProgress {
                message: format!("Downloading {}", filename),
                progress,
                is_extracting: false,
            }).map_err(|e| e.to_string())?;
            last_progress = progress;
        }
    }

    fs::rename(&temp_path, &target_path).map_err(|e| e.to_string())?;
    Ok(target_path)
}

async fn extract_dump(path: PathBuf, app_handle: &AppHandle) -> Result<(), String> {
    let filename = path.file_name().unwrap().to_string_lossy().to_string();
    
    app_handle.emit("download-progress", DownloadProgress {
        message: format!("Extracting {}", filename.replace(".gz", "")),
        progress: 0.0,
        is_extracting: true,
    }).map_err(|e| e.to_string())?;
    
    let file = fs::File::open(path.clone()).map_err(|e| e.to_string())?;
    let mut gz = GzDecoder::new(file);
    
    let out_path = path.with_extension("");
    let mut out_file = fs::File::create(&out_path).map_err(|e| e.to_string())?;
    
    std::io::copy(&mut gz, &mut out_file).map_err(|e| e.to_string())?;
    
    fs::remove_file(path).map_err(|e| e.to_string())?;

    app_handle.emit("download-progress", DownloadProgress {
        message: format!("Finished extracting {}", filename.replace(".gz", "")),
        progress: 100.0,
        is_extracting: true,
    }).map_err(|e| e.to_string())?;
    
    Ok(())
}

async fn prepare_data_dumps(app_handle: &tauri::AppHandle) -> Result<(), String> {
    let client = Client::new();
    let dumps = vec![
        ("https://www.nationstates.net/pages/nations.xml.gz", "nations.xml.gz"),
        ("https://www.nationstates.net/pages/regions.xml.gz", "regions.xml.gz"),
    ];

    let _ = app_handle.emit("download-progress", DownloadProgress {
        message: "Preparing to download data dumps...".to_string(),
        progress: 0.0,
        is_extracting: false,
    });

    for (url, filename) in dumps {
        let path = download_dump(&client, url, filename, app_handle).await?;
        extract_dump(path, app_handle).await?;
    }

    let _ = app_handle.emit("download-progress", DownloadProgress {
        message: "All data dumps processed successfully!".to_string(),
        progress: 100.0,
        is_extracting: false,
    });
    Ok(())
}

fn main() {
    let discord = initialize_discord();
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let splash_w = app.get_webview_window("splash").unwrap();
            
            // Start the download process
            tauri::async_runtime::spawn(async move {
                if let Err(e) = prepare_data_dumps(&app_handle).await {
                    println!("Error preparing data dumps: {}", e);
                    let _ = app_handle.emit("download-progress", DownloadProgress {
                        message: format!("Error: {}", e),
                        progress: 0.0,
                        is_extracting: false,
                    });
                }
                
                // Show the main window after downloads complete
                if let Some(main_window) = app_handle.get_webview_window("main") {
                    let _ = main_window.show();
                }
                
                // Close splash window
                let _ = splash_w.close();
            });

            // Initialize auth state from saved credentials on startup
            let state: State<AuthState> = app.state();
            if let Some(credentials) = load_saved_credentials() {
                *state.0.lock().unwrap() = Some(AuthStateData {
                    credentials,
                    pin: String::new(),
                });
            }

            // Apply mica effect to both windows on startup
            #[cfg(target_os = "windows")]
            {
                if let Some(window) = app.get_webview_window("splash") {
                    apply_mica(&window, Some(true))
                        .expect("Unsupported platform! 'apply_mica' is only supported on Windows");
                }
                if let Some(window) = app.get_webview_window("main") {
                    apply_mica(&window, Some(true))
                        .expect("Unsupported platform! 'apply_mica' is only supported on Windows");
                }
            }
            
            Ok(())
        })
        .manage(DiscordState(Arc::new(Mutex::new(discord))))
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
            get_pin,
            update_discord_presence,
            toggle_discord_rpc,
            get_discord_setting,
            save_bookmark,
            remove_bookmark,
            get_bookmarks,
            update_leader_name,
            get_user_data,
            parse_bbcode,
            add_custom_tag,
            fetch_page,
            change_mica_theme,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
