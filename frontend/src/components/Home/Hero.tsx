import Image from "next/image";
import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"], // bold weight for hero
});
const Hero = () => {
  return (
    <div className="bg-linear-to-r relative flex max-sm:items-center sm:pt-30  justify-center from-slate-50 via-purple-200 to-pink-50 flex-1">
      <Image
        src={"/HeroImages/chowmin.png"}
        alt="hero_image_1"
        width={320}
        height={320}
        className="absolute  max-sm:hidden -left-10 top-20 rotate-30"
      />
      <Image
        src={"/HeroImages/laddu.png"}
        alt="hero_image_1"
        width={320}
        height={320}
        className="absolute max-sm:-left-20 max-sm:top-10 max-sm:size-50 max-sm:rotate-10  left-120 -bottom-10"
      />
      <Image
        src={"/HeroImages/samosa.png"}
        alt="hero_image_1"
        width={320}
        height={320}
        className="absolute max-sm:-right-20 max-sm:top-60 max-sm:size-50 right-20 top-20 -rotate-20"
      />
      <div className="flex flex-col gap-5 z-100">
        <h1
          className={`${poppins.className} leading-20 max-sm:leading-15 text-6xl max-sm:text-4xl max-sm:max-w-xs w-full max-w-md font-bold text-black`}
        >
          The Mummy <span className="text-orange-600">Sweets and Corner</span>
        </h1>
        <h2 className="text-sm text-gray-600 font-light">
          Taste Good Feel Good <br />
          &quot;Pure taste from the hands of Mom &quot;
        </h2>
        <span className="text-gray-800 font-light">
          Butwal-15,Semlar,Mahadaiya chowk
        </span>
      </div>
    </div>
  );
};

export default Hero;
