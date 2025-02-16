"use client";

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";

interface SearchAndFilterProps {
  charFilter: string;
  handleSearchChange: (searchValue: string) => void;
  handleDropdownsChange: (planetUrls: string[]) => void;
  setCharFilter: Dispatch<SetStateAction<string>>
}

interface StarWarsMovie {
  title: string;
  characters: string[];
}

interface StarWarsPlanets {
  name: string;
  residents: string[];
}

interface StarWarsPlanetsResponse {
  count: number;
  results: StarWarsPlanets[];
}

interface StarWarsMoviesResponse {
  count: number;
  results: StarWarsMovie[];
}

async function getAllPlanets(
  basePlanetsUrl: string
): Promise<StarWarsPlanets[]> {
  const planets: StarWarsPlanets[] = [];
  const response = await fetch(basePlanetsUrl);
  const data: StarWarsPlanetsResponse = await response.json();
  const planetCount = data.count;
  const planetPageCount = Math.ceil(planetCount / 10);
  const planetUrls: string[] = [];
  for (let i = 1; i <= planetPageCount; i++) {
    planetUrls.push(`${basePlanetsUrl}?page=${i}`);
  }

  const fetchedPlanets = await Promise.all(
    planetUrls.map((url) => fetch(url).then((data) => data.json()))
  );

  fetchedPlanets.forEach((res) => {
    planets.push(...res.results);
  });
  return planets;
}

export default function SearchAndFilter({
  charFilter,
  handleDropdownsChange,
  handleSearchChange,
  setCharFilter,
}: SearchAndFilterProps) {
  const [movies, setMovies] = useState<StarWarsMovie[] | null>(null);
  const [planets, setPlanets] = useState<StarWarsPlanets[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedPlanet, setSelectedPlanet] = useState("");

  useEffect(() => {
    if (selectedPlanet === "" && selectedMovie === "") {
      handleDropdownsChange([]);
    };
    let currentPlanet, currentMovie;

    if (planets && selectedPlanet) {
      const indexOfPlanet = Number(selectedPlanet) - 1;
       currentPlanet = planets[indexOfPlanet];
    }

    if (movies && selectedMovie) {
      const indexOfMovie = Number(selectedMovie) - 1;
      currentMovie = movies[indexOfMovie];
    }

    // merging the 2 filters
    if (currentMovie && currentPlanet) {
      const movieSet = new Set(currentMovie.characters);
      const lookup = currentPlanet.residents.filter(resident => movieSet.has(resident));
      handleDropdownsChange(lookup);
    } else if (currentMovie) {
      handleDropdownsChange(currentMovie.characters);
    } else if (currentPlanet) {
      handleDropdownsChange(currentPlanet.residents);
    }
  }, [selectedPlanet, selectedMovie]);

  useEffect(() => {
    const fetchMovies = async () => {
      const url = "https://swapi.dev/api/films";

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }
        const data: StarWarsMoviesResponse = await res.json();
        setMovies(data.results);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(
            "Unable to load data. Check your connection or try again later."
          );
        }
      }
    };

    if (!movies) {
      fetchMovies();
    }
  }, [movies]);

  useEffect(() => {
    if (planets === null) {
      getAllPlanets("https://swapi.dev/api/planets").then((data) =>
        setPlanets(data)
      );
    }
  }, [planets]);

  const handleFiltersReset = () => {
    setSelectedMovie("");
    setSelectedPlanet("");
    setCharFilter("");
    // need to reset the input here
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value);
  }

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      {!error && (
        <form>
          <fieldset className="border border-solid border-gray-300 p-3 flex flex-col items-center gap-3">
            <legend>Character Search</legend>
            <div className="flex justify-center">
              <label htmlFor="characterSearch">Name: </label>
              <input
                type="text"
                name="characterSearch"
                id="characterSearch"
                placeholder="Enter a character name"
                value={charFilter}
                className="text-black pr-2 pl-2"
                onChange={handleInputChange}
              />
            </div>
            <div className="m-2">
              <label htmlFor="planets">Select a planet: </label>
              <select
                name="planets"
                value={selectedPlanet}
                onChange={(e) => setSelectedPlanet(e.target.value)}
                id="planets"
                className="text-black mr-2"
              >
                <option value="">-- Select a planet --</option>
                {planets &&
                  planets.map((planet, index) => (
                    <option
                      key={planet.name}
                      value={index + 1}
                      className="text-black"
                    >
                      {planet.name}
                    </option>
                  ))}
              </select>
              <label htmlFor="movies">Select a film: </label>
              <select
                name="movies"
                id="movies"
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="text-black"
              >
                <option value="" className="text-gray-400">
                  -- Select a movie --
                </option>
                {movies &&
                  movies.map((movie, index) => (
                    <option
                      key={movie.title}
                      value={index + 1}
                      className="text-black"
                    >
                      {movie.title}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded" onClick={e => {
                e.preventDefault();
                handleFiltersReset();
              }}>Reset Filters</button>
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
}
