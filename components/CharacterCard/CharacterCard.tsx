import Image from "next/image";

import { images } from "@/utils/images";

export default function CharacterCard({ name }: { name: string }) {
  const currentImage = images[Math.floor(Math.random() * images.length)];
  return (
    <div 
      className="text-center w-max-200 h-max-300 border-yellow-300 border-4 rounded-lg transition delay-150 duration-300 ease-in-out hover:scale-110"
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
  );
}