# Obtainadex

A web application for tracking Pokemon collection progress across multiple games and Pokedexes.

## Features

- **Multi-Game Support**: Track Pokemon across different games (Scarlet/Violet, Sword/Shield, Legends Arceus, BDSP, and Pokemon Home)
- **Multiple Dexes per Game**: Support for regional, national, and special Pokedexes
- **Progress Tracking**: Mark Pokemon as obtained or with your own trainer ID
- **Dashboard**: View progress across all games and dexes at a glance
- **Import/Export**: Backup your collection data in JSON format
- **PDF Generation**: Download printable checklists for offline tracking
- **Data Migration**: Automatically migrates data from older single-game format

## Structure

```
obtainadex/
├── scraper/                 # Python scraper for Pokemon data
│   ├── main.py             # Multi-game scraper
│   ├── game_config.py      # Game and dex configuration
│   └── requirements.txt    # Python dependencies
└── obtainadex/             # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── hooks/          # Custom hooks
    │   ├── context/        # React context
    │   ├── assets/         # Game data (games.json)
    │   └── pdf/            # PDF generation
    └── deno.json          # Deno configuration
```

## Scraper

The scraper is a Python tool that scrapes Pokemon data from Serebii.net for multiple games and dexes.

### Configuration

Games and dexes are configured in `scraper/game_config.py`. Currently supports:
- Pokemon Scarlet/Violet (Paldea, Kitakami, Blueberry)
- Pokemon Sword/Shield (Galar, Isle of Armor, Crown Tundra)
- Pokemon Legends: Arceus (Hisui)
- Pokemon BDSP (Sinnoh)
- Pokemon Home (Depositable Pokemon)

### Setup

Create a virtual environment:

```sh
cd scraper
python -m venv env
```

Activate the environment and install dependencies:

```sh
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
```

### Usage

List available games and dexes:

```sh
python main.py --list
```

Scrape all games and dexes:

```sh
python main.py
```

Scrape a specific game:

```sh
python main.py --game scarlet-violet
```

Scrape a specific dex:

```sh
python main.py --game scarlet-violet --dex paldea
```

The scraper outputs structured JSON files with Pokemon data including:
- Pokemon name
- Image URL
- Hash for unique identification
- Dex number

## Frontend

### Prerequisites

Install [Deno](https://deno.land/) to run the frontend.

### Development

Navigate to the frontend directory:

```sh
cd obtainadex
```

Run the development server:

```sh
deno task dev
```

Build for production:

```sh
deno task build
```

Preview production build:

```sh
deno task preview
```

## Data Format

### Game Data Structure

Games and dexes are stored in `src/assets/games.json`:

```json
{
  "games": [
    {
      "id": "scarlet-violet",
      "name": "Pokemon Scarlet/Violet",
      "generation": 9,
      "region": "Paldea",
      "dexes": [
        {
          "id": "paldea",
          "name": "Paldea Dex",
          "type": "regional",
          "boxes": [[/* Pokemon data */]],
          "pokemon_count": 400
        }
      ]
    }
  ]
}
```

### User Data Storage

User progress is stored in localStorage with the following structure:

```json
{
  "game-id": {
    "dex-id": {
      "PokemonName_hash": { "status": 1 },  // 1 = obtained
      "PokemonName_hash": { "status": 2 }   // 2 = own trainer ID
    }
  }
}
```

## Usage

1. **Select a Game**: On the dashboard, choose which game and Pokedex you want to track
2. **Mark Pokemon**: Click on Pokemon to cycle through statuses:
   - First click: Mark as obtained (✓)
   - Second click: Mark as having your trainer ID (⭐)
   - Third click: Unmark
3. **Bulk Operations**: Use "Mark All" or "Clear All" buttons on each box
4. **Export Data**: Download your progress as JSON
   - Export current dex
   - Export all dexes for current game
   - Export all data for all games
5. **Import Data**: Restore from previously exported JSON files
6. **Generate PDFs**: Download printable checklists
   - Unobtained Pokemon
   - Pokemon without your trainer ID
   - Complete collection with status

## Data Migration

The app automatically migrates data from the previous single-game format (v1) to the new multi-game format (v2) on first load. Old data will be preserved under "Pokemon Home > Depositable Pokemon".

## TODO

- [ ] Update PDF generation to maintain box order
- [ ] Add more games (Let's Go, Older generations)
- [ ] Add filtering and search functionality
- [ ] Add statistics and completion tracking
- [ ] Add theme customization

## License

This project uses data from Serebii.net for Pokemon information. Please credit Serebii.net when using this tool.
