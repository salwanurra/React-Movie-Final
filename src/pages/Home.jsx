/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { useAtom, atom } from "jotai";
import { themeState } from "../components/Navbar";
import Carousel from "better-react-carousel";
import { getMovie, getBanner, getRecommended } from "../feature/ApiService";
import CardHome from "../components/CardHome";
import Banner from "../components/Banner";
import { motion } from "framer-motion";

export const bannerState = atom([]);
export const dataMovieState = atom([]);
export const recommendedState = atom([]);
export const allMovieState = atom([]);

function Home() {
  const [darkMode, setDarkMode] = useAtom(themeState);
  const [dataMovie, setDataMovie] = useAtom(dataMovieState);
  const [banner, setBanner] = useAtom(bannerState);
  const [allMovie, setAllMovie] = useAtom(allMovieState);
  const [recommended, setRecommended] = useAtom(recommendedState);

  const queryParams = new URLSearchParams(window.location.search);
  let search = queryParams.get("search");

  const transition = { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] };
  const pageVariants = {
    initial: { scale: 0.2, opacity: 100 },
    in: { scale: 1, opacity: 1 },
    out: {
      scale: 0.2,
      opacity: 0,
      transition: { duration: 1, ...transition },
    },
  };

  const fetchApiCall = async () => {
    const movieList = await getMovie();
    const bannerList = await getBanner();
    const recommendedList = await getRecommended();
    setDataMovie(movieList);
    setBanner(bannerList);
    setRecommended(recommendedList);
    setAllMovie([...movieList, ...bannerList, ...recommendedList]);
    console.log("a", allMovie);
  };

  const listProduct = () => {
    if (search == null) {
      return dataMovie?.map((item) => (
        <CardHome  width={'w-32'} height={'h-32'} id={item.id} title={item.title} image={item.image} demo={item.demo} synopsis={item.synopsis} releaseDate={item.release_date} director={item.director} type={item.type} />
      ));
    } else {
      let allMovieTemp = allMovie
        .filter((item) => {
          if (item.title.toLowerCase().includes(search.toLowerCase())) {
            return item;
          }
        })

        .map((item) => {
          return (
            <CardHome width={'w-32'} height={'h-32'} id={item.id} title={item.title} image={item.image}  demo={item.demo} synopsis={item.synopsis} releaseDate={item.release_date} director={item.director} type={item.type}  />
          );
        });
      let uniqueObjArray = [
        ...new Map(allMovieTemp.map((item) => [item["title"], item])).values(),
      ];
      return uniqueObjArray;
    }
  };

  const listBanner = () => {
    return (
      <>
        <Carousel
          cols={1}
          rows={1}
          gap={10}
          loop={true}
          dotColorInactive={darkMode ? "#405189" : "#a8a8a8"}
          dotColorActive={darkMode ? "#f8fafc" : "#405189"}
          mobileBreakpoint={100}
          showDots={true}
          autoplay={4000}
          scrollSnap={true}
        >
          {banner?.map((item) => {
            return (
              <Carousel.Item>
                <Banner id={item.id} title={item.title} image={item.image} banner={item.banner} demo={item.demo} synopsis={item.synopsis} releaseDate={item.release_date} director={item.director} type={item.type} />
              </Carousel.Item>
            );
          })}
        </Carousel>
      </>
    );
  };

  const saveLastTheme = () => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
  };

  const restoreLastTheme = () => {
    const theme = localStorage.getItem("theme", JSON.stringify(darkMode));
    setDarkMode(theme);
  };

  useEffect(() => {
    fetchApiCall();
    restoreLastTheme();
  }, []);

  useEffect(() => {
    saveLastTheme();
  }, [darkMode]);

  return (
    <>
      <motion.div
        className={`w-full h-screens ${
          darkMode ? "bg-[#192026] text-white" : "bg-[#ffffff] text-black"
        }`}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
        <div className="ml-40 text-xl font-semibold py-3">New Movie</div>
        <div className="flex flex-col w-5/6 mx-auto  justify-center">
          {listBanner()}
        </div>
        <div className="">
          <div className="text-xl font-semibold ml-28 mt-28 mb-4">
            Popular Movie
          </div>
          <div className="flex flex-row mx-auto  w-5/6">{listProduct()}</div>
        </div>
      </motion.div>
    </>
  );
}

export default Home;
