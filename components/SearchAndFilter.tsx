"use client";

import {
  SearchAndFilterProps,
  StarWarsMovie,
  StarWarsPlanets,
} from "@/globalTypes";
import { fetchAllPlanets, fetchAllMovies } from "@/utils/fetchSwapiData";
import { ChangeEvent, useEffect, useState } from "react";

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
    const hasDropdownValues = selectedPlanet !== "" || selectedMovie !== "";
    if (!hasDropdownValues) {
      handleDropdownsChange([], hasDropdownValues);
    }
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
      const lookup = currentPlanet.residents.filter((resident) =>
        movieSet.has(resident),
      );
      handleDropdownsChange(lookup, hasDropdownValues);
    } else if (currentMovie) {
      handleDropdownsChange(currentMovie.characters, hasDropdownValues);
    } else if (currentPlanet) {
      handleDropdownsChange(currentPlanet.residents, hasDropdownValues);
    }
  }, [selectedPlanet, selectedMovie, movies, planets, handleDropdownsChange]);

  useEffect(() => {
    if (planets === null) {
      fetchAllPlanets()
        .then((data) => setPlanets(data))
        .catch((error) => {
          if (error instanceof Error) {
            setError(error.message);
          } else if (typeof error === "string") {
            setError(error);
          } else {
            setError("Something happened. Please try again later.");
          }
        });
    }

    if (movies === null) {
      fetchAllMovies()
        .then((data) => setMovies(data))
        .catch((error) => {
          if (error instanceof Error) {
            setError(error.message);
          } else if (typeof error === "string") {
            setError(error);
          } else {
            setError("Something happened. Please try again later.");
          }
        });
    }
  }, [movies, planets]);

  useEffect(() => {
    if (planets === null) {
      fetchAllPlanets()
        .then((data) => setPlanets(data))
        .catch((error) => {
          if (error instanceof Error) {
            setError(error.message);
          } else if (typeof error === "string") {
            setError(error);
          } else {
            setError("Something happened. Please try again later.");
          }
        });
    }
  }, [planets]);

  const handleFiltersReset = () => {
    setSelectedMovie("");
    setSelectedPlanet("");
    setCharFilter("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value);
  };

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
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  handleFiltersReset();
                }}
              >
                Reset Filters
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
}
