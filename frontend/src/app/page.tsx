import Hero from "@/components/Home/Hero";
import NavBar from "@/components/Home/NavBar";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Hero />
    </div>
  );
};

export default Home;
