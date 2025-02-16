"use client";

import { useEffect, useState, useMemo, useCallback } from "react";

import ReactPaginate from "react-paginate";

import CharacterCard from "@/components/CharacterCard";
import Spinner from "@/components/Spinner";

import { StarWarsPeople } from "@/globalTypes";
import SearchAndFilter from "@/components/SearchAndFilter";
import Footer from "@/components/Footer";

import { getAllPeople } from "@/utils/fetchSwapiData";

export default function Home() {
  const [people, setPeople] = useState<StarWarsPeople[]>([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // this is always one less than what is shown by the pagination component
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [charFilter, setCharFilter] = useState("");
  const [peopleIdsFilter, setPeopleIdsFilter] = useState<(number | null)[]>([]);
  const [hasDropdownsActive, setHasDropdownsActive] = useState(false);

  useEffect(() => {
    if (!showSpinner) return;

    getAllPeople("https://swapi.dev/api/people/")
      .then((fetchedPeople) => {
        setPeople(fetchedPeople);
      })
      .catch((error) => {
        if (error instanceof Error) {
          setError(error.message);
        } else if (typeof error === "string") {
          setError(error);
        } else {
          setError("Something happened. Please try again later.");
        }
      })
      .finally(() => {
        setShowSpinner(false);
      });
  }, [showSpinner]);

  const filteredPeople = useMemo(() => {
    let res = people;
    if (charFilter !== "") {
      res = res.filter((person) =>
        person.name.toLowerCase().includes(charFilter.toLowerCase()),
      );
    }

    if (hasDropdownsActive) {
      const fromPeopleArray: StarWarsPeople[] = [];

      // I'm translating the character id from endpoint to the index that corresponds
      // to the full array of characters
      for (const id of peopleIdsFilter) {
        // null checking this (TypeScript guards stuff)
        if (id) {
          fromPeopleArray.push(people[id - 1]);
        }
      }

      res = res.filter((person) => fromPeopleArray.includes(person));
    }

    return res;
  }, [people, charFilter, peopleIdsFilter, hasDropdownsActive]);

  useEffect(() => {
    if (filteredPeople.length > 0) {
      const pageCounter = Math.ceil(filteredPeople.length / 10);
      setPageCount(pageCounter);
    }
  }, [filteredPeople]);

  const handlePageChange = async (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const handleSearchChange = (searchValue: string) => {
    setCurrentPage(0);
    setCharFilter(searchValue);
  };

  const handleDropdownsChange = useCallback(
    async (urls: string[], hasDropdownValues: boolean) => {
      setHasDropdownsActive(hasDropdownValues);
      setCurrentPage(0);
      const ids = urls.map((url) => {
        const match = url.match(/(\d+)/);
        return match ? parseInt(match[1]) : null;
      });
      setPeopleIdsFilter(ids);
    },
    [setPeopleIdsFilter],
  );

  const peopleForCurrentPage = filteredPeople.slice(
    (currentPage + 1) * 10 - 10,
    (currentPage + 1) * 10,
  );

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
              handleDropdownsChange={handleDropdownsChange}
              setCharFilter={setCharFilter}
            />
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
              {peopleForCurrentPage &&
                peopleForCurrentPage.map((character, index) => (
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
            onPageChange={handlePageChange}
            containerClassName="flex gap-x-2 mb-4"
            pageClassName="px-3 py-2 border rounded hover:bg-gray-200"
            pageLinkClassName="text-white"
            previousClassName="px-3 py-2 border rounded hover:bg-gray-200"
            previousLinkClassName="text-white"
            nextClassName="px-3 py-2 border rounded hover:bg-gray-200"
            nextLinkClassName="text-white"
            breakClassName="px-3 py-2 border rounded"
            breakLinkClassName="text-white"
            activeClassName="bg-yellow-400"
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
