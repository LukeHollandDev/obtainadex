import json
import sys


# Define the hash function
def hash_code(s):
    hash_value = 0
    for char in s:
        hash_value = (hash_value << 5) - hash_value + ord(char)
        hash_value &= 0xFFFFFFFF  # Convert to 32-bit integer
    return hash_value if hash_value < 0x80000000 else hash_value - 0x100000000


# Function to convert the JSON format
def convert_pokemon_data(input_data):
    result = {}
    for entry in input_data:
        name = entry["name"]
        img_url = entry["img_url"]
        status = entry["status"]

        if status == 0:
            continue

        # Generate the key using name and hash
        key = f"{name}_{hash_code(name + img_url)}"

        # Assign the status to the key
        result[key] = {"status": status}

    return result


# Main function to handle file input/output
def main(input_file_path, output_file_path):
    # Load input JSON from the specified file
    with open(input_file_path, "r") as input_file:
        input_data = json.load(input_file)

    # Convert data
    output_data = convert_pokemon_data(input_data)

    # Write output JSON to the specified file
    with open(output_file_path, "w") as output_file:
        json.dump(output_data, output_file, indent=2)


# Entry point
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert.py <input_file_path> <output_file_path>")
        sys.exit(1)

    input_file_path = sys.argv[1]
    output_file_path = sys.argv[2]
    main(input_file_path, output_file_path)
