import { StarWarsApiPeopleResponse, StarWarsMoviesResponse, StarWarsPeople, StarWarsPlanets, StarWarsPlanetsResponse } from "@/globalTypes";

export async function fetchAllPlanets() {
  const planets: StarWarsPlanets[] = [];
  let planetPageCount: number;
  const basePlanetsUrl = "https://swapi.dev/api/planets";
  try {
    const response = await fetch(basePlanetsUrl);
    const data: StarWarsPlanetsResponse = await response.json();
    const planetCount = data.count;
    planetPageCount = Math.ceil(planetCount / 10);
  } catch (error) {
    throw error;
  }

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

export async function fetchAllMovies() {
  const url = "https://swapi.dev/api/films";
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status} - ${res.statusText}`);
    }
    const data: StarWarsMoviesResponse = await res.json();
    return data.results;
  } catch (error) {
    throw error;
  }
}

export async function getAllPeople(url: string): Promise<StarWarsPeople[]> {
  let data: StarWarsApiPeopleResponse;
  const peopleUrls: string[] = [];

  try {
    const response = await fetch(url);
    data = await response.json();
    for (let page = 1; page <= Math.ceil(data.count / 10); page++) {
      peopleUrls.push(`${url}?page=${page}`);
    }
  } catch (error) {
    throw error;
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