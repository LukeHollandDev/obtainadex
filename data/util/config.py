import json
from typing import Dict, List


class Selector:
    selector: str
    type: str

    def __init__(self, data: Dict[str, str]) -> None:
        if not isinstance(data, dict):
            raise TypeError(f"Selector data must be a dict, got {type(data).__name__}")

        self.selector = data.get("selector")
        if not self.selector:
            raise ValueError("Selector 'selector' field is required")

        self.type = data.get("type")
        if not self.type:
            raise ValueError("Selector 'type' field is required")


class Dex:
    order: int
    name: str
    base_url: str
    pokedex_path: str
    row_selector: str
    selectors: Dict[str, Selector]

    def __init__(self, data: Dict) -> None:
        if not isinstance(data, dict):
            raise TypeError(f"Dex data must be a dict, got {type(data).__name__}")

        for field in ["order", "name", "base_url", "pokedex_path", "row_selector"]:
            if field not in data:
                raise KeyError(f"Dex entry missing required field: '{field}'")
            setattr(self, field, data[field])

        raw_selectors = data.get("selectors")
        if not isinstance(raw_selectors, dict):
            raise ValueError(f"Dex '{self.name}' selectors must be a dict")

        self.selectors = {}
        for key, value in raw_selectors.items():
            try:
                self.selectors[key] = Selector(value)
            except Exception as e:
                raise ValueError(f"Error in selector '{key}' of Dex '{self.name}': {e}")


class Game:
    name: str
    dexes: List[Dex]

    def __init__(self, name: str, dexes: List[Dict]) -> None:
        if not isinstance(dexes, list):
            raise TypeError(f"Game '{name}' must map to a list of Pokedex configurations")

        self.name = name
        self.dexes = [Dex(dex) for dex in dexes]


class Config:
    games: List[Game]

    def __init__(self, config_path: str) -> None:
        with open(config_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if not isinstance(data, dict):
            raise TypeError("Config root must be a dictionary mapping game names to dex lists")

        self.games = [Game(name, dexes) for name, dexes in data.items()]
