import requests
import json
import argparse
import os
from bs4 import BeautifulSoup
from game_config import GAMES_CONFIG


def hash_code(s):
    """Generate consistent hash for Pokemon identification"""
    hash_value = 0
    for char in s:
        hash_value = (hash_value << 5) - hash_value + ord(char)
        hash_value &= 0xFFFFFFFF  # Convert to 32-bit integer
    return hash_value if hash_value < 0x80000000 else hash_value - 0x100000000


def scrape_dex(dex_config):
    """
    Scrape a single dex from Serebii

    Args:
        dex_config: Dictionary containing dex configuration

    Returns:
        List of boxes (2D array) containing Pokemon data
    """
    print(f"  Scraping {dex_config['name']} from {dex_config['url']}...")

    try:
        response = requests.get(dex_config['url'])
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Find the container with Pokemon
        pokemon_container = soup.find("div", id=dex_config['selector_id'])
        if not pokemon_container:
            print(f"  Warning: Could not find container with id '{dex_config['selector_id']}'")
            return []

        # Find all boxes
        pokemon_boxes = pokemon_container.find_all("div", class_=dex_config['box_class'])
        if not pokemon_boxes:
            print(f"  Warning: No boxes found with class '{dex_config['box_class']}'")
            return []

        # Process each box
        boxes_processed = []
        total_pokemon = 0

        for i, box in enumerate(pokemon_boxes):
            # Get box name (optional, for debugging)
            box_name_elem = box.find("td", class_="fooevo")
            box_name = box_name_elem.get_text() if box_name_elem else f"Box {i+1}"

            # Get all Pokemon in this box
            pokemons = box.find_all("td", class_="pkmn")

            box_data = []
            for j, pokemon in enumerate(pokemons):
                try:
                    pokemon_img = pokemon.find("img")
                    if not pokemon_img:
                        continue

                    pokemon_name = pokemon_img.get("alt", "Unknown")
                    pokemon_img_url = pokemon_img.get("src", "")

                    # Calculate dex number (sequential across all boxes)
                    dex_number = total_pokemon + j + 1

                    box_data.append({
                        "name": pokemon_name,
                        "img_url": pokemon_img_url,
                        "hash": hash_code(pokemon_name + pokemon_img_url),
                        "dex_number": dex_number,
                    })
                except Exception as e:
                    print(f"  Warning: Error processing Pokemon in box {i+1}: {e}")
                    continue

            if box_data:
                boxes_processed.append(box_data)
                total_pokemon += len(box_data)

        print(f"  Successfully scraped {total_pokemon} Pokemon in {len(boxes_processed)} boxes")
        return boxes_processed

    except requests.RequestException as e:
        print(f"  Error fetching URL: {e}")
        return []
    except Exception as e:
        print(f"  Error processing dex: {e}")
        return []


def scrape_game(game_id, game_config):
    """
    Scrape all dexes for a game

    Args:
        game_id: Game identifier (e.g., "scarlet-violet")
        game_config: Dictionary containing game configuration

    Returns:
        Dictionary containing game data with all dexes
    """
    print(f"\nScraping {game_config['name']}...")

    game_data = {
        "id": game_id,
        "name": game_config["name"],
        "generation": game_config["generation"],
        "region": game_config["region"],
        "dexes": []
    }

    for dex_id, dex_config in game_config["dexes"].items():
        boxes = scrape_dex(dex_config)

        if boxes:
            pokemon_count = sum(len(box) for box in boxes)
            dex_data = {
                "id": dex_id,
                "name": dex_config["name"],
                "type": dex_config["type"],
                "boxes": boxes,
                "pokemon_count": pokemon_count,
            }
            game_data["dexes"].append(dex_data)

    return game_data


def main():
    parser = argparse.ArgumentParser(description="Scrape Pokemon dex data from Serebii")
    parser.add_argument(
        "--game",
        type=str,
        help="Specific game to scrape (e.g., scarlet-violet, sword-shield). If not specified, scrapes all games.",
    )
    parser.add_argument(
        "--dex",
        type=str,
        help="Specific dex to scrape (requires --game). If not specified, scrapes all dexes for the game.",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="games.json",
        help="Output file path (default: games.json)",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List available games and dexes",
    )

    args = parser.parse_args()

    # List available games and dexes
    if args.list:
        print("\nAvailable games and dexes:")
        for game_id, game_config in GAMES_CONFIG.items():
            print(f"\n{game_id}: {game_config['name']} (Gen {game_config['generation']})")
            for dex_id, dex_config in game_config['dexes'].items():
                print(f"  - {dex_id}: {dex_config['name']} ({dex_config['type']})")
        return

    # Determine what to scrape
    if args.game:
        if args.game not in GAMES_CONFIG:
            print(f"Error: Game '{args.game}' not found in configuration")
            print("Use --list to see available games")
            return

        game_config = GAMES_CONFIG[args.game]

        if args.dex:
            if args.dex not in game_config["dexes"]:
                print(f"Error: Dex '{args.dex}' not found for game '{args.game}'")
                print("Use --list to see available dexes")
                return

            # Scrape single dex
            print(f"\nScraping single dex: {args.game} - {args.dex}")
            dex_config = game_config["dexes"][args.dex]
            boxes = scrape_dex(dex_config)

            if boxes:
                pokemon_count = sum(len(box) for box in boxes)
                output_data = {
                    "id": args.dex,
                    "name": dex_config["name"],
                    "type": dex_config["type"],
                    "boxes": boxes,
                    "pokemon_count": pokemon_count,
                }

                output_file = f"{args.game}-{args.dex}.json"
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(output_data, f, indent=2, ensure_ascii=False)
                print(f"\nSaved to {output_file}")
        else:
            # Scrape all dexes for this game
            game_data = scrape_game(args.game, game_config)

            output_file = f"{args.game}.json"
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(game_data, f, indent=2, ensure_ascii=False)
            print(f"\nSaved to {output_file}")
    else:
        # Scrape all games
        print("Scraping all games...")
        all_games = {"games": []}

        for game_id, game_config in GAMES_CONFIG.items():
            game_data = scrape_game(game_id, game_config)
            if game_data["dexes"]:  # Only add if we got some data
                all_games["games"].append(game_data)

        # Save to output file
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(all_games, f, indent=2, ensure_ascii=False)

        print(f"\n{'='*50}")
        print(f"Scraping complete!")
        print(f"Saved {len(all_games['games'])} games to {args.output}")
        print(f"{'='*50}")


if __name__ == "__main__":
    main()
