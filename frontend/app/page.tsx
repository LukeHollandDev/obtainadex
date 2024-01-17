"use client";

import Image from 'next/image';
import pokemonData from '@/public/pokemon.json';
import { useState, useEffect, useRef } from 'react';

interface Pokemon {
  name: string;
  img_url: string;
  status: number;
}

const savePokemon = (pokemon: Pokemon[]) => {
  localStorage.setItem('selectedPokemon', JSON.stringify(pokemon))
}

const getObtainedStatus = (currentStatus: number) => {
  if (currentStatus === 0 || currentStatus === null) {
    return 1
  } else if (currentStatus === 1) {
    return 2
  }
  return 0
}

const handleExport = (data: any) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'pokemon_obtainadex_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function Home() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[]>([]);
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    const loadPokemon = () => {
      const pokemon: Pokemon[] = JSON.parse(localStorage.getItem('selectedPokemon') as string) || []
      if (pokemon.length === 0) {
        let index = 0
        for (let i = 0; i < pokemonData.length; i++) {
          for (let j = 0; j < pokemonData[i].length; j++) {
            // each box has 30 except for the last
            pokemon[i * 30 + j] = {
              ...pokemonData[i][j],
              status: 0
            }
            index++
          }
        }
      }
      return pokemon
    }

    const storedPokemon: Pokemon[] = loadPokemon()
    savePokemon(storedPokemon)
    setSelectedPokemon(storedPokemon);
  }, []);

  const handlePokemonClick = (index: number) => {
    const updatedSelectedPokemon = [...selectedPokemon];
    updatedSelectedPokemon[index].status = getObtainedStatus(updatedSelectedPokemon[index].status)
    setSelectedPokemon(updatedSelectedPokemon);
    savePokemon(updatedSelectedPokemon)
  };

  const handleImport = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          /* @ts-ignore */
          const importedJson = JSON.parse(event.target.result);
          // check length
          if (selectedPokemon.length !== importedJson.length) {
            setError(`Imported JSON does not have the correct length. Expected ${selectedPokemon.length} recieved ${importedJson.length}`)
            return;
          }
          // make sure each of the pokemon from import have correct fields
          const pokemonAttributes = JSON.stringify(['name', 'img_url', 'status'])
          for (let i = 0; i < importedJson.length; i++) {
            if (JSON.stringify(Object.keys(importedJson[i])) !== pokemonAttributes) {
              setError(`One of the Pokemon imported does not match expected schema, mismatch at index ${i}.`)
              return;
            }
          }
          // set the pokemon state and save to localstorage
          setSelectedPokemon(importedJson);
          savePokemon(importedJson)
        } catch (error) {
          console.log(error)
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (selectedPokemon.length === 0) {
    return (
      <main>
        <div className='flex justify-center'>
          <div className='flex flex-wrap m-1 max-w-5xl justify-center'>
            {pokemonData.map((box, index) => (
              <div key={index} className='text-center underline max-w-md'>
                Box {index + 1}
                <div className='flex flex-wrap border-2 m-1 p-2'>
                  {box.map((_, pIndex) => (
                    <div key={pIndex} className='w-1/6 cursor-pointer flex justify-center'>
                      <div className="skeleton w-14 h-14 rounded-full shrink-0"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <br />
      <div className='flex gap-5 justify-center'>
        <div className='flex items-center'>
          <svg className="w-8 h-8 text-black" fill="none" stroke="red" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>Obtained</span>
        </div>
        <div className='flex items-center'>
          <img
            alt='Desaturated Bulbasaur'
            src={'https://www.serebii.net/pokemonhome/pokemon/80/001.png'}
            width={32}
            height={32}
            className='obtained-id'
          />
          <span>Own trainer id</span>
        </div>
      </div>
      <div className='flex flex-col justify-center text-center'>
        <p>State is stored to localstorage so clearing application data will reset.</p>
        <p>Use buttons below to import or export data as JSON.</p>
      </div>
      <div className='flex gap-2 justify-center'>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button className="btn btn-sm" onClick={() => handleImportClick()}>Import</button>
        <button className="btn btn-sm" onClick={() => handleExport(selectedPokemon)}>Export</button>
      </div>
      {error ? (
        <div className='flex justify-center text-center text-error'>
          {error}
        </div>
      ) : null
      }

      <div className='flex justify-center'>
        <div className='flex flex-wrap m-1 max-w-5xl justify-center'>
          {pokemonData.map((box, index) => (
            <div key={index} className='text-center underline max-w-md'>
              Box {index + 1}
              <div className='flex flex-wrap border-2 m-1 p-2'>
                {box.map((pokemon, pIndex) => (
                  <div key={pIndex} className='w-1/6 cursor-pointer flex justify-center'>
                    <div className='relative'>
                      <img
                        alt={pokemon.name}
                        src={'https://www.serebii.net/' + pokemon.img_url}
                        width={60}
                        height={60}
                        className={selectedPokemon[index * 30 + pIndex].status === 2 ? 'obtained-id' : ''}
                        onClick={() => handlePokemonClick(index * 30 + pIndex)}
                      />
                      {
                        selectedPokemon[index * 30 + pIndex].status === 1 ? (
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" onClick={() => handlePokemonClick(index * 30 + pIndex)}>
                            <svg className="w-8 h-8 text-black" fill="none" stroke="red" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </div>
                        ) : null
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
