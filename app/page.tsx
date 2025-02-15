"use client";

import { ChangeEvent, useEffect, useState } from "react";

import ReactPaginate from "react-paginate";

import CharacterCard from "@/components/CharacterCard";
import Spinner from "@/components/Spinner";

import { StarWarsCharacter } from "@/globalTypes";
import SearchAndFilter from "@/components/SearchAndFilter";
import Footer from "@/components/Footer";

interface StarWarsApiPeopleResponse {
  count: number;
  results: StarWarsCharacter[];
}

export default function Home() {
  const [people, setPeople] = useState<StarWarsCharacter[]>([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [charFilter, setCharFilter] = useState("");

  async function fetchPeople(page = 1) {
    const url = `https://swapi.dev/api/people/?page=${page}${
      charFilter !== "" ? `&search=${charFilter}` : ""
    }`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API Error: ${res.status} - ${res.statusText}`);
      }
      const data: StarWarsApiPeopleResponse = await res.json();
      const newPageCount = Math.ceil(data.count / 10);

      setPageCount(newPageCount);
      setPeople(data.results);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Unable to load data. Check your connection or try again later."
        );
      }
    } finally {
      setShowSpinner(false);
    }
  }

  const handlePageClick = async (data: { selected: number }) => {
    setCurrentPage(data.selected);
    await fetchPeople(data.selected + 1);
  };

  useEffect(() => {
    let debounceHandler: ReturnType<typeof setTimeout>;
    if (showSpinner) {
      fetchPeople();
    } else {
      debounceHandler = setTimeout(() => {
        fetchPeople();
      }, 300);
    }

    return () => {
      clearTimeout(debounceHandler);
    };
  }, [charFilter]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(0);
    setCharFilter(e.target.value);
  };

  async function handleFiltersChange(urls: string[]) {
    if (urls.length === 0) {
      setPeople([]);
    } else {
      const res: StarWarsCharacter[] = await Promise.all(
        urls.map((url) => fetch(url).then((data) => data.json()))
      );

      setPageCount(Math.ceil(res.length / 10));
      setCurrentPage(0);
      console.log(res);
      setPeople(res);
    }
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="flex flex-col items-center justify-center gap-10 mt-10">
        <h1>SWAPI Wars</h1>
        <h2>A long time ago in an API far, far away...</h2>
        {showSpinner && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}
        {!showSpinner && !error && (
          <>
            <SearchAndFilter
              charFilter={charFilter}
              handleSearchChange={handleSearchChange}
              handleFiltersChange={handleFiltersChange}
            />
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
            forcePage={currentPage}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName="flex gap-x-2 mb-4"
            pageClassName="px-3 py-2 border rounded hover:bg-gray-200"
            pageLinkClassName="text-white"
            previousClassName="px-3 py-2 border rounded hover:bg-gray-200"
            previousLinkClassName="text-white"
            nextClassName="px-3 py-2 border rounded hover:bg-gray-200"
            nextLinkClassName="text-white"
            breakClassName="px-3 py-2 border rounded"
            breakLinkClassName="text-white"
            activeClassName="bg-yellow-300"
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
