# Obtainadex Data Design

## Overview

Per-dex lazy loading architecture with localStorage for user progress. Data is split into:
- **Overview metadata** (~10KB) - lists all games/dexes
- **Individual dex files** (~30-50KB each) - loaded on demand
- **User progress** (localStorage) - per-dex obtained status

---

## File Structure

```
public/data/
├── overview.json
└── games/
    ├── lets-go/kanto.json
    ├── sword-shield/galar.json
    ├── sword-shield/isle-of-armor.json
    ├── sword-shield/crown-tundra.json
    ├── bdsp/sinnoh.json
    ├── legends-arceus/hisui.json
    ├── scarlet-violet/paldea.json
    ├── scarlet-violet/kitakami.json
    ├── scarlet-violet/blueberry.json
    ├── legends-za/luminose.json
    └── home/national.json
```

---

## 1. Overview JSON

**File**: `public/data/overview.json`

```json
{
  "version": "1.0.0",
  "generatedAt": "2025-12-02T10:30:00Z",
  "games": [
    {
      "gameId": "lets-go",
      "gameName": "Pokémon: Let's Go, Pikachu! & Let's Go, Eevee!",
      "shortName": "Let's Go",
      "order": 0,
      "releaseDate": "2018-11-16",
      "dexes": [
        {
          "dexId": "kanto",
          "dexName": "Kanto Pokédex",
          "order": 0,
          "pokemonCount": 153,
          "dataPath": "/data/games/lets-go/kanto.json"
        }
      ]
    }
  ],
  "totalGames": 7,
  "totalDexes": 12,
  "totalUniquePokemon": 1025
}
```

**TypeScript**:
```typescript
interface OverviewData {
  version: string;
  generatedAt: string;
  games: GameMetadata[];
  totalGames: number;
  totalDexes: number;
  totalUniquePokemon: number;
}

interface GameMetadata {
  gameId: string;
  gameName: string;
  shortName: string;
  order: number;
  releaseDate: string;
  dexes: DexMetadata[];
}

interface DexMetadata {
  dexId: string;
  dexName: string;
  order: number;
  pokemonCount: number;
  dataPath: string;
}
```

---

## 2. Dex Data Files

**File**: `public/data/games/{gameId}/{dexId}.json`

```json
{
  "gameId": "lets-go",
  "dexId": "kanto",
  "dexName": "Kanto Pokédex",
  "version": "1.0.0",
  "generatedAt": "2025-12-02T10:30:00Z",
  "pokemon": [
    {
      "dexNumber": 1,
      "pokemonId": "001-bulbasaur",
      "name": "Bulbasaur",
      "imageUrl": "/pokearth/sprites/home/1.png",
      "detailsUrl": "/letsgopikachueevee/pokemon/001-bulbasaur.shtml"
    },
    {
      "dexNumber": 25,
      "pokemonId": "025-pikachu",
      "name": "Pikachu",
      "imageUrl": "/pokearth/sprites/home/25.png",
      "detailsUrl": "/letsgopikachueevee/pokemon/025-pikachu.shtml"
    }
  ]
}
```

**TypeScript**:
```typescript
interface DexData {
  gameId: string;
  dexId: string;
  dexName: string;
  version: string;
  generatedAt: string;
  pokemon: Pokemon[];
}

interface Pokemon {
  dexNumber: number;
  pokemonId: string;      // Stable ID extracted from details URL
  name: string;
  imageUrl: string;       // Game-specific sprite
  detailsUrl: string;
}
```

---

## 3. Pokemon ID System

**Format**: Extracted from Serebii details URL
**Examples**:
- `/pokemon/025-pikachu.shtml` → `"025-pikachu"`
- `/pokemon/050-diglett-alola.shtml` → `"050-diglett-alola"`

**Python Extraction**:
```python
def extract_pokemon_id(details_url: str) -> str:
    """Extract stable Pokemon ID from Serebii URL."""
    match = re.match(r'.*/(\d{3,4}-.+?)\.shtml', details_url)
    if match:
        return match.group(1)
    raise ValueError(f"Could not extract Pokemon ID from: {details_url}")
```

