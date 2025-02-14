"use client";

import { useEffect, useState } from "react";

import ReactPaginate from "react-paginate";

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
  const [pageCount, setPageCount] = useState(1);
  const [charFilter, setCharFilter] = useState("");

  const fetchPeople = async (currentPage: number) => {
    const url = `https://swapi.dev/api/people/?page=${currentPage}${
      charFilter !== "" ? `&search=${charFilter}` : ""
    }`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API Error: ${res.status} - ${res.statusText}`);
      }
      const data: StarWarsApiPeopleResponse = await res.json();
      setPeople(data.results);
      const newPageCount = Math.ceil(data.count / 10);
      if (pageCount !== newPageCount) {
        setPageCount(newPageCount);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Unable to load data. Check your connection or try again later."
        );
      }
    } finally {
      if (showSpinner) {
        setShowSpinner(false);
      }
    }
  };

  const handlePageClick = async (data: { selected: number }) => {
    let currentPage = data.selected + 1;
    await fetchPeople(currentPage);
  };

  useEffect(() => {
    let debounceHandler: ReturnType<typeof setTimeout>;
    if (showSpinner) {
      fetchPeople(1);
    } else {
      debounceHandler = setTimeout(() => fetchPeople(1), 1500);
    }

    return () => {
      clearTimeout(debounceHandler);
    };
  }, [charFilter]);

  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="flex flex-col items-center justify-center gap-10 mt-10">
        <h1>A long time ago in an API far, far away....</h1>
        {showSpinner && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}
        {!showSpinner && !error && (
          <>
            <div>
              <label htmlFor="characterSearch">Character search: </label>
              <input
                type="text"
                name="characterSearch"
                id="characterSearch"
                placeholder="Enter a character name"
                value={charFilter}
                className="text-black pr-2 pl-2"
                onChange={(e) => setCharFilter(e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
              {people &&
                people.map((character, index) => (
                  <CharacterCard
                    key={character.name}
                    character={character}
                    index={index}
                  />
                ))}
            </div>
          </>
        )}

        {!showSpinner && (
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName="flex gap-x-2 mb-4"
            pageClassName="px-3 py-2 border rounded hover:bg-gray-200"
            pageLinkClassName="text-gray-700"
            previousClassName="px-3 py-2 border rounded hover:bg-gray-200"
            previousLinkClassName="text-gray-700"
            nextClassName="px-3 py-2 border rounded hover:bg-gray-200"
            nextLinkClassName="text-gray-700"
            breakClassName="px-3 py-2 border rounded"
            breakLinkClassName="text-gray-700"
            activeClassName="bg-yellow-300 text-white"
          />
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>
          Made with ❤️ and React by Thanos Dimitriades - 2025 | Powered by{" "}
          <a href="https://swapi.dev/" className="text-yellow-300">
            The Star Wars API
          </a>
        </p>
      </footer>
    </div>
  );
}
