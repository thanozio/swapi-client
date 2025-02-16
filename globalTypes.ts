import { Dispatch, SetStateAction } from "react";

export interface StarWarsPeople {
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

export interface SearchAndFilterProps {
  charFilter: string;
  handleSearchChange: (searchValue: string) => void;
  handleDropdownsChange: (
    planetUrls: string[],
    hasDropdownValues: boolean,
  ) => void;
  setCharFilter: Dispatch<SetStateAction<string>>;
}

export interface StarWarsMovie {
  title: string;
  characters: string[];
}

export interface StarWarsPlanets {
  name: string;
  residents: string[];
}

export interface StarWarsPlanetsResponse {
  count: number;
  results: StarWarsPlanets[];
}

export interface StarWarsMoviesResponse {
  count: number;
  results: StarWarsMovie[];
}

export interface StarWarsApiPeopleResponse {
  count: number;
  results: StarWarsPeople[];
  next: string | null;
}
