"use client";

import CharacterCard from "@/components/CharacterCard";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";

import { StarWarsCharacter } from "@/globalTypes";

interface StarWarsApiPeopleResponse {
  count: number;
  next: string;
  previous: string;
  results: StarWarsCharacter[]
};


export default function Home() {
  const [people, setPeople] = useState<StarWarsCharacter[]>([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showSpinner) return;

    async function getPeople() {
      try {
        const res = await fetch("https://swapi.dev/api/people/");
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }
        const data: StarWarsApiPeopleResponse = await res.json();
        setPeople(data.results);
      }
      catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        setError("Unable to load data. Check your connection or try again later.");
      }
      finally {
        setShowSpinner(false);
      }
    }

    getPeople();
  }, []);


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {showSpinner && <Spinner />}
        
        {error
          ? <p className="text-red-500">{error}</p>
          : <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            {people.map(character => <CharacterCard key={character.name} character={character} />)}
          </div>
        }
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
