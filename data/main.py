import asyncio
import os

from util.cache import fetch_html
from util.config import Config


async def main():
    # load config
    config = Config(os.getenv("OBTAINADEX_SCRAPER_CONFIG", "./config.json"))
    # cache each game's pokedex pages
    for game in config.games:
        _ = [await fetch_html(dex.base_url + dex.pokedex_path, headless=False) for dex in game.dexes]


if __name__ == "__main__":
    asyncio.run(main())
