use serde::{Deserialize, Serialize};
use specta::Type;

// This matches the `PokemonSummary` you used in lib.rs
#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct PokemonSummary {
    pub id: u32,
    pub name: String,
    pub sprites: Sprites,
    pub abilities: Vec<PokemonAbility>,
    pub types: Vec<PokemonTypeSlot>,
    pub stats: Vec<PokemonStat>,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct Sprites {
    pub other: OtherSprites,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct OtherSprites {
    // Map the hyphenated JSON key to a valid Rust identifier
    #[serde(rename = "official-artwork")]
    pub official_artwork: OfficialArtwork,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct OfficialArtwork {
    pub front_default: String,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct PokemonAbility {
    pub ability: NamedAPIResource,
    pub is_hidden: bool,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct PokemonTypeSlot {
    // 'type' is a reserved keyword in Rust, so we rename it
    #[serde(rename = "type")]
    pub type_info: NamedAPIResource,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct PokemonStat {
    pub base_stat: u32,
    pub stat: NamedAPIResource,
}

// A reusable struct for PokeAPI's very common `{ name: string }` pattern
#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct NamedAPIResource {
    pub name: String,
}