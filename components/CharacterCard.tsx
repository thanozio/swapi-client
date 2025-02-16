"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Modal from "./Modal";
import CharacterModalData from "./CharacterModalData";
import characterImages from "@/utils/images";
import { StarWarsPeople } from "@/globalTypes";

// Has to be inline for Tailwind to compile the classes in order to be dynamically assigned
const speciesColors = new Map([
  ["Human", "border-blue-500"],
  ["Droid", "border-gray-500"],
  ["Wookie", "border-brown-600"],
  ["Rodian", "border-green-500"],
  ["Hutt", "border-yellow-600"],
  ["Yoda's species", "border-green-700"],
  ["Trandoshan", "border-lime-600"],
  ["Mon Calamari", "border-red-500"],
  ["Ewok", "border-orange-700"],
  ["Sullustan", "border-gray-600"],
  ["Neimodian", "border-green-700"],
  ["Gungan", "border-teal-500"],
  ["Toydarian", "border-blue-400"],
  ["Dug", "border-red-700"],
  ["Twi'lek", "border-indigo-500"],
  ["Aleena", "border-cyan-500"],
  ["Vulptereen", "border-yellow-700"],
  ["Xexto", "border-purple-500"],
  ["Toong", "border-amber-600"],
  ["Cerean", "border-rose-500"],
  ["Nautolan", "border-emerald-500"],
  ["Zabrak", "border-red-600"],
  ["Tholothian", "border-violet-500"],
  ["Iktotchi", "border-orange-600"],
  ["Quermian", "border-sky-500"],
  ["Kel Dor", "border-orange-500"],
  ["Chagrian", "border-blue-700"],
  ["Geonosian", "border-yellow-500"],
  ["Mirialan", "border-green-400"],
  ["Clawdite", "border-emerald-700"],
  ["Besalisk", "border-brown-700"],
  ["Kaminoan", "border-gray-400"],
  ["Skakoan", "border-gray-700"],
  ["Muun", "border-slate-500"],
  ["Togruta", "border-red-500"],
  ["Kaleesh", "border-amber-700"],
  ["Pau'an", "border-gray-900"],
]);

export default function CharacterCard({
  character,
  index,
}: {
  character: StarWarsPeople;
  index: number;
}) {
  // default is "Human", for when the API returns an empty array
  const [speciesName, setSpeciesName] = useState<string>("Human");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentImage = characterImages[index % 10];
  const [error, setError] = useState<string | null>(null);

  const { name, species } = character;

  useEffect(() => {
    async function getSpecies() {
      if (species?.length === 0) return;
      try {
        // leveraging just the first value of the provided array to avoid mixing races up
        const res = await fetch(species[0]);
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }
        const data: { name: string } = await res.json();
        setSpeciesName(data.name);
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

    getSpecies();
  }, [species]);

  return (
    <>
      {error ? (
        <h2 className="text-red-500">Could not fetch data</h2>
      ) : (
        <>
          <div
            className={`text-center w-max-200 h-max-300 ${speciesColors.get(
              speciesName
            )} border-4 rounded-lg transition duration-300 ease-in-out hover:scale-110`}
            onClick={() => setIsModalOpen(true)}
          >
            <h2>{name}</h2>
            <Image
              // I'd use this but they cache images aggressively, and ends up
              // showing the same image multiple times!
              // I'd rather grow the bundle size a bit by importing local images
              // src={"https://picsum.photos/200/300/?random"}
              src={currentImage}
              alt={`Picture of ${name}.`}
              width={200}
              height={300}
              priority={true}
            />
          </div>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <CharacterModalData character={character} />
            <button
              className="bg-black hover:bg-yellow-400 text-yellow-400 hover:text-black border-yellow-400 p-2 rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </Modal>
        </>
      )}
    </>
  );
}
