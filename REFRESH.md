# Obtainadex Refresh

Currently, Obtainadex only shows the recommended box layout
from https://www.serebii.net/pokemonhome/depositablepokemon.shtml, but since Pokémon Home offers rewards for
completing regional-dexes in games, it might be useful to have a per-game and per-game-dex view.

I have already in another branch let Claude Code have a stab at this just out of curiosity and found it to be quite a
cool idea. So I want to build it properly in this branch.

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
- Pokemon Legends: Z-A:
    - Luminose: https://www.serebii.net/legendsz-a/availablepokemon.shtml

## Features

- Contains the individual dexes for all the Switch-era Pokémon games
- Dexes are grouped by game and broken into the individual relevant dexes
- Toggle to enable the same Pokémon selected in one dex to show as collected in all dexes
    - Default behaviour keeps them separate; when toggled, it'll show the origin dex/game it was selected in
- Data is saved in the website local storage with the ability to export as JSON to be re-imported or shared
- Toggles will be available to toggle an entire box as obtained
- Each Pokémon in the boxes also links to the relevant Serebii page to show where it is obtained in the specific game
