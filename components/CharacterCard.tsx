// "use client";

import Image from "next/image";
import { useState } from "react";

import Modal from "./Modal";
import CharacterModalData from "./CharacterModalData";
import characterImages from "@/utils/images";
import { StarWarsPeople } from "@/globalTypes";

// Colors need to be inline for Tailwind to compile the classes
// in order to be dynamically assigned
const speciesColors: string[] = [
  "border-blue-500",
  "border-gray-500",
  "border-brown-600",
  "border-green-500",
  "border-yellow-600",
  "border-green-700",
  "border-lime-600",
  "border-red-500",
  "border-orange-700",
  "border-gray-600",
  "border-green-700",
  "border-teal-500",
  "border-blue-400",
  "border-red-700",
  "border-indigo-500",
  "border-cyan-500",
  "border-yellow-700",
  "border-purple-500",
  "border-amber-600",
  "border-rose-500",
  "border-emerald-500",
  "border-red-600",
  "border-violet-500",
  "border-orange-600",
  "border-sky-500",
  "border-orange-500",
  "border-blue-700",
  "border-yellow-500",
  "border-green-400",
  "border-emerald-700",
  "border-brown-700",
  "border-gray-400",
  "border-gray-700",
  "border-slate-500",
  "border-red-500",
  "border-amber-700",
  "border-gray-900",
];

export default function CharacterCard({
  character,
  index,
}: {
  character: StarWarsPeople;
  index: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentImage = characterImages[index % 10];

  // default color for human borders
  let speciesColorIndex: number = 0;
  const speciesIdMatch = character?.species[0]?.match(/(\d+)/) || null;
  if (speciesIdMatch !== null) {
    speciesColorIndex = Number(speciesIdMatch[1]);
  }
  return (
    <>
      <div
        className={`text-center w-max-200 h-max-300 ${speciesColors[speciesColorIndex]} border-4 rounded-lg transition duration-300 ease-in-out hover:scale-110`}
        onClick={() => setIsModalOpen(true)}
      >
        <h2>{character.name}</h2>
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
  );
}
