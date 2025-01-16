// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
use auth::{CredentialsState, save_credentials, get_credentials, store_autologin, get_stored_autologin};
use std::sync::Mutex;

#[tauri::command]
fn get_user_agent() -> String {
    format!("NationStage/0.1.0 (by Taelboa)")
}


fn main() {
    tauri::Builder::default()
        .manage(CredentialsState(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            save_credentials,
            get_credentials,
            store_autologin,
            get_stored_autologin,
            get_user_agent
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}