**Why This Works**:
- Same Pokémon across games = same ID (enables cross-dex referencing)
- Stable across image URL changes
- Handles forms automatically
- Human-readable

---

## 4. User Progress Storage

**localStorage Keys**: `obtainadex_{gameId}_{dexId}`

**Examples**:
- `obtainadex_lets-go_kanto`
- `obtainadex_sword-shield_galar`

**Format**:
```json
{
  "version": "1.0.0",
  "gameId": "lets-go",
  "dexId": "kanto",
  "lastModified": "2025-12-02T15:30:00Z",
  "obtained": {
    "001-bulbasaur": true,
    "025-pikachu": true,
    "151-mew": true
  }
}
```

**TypeScript**:
```typescript
interface UserDexProgress {
  version: string;
  gameId: string;
  dexId: string;
  lastModified: string;
  obtained: {
    [pokemonId: string]: boolean;
  };
}
```

**Future Extension (Own Trainer ID)**:
```typescript
interface UserDexProgress {
  version: "2.0.0";
  // ... same fields ...
  progress: {
    [pokemonId: string]: {
      obtained: boolean;
      ownTrainerId: boolean;  // New field
    };
  };
}
```

---

## 5. Cross-Dex Reference

When enabled, show Pokémon obtained in other dexes with origin badge.

**Example**:
1. User obtains Pikachu in Let's Go
2. In Pokémon Home (with cross-ref enabled), Pikachu shows: ✓ Obtained 🎮 LG

**Lookup Logic**:
```typescript
function isPokemonObtainedAnywhere(pokemonId: string): {
  obtained: boolean;
  originGame?: string;
  originDex?: string;
} {
  // Scan all localStorage keys matching "obtainadex_*"
  for (const key of getAllLocalStorageKeys("obtainadex_")) {
    const progress = JSON.parse(localStorage.getItem(key));
    if (progress.obtained[pokemonId]) {
      return {
        obtained: true,
        originGame: progress.gameId,
        originDex: progress.dexId
      };
    }
  }
  return { obtained: false };
}
```

---

## 6. Export/Import

**Export Format**:
```json
{
  "version": "1.0.0",
  "exportedAt": "2025-12-02T16:00:00Z",
  "appVersion": "1.0.0",
  "dexes": [
    {
      "gameId": "lets-go",
      "dexId": "kanto",
      "lastModified": "2025-12-02T15:30:00Z",
      "obtained": {
        "001-bulbasaur": true,
        "025-pikachu": true
      }
    }
  ],
  "stats": {
    "totalPokemonObtained": 2,
    "uniquePokemon": 2,
    "totalDexes": 1,
    "completedDexes": []
  }
}
```

**TypeScript**:
```typescript
interface ExportData {
  version: string;
  exportedAt: string;
  appVersion: string;
  dexes: UserDexProgress[];
  stats: {
    totalPokemonObtained: number;
    uniquePokemon: number;
    totalDexes: number;
    completedDexes: string[];
  };
}
```

---

## 7. Data Flow

**App Start**:
1. Load `overview.json` (~10KB)
2. Show game/dex selector
3. User selects dex
4. Load that dex's JSON file
5. Load that dex's localStorage progress

**Dex Switch**:
1. Save current progress to localStorage
2. Unload current dex data
3. Load new dex JSON + localStorage

---

## Storage Capacity

- **localStorage limit**: 5-10MB
- **Per-dex size**: ~5-10KB
- **12 dexes**: ~120KB total
- **Headroom**: Can support 500+ dexes

---

## Migration Strategy

If Serebii URL structure changes:
1. Update regex pattern in scraper
2. Create ID mapping file (`old_id → new_id`)
3. Run migration script on user's localStorage
4. Bump version to "2.0.0"

**Note**: Serebii URL structure has been stable for 10+ years.
