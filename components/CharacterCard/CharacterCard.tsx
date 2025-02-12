"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import characterImages from "@/utils/images";

interface SpeciesApiResponse {
    name: string
}

export default function CharacterCard({ name, species }: { name: string, species: string[] }) {
  // API uses an empty array to represent humans, so I'm defaulting to it
  const [speciesName, setSpeciesName] = useState<string>("Human");
  const currentImage = characterImages[Math.floor(Math.random() * characterImages.length)];
  const [error, setError] = useState<string | null>(null);

  // Has to be inline for Tailwind to compile the classes
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
    ["Pau'an", "border-gray-900"]
  ]);
  
  useEffect(() => {
    async function getSpecies() {
      if (species.length === 0) return;
      try {
        // leveraging just the first value of the provided array to avoid mixing races up
        const res = await fetch(species[0]);
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }
        const data: Partial<SpeciesApiResponse> = await res.json();
        if (data.name) {
          setSpeciesName(data.name);
        }
      }
      catch (error) {
        setError("Unable to load data. Check your connection or try again later.");
      }
    }

    getSpecies();
  }, []);

  return (
    <>
    {error 
      ? <h2>Could not fetch data</h2>
      : <div 
      className={`text-center w-max-200 h-max-300 ${speciesColors.get(speciesName)} border-4 rounded-lg transition delay-150 duration-300 ease-in-out hover:scale-110`}
    >
      <h2>{name}</h2>
      <Image 
        // I'd use this but they cache images aggressively, and ends up
        // showing the same image multiple times! 
        // I'd rather grow the bundle size a bit by importing local images
        // src={"https://picsum.photos/200/300/?random"}
        src={currentImage} 
        alt={`Picture for ${name}.`} 
        width={200} 
        height={300} 
        priority={true}
      />
    </div>
    }
    </>
  );
}