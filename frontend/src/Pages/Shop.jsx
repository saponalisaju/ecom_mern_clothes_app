import React from "react";
import Hero from "../Components/Hero/Hero";
import Women from "../Components/Popular/Women";
import Men from "../Components/Popular/Men";
import Kid from "../Components/Popular/Kid";
import { Offers } from "../Components/Offers/Offers";
import NewCollections_women from "../Components/NewCollections/NewCollections_women";
import NewCollections_men from "../Components/NewCollections/NewCollections_men";
import NewCollections_kid from "../Components/NewCollections/NewCollections_kid";
import NewsLetter from "../Components/NewsLetter/NewsLetter";

const Shop = () => {
  return (
    <>
      <Hero />

      <Women />
      <NewCollections_women />

      <Men />
      <NewCollections_men />

      <Kid />
      <NewCollections_kid />

      <Offers />
      <NewsLetter />
    </>
  );
};

export default Shop;
