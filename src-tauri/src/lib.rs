mod models;
use models::PokemonSummary;
use std::fs;
use tauri::{AppHandle, Manager, Wry}; // <-- Added `Wry`

#[tauri::command]
#[specta::specta]
async fn get_pokemon(app: AppHandle, id: String) -> Result<PokemonSummary, String> {
    let mut cache_path = app.path().app_data_dir().map_err(|e| e.to_string())?;
    cache_path.push("cache");

    fs::create_dir_all(&cache_path).map_err(|e| e.to_string())?;

    let file_path = cache_path.join(format!("{}.json", id));

    if file_path.exists() {
        let contents = fs::read_to_string(file_path).map_err(|e| e.to_string())?;
        let json: PokemonSummary = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
        return Ok(json);
    }

    let url = format!("https://pokeapi.co/api/v2/pokemon/{}", id);
    let response = reqwest::get(url).await.map_err(|e| e.to_string())?;
    let pokemon_data = response
        .json::<PokemonSummary>()
        .await
        .map_err(|e| e.to_string())?;

    let json_string = serde_json::to_string(&pokemon_data).map_err(|e| e.to_string())?;
    fs::write(file_path, json_string).map_err(|e| e.to_string())?;

    Ok(pokemon_data)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 1. Setup the Specta Builder using the new syntax
    let builder = tauri_specta::Builder::<Wry>::new()
        .commands(tauri_specta::collect_commands![
            get_pokemon
        ]);

    // 2. Export the bindings (only during development)
    #[cfg(debug_assertions)]
    builder
        .export(
            specta_typescript::Typescript::default(),
            "../src/bindings.ts", // Double-check this path matches your frontend
        )
        .expect("Failed to export specta types");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        // 3. Use the builder's handler to register everything at once
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}