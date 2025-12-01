# Obtainadex Refresh

Currently, Obtainadex only shows the recommended box layout
from https://www.serebii.net/pokemonhome/depositablepokemon.shtml, but since Pokémon Home offers rewards for
completing regional-dexes in games, it might be useful to have a per-game and per-game-dex view.

## Data Sources

Pokémon Home will be special based off of https://www.serebii.net/pokemonhome/depositablepokemon.shtml. It'll contain a
full list of all the Pokémon, and I can include a _forms_ toggle specifically for Pokémon Home.

For other Pokémon games I'll include all their dexes, so for some it'll be the regional dex plus the national dex or DLC
dexes. Additionally, I'm only going to include games released on the Switch to reduce the amount of data, but might
consider returning to include the DS games and earlier.

- Pokémon: Let's Go, Pikachu! & Let's Go, Eevee!
    - Kanto: https://www.serebii.net/letsgopikachueevee/kantopokedex.shtml
- Pokémon Sword & Shield
    - Galar: https://www.serebii.net/swordshield/galarpokedex.shtml
    - Isle of Armor: https://www.serebii.net/swordshield/isleofarmordex.shtml
    - The Crown Tundra: https://www.serebii.net/swordshield/thecrowntundradex.shtml
- Pokémon Brilliant Diamond & Shining Pearl
    - Sinnoh: https://www.serebii.net/brilliantdiamondshiningpearl/sinnohpokedex.shtml
    - National (dexes merged):
        - https://www.serebii.net/brilliantdiamondshiningpearl/sinnohpokedex.shtml
        - https://www.serebii.net/brilliantdiamondshiningpearl/otherpokemon.shtml
- Pokémon Legends: Arceus
    - Hisui: https://www.serebii.net/legendsarceus/hisuipokedex.shtml
- Pokémon Scarlet & Violet
    - Paldea: https://www.serebii.net/scarletviolet/paldeapokedex.shtml
    - Kitakami: https://www.serebii.net/scarletviolet/kitakamipokedex.shtml
    - Blueberry: https://www.serebii.net/scarletviolet/blueberrypokedex.shtml
- Pokémon Legends: Z-A:
    - Luminose: https://www.serebii.net/legendsz-a/availablepokemon.shtml
- Pokémon Home:
    - All: https://www.serebii.net/pokemonhome/depositablepokemon.shtml

## Features

- Contains the individual dexes for all the Switch-era Pokémon games
- Dexes are grouped by game and broken into the individual relevant dexes
- Toggle to enable the same Pokémon selected in one dex to show as collected in all dexes
    - Default behaviour keeps them separate; when toggled, it'll show the origin dex/game it was selected in
- Data is saved in the website local storage with the ability to export as JSON to be re-imported or shared
- Toggles will be available to toggle an entire box as obtained
- Each Pokémon in the boxes also links to the relevant Serebii page to show where it is obtained in the specific game

## Data Scraping

The data for Obtainadex primarily comes from Serebii as it's a reliable source of data for Pokémon games.

Within the `data` directory there is a script which uses Playwright to scrape the data for each Pokédex. The HTML files
are also stored in here for each Pokédex so the Serebii site does not need to be queried everytime. This includes the
data for each Pokémon.

The reasoning for using Playwright instead of the request standard library is due to some sites requiring JS to be run
to show the data in the DOM. This allows all JS to be executed and the HTML content can be scraped automatically.

There is a `data/config.json` which defines where the data for each Pokémon should be gathered, it also includes the
selectors Playwright should use to pull out the data we're interested in. The config is structured like so:

```json
{
  "Pokémon: Let's Go, Pikachu! & Let's Go, Eevee!": [
    {
      // Order Pokedex comes in game
      "order": 0,
      // Name of this Pokedex
      "name": "Kanto",
      // Datasource base url
      "base_url": "https://www.serebii.net",
      // Path from base url to the Pokedex data
      "pokedex_path": "/letsgopikachueevee/kantopokedex.shtml",
      // Main selector to get array of Pokemon
      "row_selector": "table tr:nth-of-type(n+3)",
      "selectors": {
        // Selector for the Pokedex number of the Pokemon entry
        "pokedex_number": {
          // Query for finding the correct element
          "selector": "td:nth-of-type(1)",
          // Type of element/data within the element
          "type": "text"
        },
        // Selector for the link to data about the Pokemon
        "details_link": {
          "selector": "td:nth-of-type(2) a",
          "attr": "href"
        },
        // Selector for the image link for the Pokemon
        "image_url": {
          "selector": "td:nth-of-type(2) img",
          "attr": "src"
        },
        // Selector for the name of the Pokemon
        "name": {
          "selector": "td:nth-of-type(3) a",
          "type": "text"
        }
      }
    }
  ]
}
```

The HTML file cache is stored in a folder structure which mirrors the URL path, and where there's query parameters it
encodes them using base64. This is primarily to make it easy to store files and cache, since some files might be
duplicates.

For example:

- `https://www.serebii.net/letsgopikachueevee/kantopokedex.shtml`
    - `cache/html/www.serebii.net/letsgopikachueevee/kantopokedex.shtml`
- `https://www.serebii.net/pokedex-swsh/growlithe/?form=galarian&view=all` (fake example to show a query)
    - `cache/html/www.serebii.net/pokedex-swsh/growlithe/_query_Zm9ybT1nYWxhcmlhbiZ2aWV3PWFsbA==.html`
