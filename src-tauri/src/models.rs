use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct PokemonSummary {
    pub id: u16,
    pub name: String,
    pub sprites: Sprites,
    pub abilities: Vec<PokemonAbility>,
    pub types: Vec<PokemonTypeSlot>,
    pub stats: Vec<PokemonStat>,

    #[serde(default)]
    pub evolution_chain: Option<EvolutionNode>,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct Sprites {
    pub other: OtherSprites,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct OtherSprites {
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
    #[serde(rename = "type")]
    pub type_info: NamedAPIResource,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct PokemonStat {
    pub base_stat: u8,
    pub stat: NamedAPIResource,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct NamedAPIResource {
    pub name: String,
}

// #[derive(Serialize, Deserialize, Type, Debug, Clone)]
// pub struct NamedAPIResourceWithUrl {
//     pub name: String,
//     pub url: String,
// }

// ----------EVOLUTION----------
#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct EvolutionChainResponse {
    pub chain: EvolutionNode,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct EvolutionNode {
    pub species: NamedAPIResource, 
    #[serde(default)]
    pub evolves_to: Vec<EvolutionNode>,
    #[serde(default)]
    pub evolution_details: Vec<EvolutionDetails>
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct EvolutionDetails{
    pub held_item: Option<Item>,
    pub item: Option<Item>,
    pub min_level: Option<u32>,
    pub trigger: NamedAPIResource,

}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct SpeciesResponse {
    pub evolution_chain: ApiResourceUrl,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct ApiResourceUrl {
    pub url: String,
}

// -------------ITEM-------------
#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct Item {
    pub name: String,
    pub url: String,

    #[serde(default)]
    pub sprites: Option<ItemSprites>,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone)]
pub struct ItemSprites {
    pub default: String,
}

#[derive(serde::Deserialize)]
pub struct ItemDetailResponse {
    pub sprites: ItemSprites,
}