use discord_rich_presence::{DiscordIpc, DiscordIpcClient, activity};
use std::sync::{Arc, Mutex};
use std::fs;
use std::path::PathBuf;
use tauri::State;
use serde::{Serialize, Deserialize};

pub struct DiscordState(pub Arc<Mutex<Option<DiscordIpcClient>>>);

#[derive(Serialize, Deserialize, Default)]
struct Preferences {
    discord_enabled: bool,
}

fn get_preferences_path() -> PathBuf {
    let mut path = if cfg!(windows) {
        std::env::var("APPDATA").map(PathBuf::from).unwrap_or_default()
    } else {
        std::env::var("HOME").map(|h| PathBuf::from(h).join(".config")).unwrap_or_default()
    };
    path.push("com.nationstage.dev");
    path.push("preferences.json");
    path
}

fn load_preferences() -> Preferences {
    let path = get_preferences_path();
    if path.exists() {
        if let Ok(content) = fs::read_to_string(&path) {
            if let Ok(prefs) = serde_json::from_str(&content) {
                return prefs;
            }
        }
    }
    Preferences::default()
}

fn save_preferences(prefs: &Preferences) -> Result<(), String> {
    let path = get_preferences_path();
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string(prefs).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn initialize_discord() -> Option<DiscordIpcClient> {
    if !load_preferences().discord_enabled {
        return None;
    }

    let mut client = DiscordIpcClient::new("1331829996586799104")
        .map_err(|e| {
            println!("Failed to create Discord client: {}", e);
            e
        })
        .ok()?;

    if let Err(e) = client.connect() {
        println!("Failed to connect to Discord: {}", e);
        return None;
    }

    // Set initial activity with button
    let activity = activity::Activity::new()
        .state("Just started")
        .details("In menu")
        .assets(activity::Assets::new()
            .large_image("nationstage-logo")
            .large_text("NationStage"))
        .buttons(vec![
            activity::Button::new(
                "Download NationStage",
                "https://www.echolotl.lol/nationstage"
            )
        ]);

    if let Err(e) = client.set_activity(activity) {
        println!("Failed to set Discord activity: {}", e);
    }

    Some(client)
}

#[tauri::command]
pub async fn update_discord_presence(
    discord_state: State<'_, DiscordState>,
    details: Option<String>,
    state: Option<String>,
) -> Result<(), String> {
    if let Some(client) = &mut *discord_state.0.lock().unwrap() {
        let details_str = details.unwrap_or_else(|| "In menu".to_string());
        let state_str = state.unwrap_or_else(|| "Idle".to_string());

        // Create activity with persistent button
        let activity = activity::Activity::new()
            .state(&state_str)
            .details(&details_str)
            .assets(activity::Assets::new()
                .large_image("nationstage-logo")
                .large_text("NationStage"))
            .buttons(vec![
                activity::Button::new(
                    "Download NationStage",
                    "https://www.echolotl.lol/nationstage"
                )
            ]);

        client.set_activity(activity)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn toggle_discord_rpc(
    discord_state: State<'_, DiscordState>,
    enabled: bool,
) -> Result<(), String> {
    let mut prefs = load_preferences();
    prefs.discord_enabled = enabled;
    save_preferences(&prefs)?;

    let mut state = discord_state.0.lock().unwrap();
    if enabled && state.is_none() {
        // Initialize Discord if it's being enabled
        if let Some(client) = initialize_discord() {
            *state = Some(client);
        }
    } else if !enabled {
        // Disconnect and clear Discord if it's being disabled
        if let Some(client) = state.as_mut() {
            let _ = client.close();
        }
        *state = None;
    }

    Ok(())
}

#[tauri::command]
pub fn get_discord_setting() -> bool {
    load_preferences().discord_enabled
}
