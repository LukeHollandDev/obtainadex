import requests, html.parser, os, json
from bs4 import BeautifulSoup

current_dir = os.path.dirname(os.path.abspath(__file__))

response = requests.get("https://www.serebii.net/pokemonhome/depositablepokemon.shtml")
soup = BeautifulSoup(response.text, "html.parser")

# get the normal div
normal_pokemon = soup.findAll("div", id = "normal")[0]
# get all the boxes
pokemon_boxes = normal_pokemon.findAll("div", class_ = "block_year")
# process each box
pokemon_boxes_processed = []
for i, box in enumerate(pokemon_boxes):
    box_name = box.findAll('td', class_ = "fooevo")[0].get_text()
    pokemons = box.findAll('td', class_ = "pkmn")
    # process each pokemon
    pokemon_boxes_processed.append([])
    for pokemon in pokemons:
        pokemon_name = pokemon.a.img['alt']
        pokemon_img_url = pokemon.a.img['src']
        pokemon_boxes_processed[i].append({
            'name': pokemon_name,
            'img_url': pokemon_img_url
        })

# dump to json file
with open('pokemon.json', 'w', encoding='utf-8') as f:
    json.dump(pokemon_boxes_processed, f, indent=2)