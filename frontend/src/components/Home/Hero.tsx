import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="bg-linear-to-r relative from-slate-50 via-purple-200 to-pink-50 flex-1">
      <Image
        src={"/HeroItems/laddu.jpg"}
        alt="hero_image_1"
        width={50}
        height={50}
        className="absolute left-20 top-20  "
      />
    </div>
  );
};

export default Hero;
