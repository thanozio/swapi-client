"use client";

import { useEffect, useState } from "react";

import { StarWarsPeople } from "@/globalTypes";

interface HomeworldData {
  name: string;
  terrain: string;
  climate: string;
  population: string;
}

export default function CharacterModalData({
  character,
}: {
  character: StarWarsPeople;
}) {
  const [homeworldData, setHomeworldData] = useState<HomeworldData | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const { name, height, birth_year, mass, created, films, homeworld } =
    character;

  useEffect(() => {
    async function getHomeworldData() {
      try {
        // leveraging just the first value of the provided array to avoid mixing races up
        const res = await fetch(homeworld);
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }
        const data: HomeworldData = await res.json();
        setHomeworldData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else if (typeof error === "string") {
          setError(error);
        } else {
          setError("Unable to load data. Please try again later.");
        }
      }
    }

    getHomeworldData();
  }, [homeworld]);

  return (
    <div className="w-auto flex flex-col gap-10">
      <div>
        <h2>Name: {name}</h2>
        <p>Height: {Number(height) / 100} m</p>
        <p>Mass: {mass} kg.</p>
        <p>Birth year: {birth_year}</p>
        <p>Number of films: {films.length}</p>
        <p>
          Created:{" "}
          {new Date(created).toLocaleDateString("el-gr").replace(/\//g, "-")}
        </p>
      </div>
      <hr />
      <div>
        <h2>Homeworld</h2>
        <p>Name: {homeworldData?.name || "loading"}</p>
        <p>Terrain: {homeworldData?.terrain || "loading"}</p>
        <p>Climate: {homeworldData?.climate || "loading"}</p>
        <p>
          Population:{" "}
          {homeworldData?.population !== "unknown"
            ? Number(homeworldData?.population).toLocaleString("el-gr")
            : "unknown"}
        </p>
      </div>
      {error && <h2 className="text-red-500">Could not fetch data</h2>}
    </div>
  );
}
