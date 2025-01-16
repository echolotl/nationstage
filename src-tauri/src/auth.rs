use serde::{Deserialize, Serialize};
use tauri::State;
use std::sync::Mutex;
use std::fs;
use tauri::AppHandle;

#[derive(Serialize, Deserialize, Clone)]
pub struct Credentials {
    nation: String,
    autologin: String,
    pin: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct StoredAutologin {
    pub nation: String,
    pub autologin: String,
}

// Store credentials in memory
pub struct CredentialsState(pub Mutex<Option<Credentials>>);

fn get_storage_path(app: &AppHandle) -> std::path::PathBuf {
    tauri::Manager::path(app)
        .app_data_dir()
        .expect("failed to get app data directory")
        .join("credentials.json")
}

#[tauri::command]
pub async fn save_credentials(
    state: State<'_, CredentialsState>,
    credentials: Credentials,
) -> Result<(), String> {
    *state.0.lock().unwrap() = Some(credentials);
    Ok(())
}

#[tauri::command]
pub async fn store_autologin(
    app: AppHandle,
    nation_name: String,
    autologin: String,
) -> Result<(), String> {
    let storage = StoredAutologin {
        nation: nation_name,
        autologin,
    };
    
    let path = get_storage_path(&app);
    
    // Create directory if it doesn't exist
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    
    // Save to file
    let json = serde_json::to_string(&storage).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub async fn get_stored_autologin(
    app: AppHandle,
) -> Result<Option<StoredAutologin>, String> {
    let path = get_storage_path(&app);
    
    if !path.exists() {
        return Ok(None);
    }
    
    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let stored: StoredAutologin = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    
    Ok(Some(stored))
}

#[tauri::command]
pub async fn get_credentials(
    state: State<'_, CredentialsState>,
) -> Result<Option<Credentials>, String> {
    Ok(state.0.lock().unwrap().clone())
}