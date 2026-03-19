use std::fs;
use tauri::{AppHandle, Manager};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_pokemon(app: AppHandle, id: String) -> Result<serde_json::Value, String> {
    let mut cache_path = app.path().app_data_dir().map_err(|e| e.to_string())?;
    cache_path.push("cache");

    fs::create_dir_all(&cache_path).map_err(|e| e.to_string())?;

    let file_path = cache_path.join(format!("{}.json", id));

    if file_path.exists() {
        let contents = fs::read_to_string(file_path).map_err(|e| e.to_string())?;
        let json: serde_json::Value = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
        return Ok(json);
    }

    let url = format!("https://pokeapi.co/api/v2/pokemon/{}", id);
    let response = reqwest::get(url).await.map_err(|e| e.to_string())?;
    let pokemon_data = response
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string())?;

    let json_string = serde_json::to_string(&pokemon_data).map_err(|e| e.to_string())?;
    fs::write(file_path, json_string).map_err(|e| e.to_string())?;

    Ok(pokemon_data)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![get_pokemon])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
