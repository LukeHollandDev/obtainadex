# Configuration for Pokemon games and their dexes
# Defines which games to scrape and their Serebii URLs

GAMES_CONFIG = {
    "scarlet-violet": {
        "name": "Pokemon Scarlet/Violet",
        "generation": 9,
        "region": "Paldea",
        "dexes": {
            "paldea": {
                "name": "Paldea Dex",
                "type": "regional",
                "url": "https://www.serebii.net/scarletviolet/paldeapokedex.shtml",
                "selector_id": "normal",  # div id containing pokemon
                "box_class": "block_year",  # class for box containers
            },
            "kitakami": {
                "name": "Kitakami Dex",
                "type": "regional",
                "url": "https://www.serebii.net/scarletviolet/kitakamipokedex.shtml",
                "selector_id": "normal",
                "box_class": "block_year",
            },
            "blueberry": {
                "name": "Blueberry Dex",
                "type": "regional",
                "url": "https://www.serebii.net/scarletviolet/blueberrypokedex.shtml",
                "selector_id": "normal",
                "box_class": "block_year",
            },
        },
    },
    "sword-shield": {
        "name": "Pokemon Sword/Shield",
        "generation": 8,
        "region": "Galar",
        "dexes": {
            "galar": {
                "name": "Galar Dex",
                "type": "regional",
                "url": "https://www.serebii.net/swordshield/galarpokedex.shtml",
                "selector_id": "normal",
                "box_class": "block_year",
            },
            "isle-of-armor": {
                "name": "Isle of Armor Dex",
                "type": "regional",
                "url": "https://www.serebii.net/swordshield/isleofarmordex.shtml",
                "selector_id": "normal",
                "box_class": "block_year",
            },
            "crown-tundra": {
                "name": "Crown Tundra Dex",
                "type": "regional",
                "url": "https://www.serebii.net/swordshield/crowntundradex.shtml",
                "selector_id": "normal",
                "box_class": "block_year",
            },
        },
    },
    "legends-arceus": {
        "name": "Pokemon Legends: Arceus",
        "generation": 8,
        "region": "Hisui",
        "dexes": {
            "hisui": {
                "name": "Hisui Dex",
                "type": "regional",
                "url": "https://www.serebii.net/legendsarceus/hisuipokedex.shtml",
                "selector_id": "normal",
                "box_class": "block_year",
            },
        },
    },
    "bdsp": {
        "name": "Pokemon Brilliant Diamond/Shining Pearl",
        "generation": 8,
        "region": "Sinnoh",
        "dexes": {
            "sinnoh": {
                "name": "Sinnoh Dex",
                "type": "regional",
                "url": "https://www.serebii.net/brilliantdiamondshiningpearl/sinnohpokedex.shtml",
                "selector_id": "normal",
                "box_class": "block_year",
            },
        },
    },
    "pokemon-home": {
        "name": "Pokemon Home",
        "generation": 9,
        "region": "All Regions",
        "dexes": {
            "depositable": {
                "name": "Depositable Pokemon",
                "type": "special",
                "url": "https://www.serebii.net/pokemonhome/depositablepokemon.shtml",
                "selector_id": "normal",
                "box_class": "block_year",
            },
        },
    },
}
