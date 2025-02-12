"use client";

import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";

export interface StarWarsCharacter {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: Date;
  edited: Date;
  url: string;
}

interface StarWarsApiPeopleResponse {
  count: number;
  next: string;
  previous: string;
  results: StarWarsCharacter[]
};


export default function Home() {
  const [people, setPeople] = useState<StarWarsCharacter[]>([]);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    if (!showSpinner) return;

    async function getPeople() {
      const res = await fetch("https://swapi.dev/api/people/");
      if (!res.ok) {
        throw new Error("Unable to contact https://swapi.dev/. Please check your connection, or try again later.");
      }

      const data: StarWarsApiPeopleResponse = await res.json();
      setPeople(data.results);
      setShowSpinner(false);
    }

    setTimeout(getPeople, 3000);
    // getPeople();
  }, []);


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {showSpinner 
        ? <Spinner />
        : <ul>
        {people.map(character =>
          <li key={character.name}>{character.name}</li>
        )}
      </ul>
        }
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
