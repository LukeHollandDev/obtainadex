# Obtainadex

TODO List:

- Look into updating how the data is stored regarding the users data.
  - Currently doing expensive searches due to not using a hash map.
  - Try to change to use hash map, will need to also account for migration from older format.

## Scraper

Scraper is a Python tool which scrapes https://www.serebii.net/pokemonhome/depositablepokemon.shtml to obtain the Pokemon data.

The scraper produces a `pokemon.json` file which contains a list of all the boxes, and each box containing a list of Pokemon.

This should be placed in the `src/assets` directory in the frontend code.

To run the scraper, create a virtual environment:

```sh
python -m venv env
```

Then source the environment and install the dependencies:

```sh
source env/bin/activate && pip install -r requirements.txt
```

Finally, run the script:

```sh
python main.py
```

## Frontend

Install Deno so that the CLI can be used.

Navigate to the `obtainadex` directory.

```sh
cd obtainadex
```

Run the dev environment using:

```sh
deno task dev
```

Compile a static build using:

```sh
deno task build
```
