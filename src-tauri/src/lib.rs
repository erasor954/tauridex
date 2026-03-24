mod models;
use models::{PokemonSummary, SpeciesResponse, EvolutionChainResponse, EvolutionNode, ItemDetailResponse};
use std::fs;
use tauri::{AppHandle, Manager, Wry};

async fn fill_item_details(node: &mut EvolutionNode) {
    for detail in node.evolution_details.iter_mut() {
        if let Some(item_struct) = &mut detail.item {
            if let Ok(res) = reqwest::get(&item_struct.url).await {
                match res.json::<ItemDetailResponse>().await {
                    Ok(full_item) => item_struct.sprites = Some(full_item.sprites),
                    Err(e) => eprintln!("Failed to parse item details: {}", e), // Helps catch future errors!
                }
            }
        }
        
        if let Some(held_item_struct) = &mut detail.held_item {
            if let Ok(res) = reqwest::get(&held_item_struct.url).await {
                match res.json::<ItemDetailResponse>().await {
                    Ok(full_item) => held_item_struct.sprites = Some(full_item.sprites),
                    Err(e) => eprintln!("Failed to parse held_item details: {}", e),
                }
            }
        }
    }

    for next_node in node.evolves_to.iter_mut() {
        Box::pin(fill_item_details(next_node)).await;
    }
}

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

    let pokemon_url = format!("https://pokeapi.co/api/v2/pokemon/{}", id);
    let species_url = format!("https://pokeapi.co/api/v2/pokemon-species/{}", id);
    
    let (pokemon_res, species_res) = tokio::join!(
        reqwest::get(&pokemon_url),
        reqwest::get(&species_url)
    );

    let pokemon_res = pokemon_res.map_err(|e| e.to_string())?;
    let species_res = species_res.map_err(|e| e.to_string())?;

    let mut pokemon_data = pokemon_res
        .json::<PokemonSummary>()
        .await
        .map_err(|e| e.to_string())?;

    let species_data = species_res
        .json::<SpeciesResponse>()
        .await
        .map_err(|e| e.to_string())?;


    let evo_url = species_data.evolution_chain.url;
    let evo_res = reqwest::get(&evo_url).await.map_err(|e| e.to_string())?;
    let mut evo_data = evo_res
        .json::<EvolutionChainResponse>()
        .await
        .map_err(|e| e.to_string())?;

    fill_item_details(&mut evo_data.chain).await;
    pokemon_data.evolution_chain = Some(evo_data.chain);

    let json_string = serde_json::to_string(&pokemon_data).map_err(|e| e.to_string())?;
    fs::write(file_path, json_string).map_err(|e| e.to_string())?;

    Ok(pokemon_data)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri_specta::Builder::<Wry>::new()
        .commands(tauri_specta::collect_commands![
            get_pokemon
        ]);

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
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}