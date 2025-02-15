"use client";

import { stringify } from "querystring";
import { ChangeEvent, useEffect, useState } from "react";

interface SearchAndFilterProps {
  charFilter: string;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface StarWarsMovie {
  title: string;
}

interface StarWarsPlanets {
  name: string;
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
  handleSearchChange,
}: SearchAndFilterProps) {
  const [movies, setMovies] = useState<StarWarsMovie[] | null>(null);
  const [planets, setPlanets] = useState<StarWarsPlanets[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      {!error && (
        <form>
          <fieldset className="border border-solid border-gray-300 p-3 flex flex-col gap-3">
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
                onChange={handleSearchChange}
              />
            </div>
            <div className="m-2">
              <label htmlFor="planets">Select a planet: </label>
              <select
                name="planets"
                id="planets"
                defaultValue=""
                className="text-gray-400 mr-2"
              >
                <option value="" disabled>
                  -- Select a planet --
                </option>
                {planets &&
                  planets.map((planet) => (
                    <option
                      key={planet.name}
                      value={planet.name}
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
                defaultValue=""
                className="text-gray-400"
              >
                <option value="" disabled className="text-gray-400">
                  -- Select a movie --
                </option>
                {movies &&
                  movies.map((movie) => (
                    <option
                      key={movie.title}
                      value={movie.title}
                      className="text-black"
                    >
                      {movie.title}
                    </option>
                  ))}
              </select>
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
}
