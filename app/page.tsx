"use client";

import { ChangeEvent, useEffect, useState, useMemo } from "react";

import ReactPaginate from "react-paginate";

import CharacterCard from "@/components/CharacterCard";
import Spinner from "@/components/Spinner";

import { StarWarsPeople } from "@/globalTypes";
import SearchAndFilter from "@/components/SearchAndFilter";
import Footer from "@/components/Footer";

interface StarWarsApiPeopleResponse {
  count: number;
  results: StarWarsPeople[];
  next: string | null;
}

async function getAllPeople(url: string): Promise<StarWarsPeople[]> {
  let data: StarWarsApiPeopleResponse;
  const peopleUrls: string[] = [];

  try {
    const response = await fetch(url);
    data = await response.json();
    for (let page = 1; page <= Math.ceil(data.count / 10); page++) {
      peopleUrls.push(`${url}?page=${page}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else if (typeof error === "string") {
      throw new Error(error);
    }
  }

  const people: StarWarsPeople[] = [];
  const fetchedPeople = await Promise.all(
    peopleUrls.map((url) => fetch(url).then((data) => data.json()))
  );

  fetchedPeople.forEach((res) => {
    people.push(...res.results);
  });

  return people;
}

export default function Home() {
  const [people, setPeople] = useState<StarWarsPeople[]>([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // this is always one less than what is shown by the pagination component
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [charFilter, setCharFilter] = useState("");

  useEffect(() => {
    if (!showSpinner) return;
    console.log("logging first");
    getAllPeople("https://swapi.dev/api/people/").then((fetchedPeople) => {
      setPeople(fetchedPeople);
      setShowSpinner(false);
    });
  }, [showSpinner]);

  const filteredPeople = useMemo(() => {
    let res = people;
    if (charFilter !== "") {
      res = res.filter((person) =>
        person.name.toLowerCase().includes(charFilter.toLowerCase())
      );
    }

    return res;
  }, [currentPage, people, charFilter]);


  useEffect(() => {
    if (filteredPeople.length > 0) {
      const pageCounter = Math.ceil(filteredPeople.length / 10);
      setPageCount(pageCounter);
    }
  }, [filteredPeople]);

  // async function fetchPeople(page = 1) {
  //   const url = `https://swapi.dev/api/people/?page=${page}${
  //     charFilter !== "" ? `&search=${charFilter}` : ""
  //   }`;

  //   try {
  //     const res = await fetch(url);
  //     if (!res.ok) {
  //       throw new Error(`API Error: ${res.status} - ${res.statusText}`);
  //     }
  //     const data: StarWarsApiPeopleResponse = await res.json();
  //     const newPageCount = Math.ceil(data.count / 10);

  //     setPageCount(newPageCount);
  //     setPeople(data.results);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       setError(error.message);
  //     } else {
  //       setError(
  //         "Unable to load data. Check your connection or try again later."
  //       );
  //     }
  //   } finally {
  //     setShowSpinner(false);
  //   }
  // }

  const handlePageChange = async (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  // useEffect(() => {
  //   let debounceHandler: ReturnType<typeof setTimeout>;
  //   if (showSpinner) {
  //     fetchPeople();
  //   } else {
  //     debounceHandler = setTimeout(() => {
  //       fetchPeople();
  //     }, 300);
  //   }

  //   return () => {
  //     clearTimeout(debounceHandler);
  //   };
  // }, [charFilter]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(0);
    setCharFilter(e.target.value);
  };

  async function handleFiltersChange(urls: string[]) {
    // if (urls.length === 0) {
    //   setPeople([]);
    // } else {
    //   const res: StarWarsPeople[] = await Promise.all(
    //     urls.map((url) => fetch(url).then((data) => data.json()))
    //   );
    //   setPageCount(Math.ceil(res.length / 10));
    //   setCurrentPage(0);
    //   console.log(res);
    //   setPeople(res);
    // }
  }

  const peopleForCurrentPage = filteredPeople.slice((currentPage + 1) * 10 - 10, (currentPage + 1) * 10);

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
              {peopleForCurrentPage &&
                peopleForCurrentPage
                  .map((character, index) => (
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
            activeClassName="bg-yellow-300"
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
