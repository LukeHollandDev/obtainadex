import asyncio
import os
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
from tqdm import tqdm

from util.cache import fetch_html, load_html
from util.config import Config

# Delay between requests in seconds to avoid overwhelming the server
REQUEST_DELAY = 1.0


async def extract_pokemon_links(dex_url: str, dex) -> list[str]:
    """Extract all Pokemon detail links from a dex page."""
    # Try to load from cache first
    html = load_html(dex_url)

    if html is None:
        html = await fetch_html(dex_url, headless=True)
        await asyncio.sleep(REQUEST_DELAY)

    # Parse with BeautifulSoup
    soup = BeautifulSoup(html, 'html.parser')

    # Find all rows using the configured selector
    rows = soup.select(dex.row_selector)

    # Extract detail links
    links = []
    details_selector = dex.selectors.get("details_link")

    if not details_selector:
        return links

    for row in rows:
        link_element = row.select_one(details_selector.selector)
        if link_element and link_element.has_attr('href'):
            # Convert relative URL to absolute
            full_url = urljoin(dex.base_url, link_element['href'])
            links.append(full_url)

    return links


async def main():
    # Load config
    config = Config(os.getenv("OBTAINADEX_SCRAPER_CONFIG", "./config.json"))

    # Launch browser once for all fetches
    playwright = await async_playwright().start()
    browser = await playwright.chromium.launch(headless=True)

    try:
        print("🚀 Starting comprehensive cache build (headless mode)...\n")

        for game in config.games:
            print(f"\n📦 {game.name}")

            for dex in game.dexes:
                dex_url = dex.base_url + dex.pokedex_path
                print(f"  📋 {dex.name}")

                # Step 1: Cache the dex page
                await fetch_html(dex_url, headless=True, browser=browser)
                await asyncio.sleep(REQUEST_DELAY)

                # Step 2: Extract all Pokemon detail links
                pokemon_links = await extract_pokemon_links(dex_url, dex)
                print(f"     Found {len(pokemon_links)} Pokemon")

                # Step 3: Cache each Pokemon detail page with progress bar
                cached_count = 0
                fetched_count = 0

                with tqdm(total=len(pokemon_links), desc="     Caching", unit="page") as pbar:
                    for link in pokemon_links:
                        # Check if already cached
                        if load_html(link) is not None:
                            cached_count += 1
                        else:
                            await fetch_html(link, headless=True, browser=browser)
                            fetched_count += 1
                            await asyncio.sleep(REQUEST_DELAY)
                        pbar.update(1)

                print(f"     ✓ {cached_count} already cached, {fetched_count} newly fetched")

        print("\n🎉 Cache build complete!")

    finally:
        await browser.close()
        await playwright.stop()


if __name__ == "__main__":
    asyncio.run(main())
