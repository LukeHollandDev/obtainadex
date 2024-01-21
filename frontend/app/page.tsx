"use client";

import Image from 'next/image';
import pokemonData from '@/public/pokemon.json';
import obtainedIcon from '@/public/obtained.svg'
import ownTrainerId from '@/public/own-trainer-id.svg'
import { useState, useEffect, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

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
  const date = new Date()
  a.download = `obtainadex-data-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const printPokemonListPDF = async (pokemon: Pokemon[], name: string, filter: number) => {
  // filter 1 = un-obtained (status = 0)
  // filter 2 = not own trainer id (status = 0, status = 1)
  // filter 3 = all pokemon
  let filteredPokemon = [...pokemon]
  if (filter === 1) {
    filteredPokemon = filteredPokemon.filter((pokemon: Pokemon) => pokemon.status === 0)
  } else if (filter === 2) {
    filteredPokemon = filteredPokemon.filter((pokemon: Pokemon) => pokemon.status <= 1)
  }

  // create pdf
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  // add page
  let page = pdfDoc.addPage()
  let { width, height } = page.getSize()
  const fontSize = 12
  const margin = 20
  const padding = 4
  const boxSize = 10
  let column = 1

  let counter = 1
  for (let i = 0; i < filteredPokemon.length; i++) {
    const name = filteredPokemon[i].name.replace('\u2640', ' (F)').replace('\u2642', ' (M)')
    const colWidth = column === 1 ? margin : column === 2 ? margin + ((width - margin * 2) / 3) : margin + (2 * (width - margin * 2) / 3)
    // add small checkbox for obtained
    page.drawSquare({
      x: colWidth,
      y: height - (margin + counter * (fontSize + padding)) - 1,
      size: boxSize,
      color: rgb(1, 1, 1),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1
    })
    if (filteredPokemon[i].status !== 0 && filteredPokemon[i].status <= 2) {
      page.drawSquare({
        x: colWidth + boxSize / 4,
        y: height - (margin + counter * (fontSize + padding)) - 1 + boxSize / 4,
        size: boxSize / 2,
        borderWidth: 1
      })
    }
    // add small checkbox for own trainer id
    page.drawSquare({
      x: boxSize + padding + colWidth,
      y: height - (margin + counter * (fontSize + padding)) - 1,
      size: boxSize,
      color: rgb(1, 1, 1),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1
    })
    if (filteredPokemon[i].status === 2) {
      page.drawSquare({
        x: boxSize + padding + colWidth + boxSize / 4,
        y: height - (margin + counter * (fontSize + padding)) - 1 + boxSize / 4,
        size: boxSize / 2,
        borderWidth: 1
      })
    }
    // add pokemon name max length 25, if longer add ellipse ...
    page.drawText(name.substring(0, 25 + 1) + (name.length > 25 ? '...' : ''), {
      x: 2 * (boxSize + padding) + colWidth,
      y: height - (margin + counter * (fontSize + padding)),
      size: fontSize,
      font: timesRomanFont,
    })

    if (height - (margin + (counter + 1) * (fontSize + padding)) <= margin) {
      counter = 0
      if (column === 3) {
        page = pdfDoc.addPage()
        column = 1
      } else if (column === 2) {
        column = 3
      } else {
        column = 2
      }
    }
    counter++
  }

  // save pdf
  const pdfBytes = await pdfDoc.save()
  const url = window.URL.createObjectURL(
    new Blob([pdfBytes], { type: "application/pdf" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `obtainadex-${name}.pdf`;
  a.click();
  a.remove();
}

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
          setError(null)
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

  const markAllByBox = (boxIndex: number, status: number | null) => {
    const startIndex = boxIndex * 30
    let endIndex = startIndex + 30
    if (endIndex >= selectedPokemon.length) {
      endIndex = selectedPokemon.length - 1;
    }
    const updatedSelectedPokemon = [...selectedPokemon];
    for (let i = startIndex; i < endIndex; i++) {
      if (status !== null) {
        updatedSelectedPokemon[i].status = status
      } else {
        updatedSelectedPokemon[i].status = getObtainedStatus(updatedSelectedPokemon[i].status)
      }
    }
    setSelectedPokemon(updatedSelectedPokemon);
    savePokemon(updatedSelectedPokemon)
  }

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
      <div className='text-center mt-3'>
        <h1 className='font-bold text-xl'>Obtainadex</h1>
        <div className='m-4 mt-2'>
          <div className='flex flex-col justify-center text-center'>
            <p>State is stored to locally, clearing website cache will reset data.</p>
            <p>Use buttons below to import or export data as JSON.</p>
          </div>
          <div className='flex gap-2 justify-center mt-1'>
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
        </div>
        <div className='m-4'>
          <div className='flex flex-col justify-center text-center'>
            <p>Download PDFs of your collection.</p>
          </div>
          <div className='flex gap-2 justify-center mt-1'>
            <button className="btn btn-sm" onClick={() => printPokemonListPDF(selectedPokemon, 'un-obtained', 1)}>Un-Obtained</button>
            <button className="btn btn-sm" onClick={() => printPokemonListPDF(selectedPokemon, 'not-own-id', 2)}>Not Own ID</button>
            <button className="btn btn-sm" onClick={() => printPokemonListPDF(selectedPokemon, 'all', 3)}>All</button>
          </div>
        </div>
        <div className='m-4 mb-1'>
          <div className='flex flex-col justify-center text-center'>
            <p className='text-sm'>Pokemon images sourced from <a href="https://serebii.net/" target="_blank" className='underline'>Serebii</a>.</p>
          </div>
        </div>
        <div className='m-4 mt-1'>
          <p className='text-xs'>Developed by <a href="https://lukeh.xyz/" target="_blank" className='underline'>Luke Holland</a>.</p>

        </div>
      </div>

      <hr />

      <div className='flex gap-5 justify-center m-4'>
        <div className='flex items-center gap-1'>
          <Image
            alt='Pokemon Obtained Icon'
            src={obtainedIcon}
            width={25}
            height={25}
            className='obtained-id'
          />
          <span>Obtained</span>
        </div>
        <div className='flex items-center gap-1'>
          <Image
            alt='Pokemon Own Trainer ID Icon'
            src={ownTrainerId}
            width={25}
            height={25}
            className='obtained-id'
          />
          <span>Own trainer id</span>
        </div>
      </div>

      <div className='flex justify-center'>
        <div className='flex flex-wrap m-1 max-w-5xl justify-center'>
          {pokemonData.map((box, index) => (
            <div key={index} className='text-center max-w-md'>
              <button className='btn btn-sm' onClick={() => markAllByBox(index, null)}>mark all</button>
              <span className='underline ml-4 mr-4'>Box {index + 1}</span>
              <button className='btn btn-sm' onClick={() => markAllByBox(index, 0)}>clear all</button>
              <div className='flex flex-wrap border-2 m-1 p-2 mt-3 mb-3'>
                {box.map((pokemon, pIndex) => (
                  <div key={pIndex} className='w-1/6 cursor-pointer flex justify-center'>
                    <div className='relative'>
                      <Image
                        alt={pokemon.name}
                        src={'https://www.serebii.net/' + pokemon.img_url}
                        width={60}
                        height={60}
                        className={selectedPokemon[index * 30 + pIndex].status === 2 ? 'grayscale' : ''}
                        onClick={() => handlePokemonClick(index * 30 + pIndex)}
                      />
                      {
                        selectedPokemon[index * 30 + pIndex].status === 1 ? (
                          <div className="absolute top-1" onClick={() => handlePokemonClick(index * 30 + pIndex)}>
                            <Image alt="Pokemon Obtained Icon" src={obtainedIcon} height={20} width={20} />
                          </div>
                        ) : null
                      }
                      {
                        selectedPokemon[index * 30 + pIndex].status === 2 ? (
                          <div className="absolute top-1" onClick={() => handlePokemonClick(index * 30 + pIndex)}>
                            <Image alt="Pokemon Own Trainer ID Icon" src={ownTrainerId} height={20} width={20} />
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
