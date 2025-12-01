import base64
import os
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

from playwright.async_api import async_playwright, Browser

CACHE_ROOT = Path(os.getenv("OBTAINADEX_CACHE_PATH", "./cache/html"))
HTML_EXTENSIONS = {"html", "htm", "shtml"}


def encode_url_to_path(url: str) -> Path:
    parsed = urlparse(url)
    hostname = parsed.hostname
    path = parsed.path
    query = parsed.query

    ends_with_slash = path.endswith("/")
    path = path.strip("/")
    parts = path.split("/") if path else []

    if query:
        if parts:
            folder = parts[:-1]
            last_segment = parts[-1]
            # store queries using base64 encoding
            encoded_query = base64.urlsafe_b64encode(query.encode()).decode()
            filename = f"_query_{encoded_query}.html"
            full_parts = [hostname] + folder + [last_segment]
        else:
            encoded_query = base64.urlsafe_b64encode(query.encode()).decode()
            filename = f"_query_{encoded_query}.html"
            full_parts = [hostname]
    else:
        # if not HTML file extension save to own index.html file
        if ends_with_slash or not parts:
            filename = "index.html"
            full_parts = [hostname] + parts
        else:
            # check if it's in the list of known HTML extensions, otherwise append .html
            last_segment = parts[-1]
            # Check if filename already has a known HTML extension
            if not any(last_segment.endswith(f".{ext}") for ext in HTML_EXTENSIONS):
                last_segment += ".html"
            filename = last_segment
            full_parts = [hostname] + parts[:-1]

    full_path = CACHE_ROOT / Path(*full_parts) / filename
    full_path.parent.mkdir(parents=True, exist_ok=True)
    return full_path


# encode the URL and then save to file using the encoded path
def save_html(url: str, html: str) -> Path:
    path = encode_url_to_path(url)
    path.write_text(html, encoding="utf-8")
    return path


# encode the url and if file exists return the contents
def load_html(url: str) -> str | None:
    path = encode_url_to_path(url)
    if path.is_file():
        return path.read_text(encoding="utf-8")
    return None


# use playwright to fetch HTML from a give URL if there is no cache hit on the url
async def fetch_html(url: str, headless: bool = True, browser: Optional[Browser] = None) -> str:
    cached = load_html(url)
    if cached is not None:
        return cached

    # Determine if we need to launch a new browser
    close_browser = False
    if browser is None:
        # Launch new browser
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(headless=headless)
        close_browser = True

    html_page = await browser.new_page()
    close_page = True

    await html_page.goto(url)
    html = await html_page.content()

    if close_page:
        await html_page.close()
    if close_browser:
        await browser.close()

    save_html(url, html)
    return html
