"use client";

import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

import CharacterCard from "@/components/CharacterCard";
import Spinner from "@/components/Spinner";

import { StarWarsCharacter } from "@/globalTypes";

interface StarWarsApiPeopleResponse {
  count: number;
  next: string;
  previous: string;
  results: StarWarsCharacter[];
}

export default function Home() {
  const [people, setPeople] = useState<StarWarsCharacter[]>([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!showSpinner) return;

    async function getPeople() {
      try {
        const res = await fetch(`https://swapi.dev/api/people/?page=${page}`);
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }
        const data: StarWarsApiPeopleResponse = await res.json();
        setPeople(data.results);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        setError(
          "Unable to load data. Check your connection or try again later."
        );
      } finally {
        setShowSpinner(false);
      }
    }

    getPeople();
  }, [showSpinner, page]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {showSpinner && <Spinner />}

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            {people.map((character, index) => (
              <CharacterCard
                key={character.name}
                character={character}
                index={index}
              />
            ))}
          </div>
        )}
        {!error &&
          <div className="flex justify-center w-full gap-x-5">
            <button
              className={`${page > 1 ? "block" : "hidden"}`}
              onClick={() => {
                setPage(page - 1);
                setShowSpinner(true);
              }}
            >
              <ArrowLeftIcon />
              Previous
            </button>
            <p className="bg-slate-400 p-2 rounded-lg">Page {page}</p>
            <button
              className={`${page < 8 ? "block" : "hidden"}`}
              onClick={() => {
                setPage(page + 1);
                setShowSpinner(true);
              }}
            >
              <ArrowRightIcon />
              Next
            </button>
          </div>
        }
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
