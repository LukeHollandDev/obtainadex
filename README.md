# Obtainadex

Obtainadex is a digital checklist to help you complete your Pokédex in all of your Pokémon Switch games and Pokémon
Home. It provides a nice interface to easily keep track of which Pokémon you're missing. To make it easier, it presents
the Pokémon in the form of PC boxes, the 6x5 grid showing 30 per box.

Since Pokémon Home offers you rewards for each Pokédex you complete, Obtainadex organises each Pokédex based on the game
it comes from. This enables you to have an overview on your progress in each game!

## Features

- Contains the individual dexes for all the Switch-era Pokémon games (and Home)
- Dexes are grouped by game and broken into the individual relevant dexes
- Toggle to enable the same Pokémon selected in one dex to show as collected in all dexes
    - Default behaviour keeps them separate
    - When toggled, it'll show the origin dex/game it was selected in
- Data is saved in the website local storage with the ability to export as JSON to be imported or shared
- Each Pokémon in the boxes has a link to the relevant Serebii page to show where it is obtained in the specific game
- Bulk controls to quickly mark all within a box as obtained or unmark them all

## Development

TODO: add details about how to work with the codebase.

Plan is to drive it all through `Makefile` so it's pretty easy to pick up if you're on a Unix-based system.

## Data

All the data is currently sourced from [Serebii](https://www.serebii.net/) as it provides accurate data for each game
and their different Pokédexes.

### Supported Games/Pokédexes

Right now only the Switch games, including Pokémon Home, are supported.

- Pokémon Home: https://www.serebii.net/pokemonhome/depositablepokemon.shtml
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

### Data Configuration

The scraping of the data from [Serebii](https://www.serebii.net/) is driven by the Python application in [data](./data)
it uses Playwright to load the website, this allows it to settle and then have all the HTML available. Then, the HTML
files are saved to a caching directory, so we do not need to keep requesting data from the website.

All the sources and selector configurations are stored within the [configuration file](./data/config.json). This defines
the games and their Pokédexes and also provides the details on the site to get the data from and provides the selectors
to collect the required information. The configuration can be changed, and you can even change it to use sites which are
not the ones currently configured.

Here's an overview of how that configuration is structured:

```json
{
  // Name of the Pokémon game the Pokédexes belong to
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
