import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { themeState } from "../components/Navbar";
import {
  dataMovieState,
  bannerState,
  allMovieState,
  recommendedState,
} from "./Home";
import { getMovie, getBanner, getRecommended } from "../feature/ApiService";
import CardHome from "../components/CardHome";
import { motion } from "framer-motion";
import YouTube, { YouTubeProps } from "react-youtube";
import { useLocation } from "react-router-dom";

function Detail() {
  const [darkMode, setDarkMode] = useAtom(themeState);
  const [dataMovie, setDataMovie] = useAtom(dataMovieState);
  const [banner, setBanner] = useAtom(bannerState);
  const [allMovie, setAllMovie] = useAtom(allMovieState);
  const [recommended, setRecommended] = useAtom(recommendedState);

  const queryParams = new URLSearchParams(window.location.search);
  let search = queryParams.get("search");

  const {
    state: { demo, image, title, synopsis, director, type, releaseDate },
  } = useLocation();
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

  const opts: YouTubeProps["opts"] = {
    height: "400",
    width: "900",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };


  const saveLastTheme = () => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
  };

  const restoreLastTheme = () => {
    const theme = localStorage.getItem("theme", JSON.stringify(darkMode));
    setDarkMode(theme);
  };

  const recommendList = () => {
    return recommended?.map((item) => (
      <CardHome
        width={"w-60"}
        height={"h-24"}
        id={item.id}
        title={item.title}
        image={item.image}
        demo={item.demo}
        synopsis={item.synopsis}
        releaseDate={item.release_date}
        director={item.director}
        type={item.type}
      />
    ));
  };

  useEffect(() => {
    restoreLastTheme();
  }, []);

  useEffect(() => {
    saveLastTheme();
  }, [darkMode]);

  return (
    <>
      <motion.div
        className={`w-full bg-black h-screens ${
          darkMode ? "bg-[#192026] text-white" : "bg-[#ffffff] text-black"
        }`}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
        <div className="flex flex-col justify-center items-center py-5">
          <YouTube videoId={`${demo}`} opts={opts} />
        </div>

        <div
          className={`flex flex-row mt-20 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          <img
            src={image}
            alt="img"
            className="h-48 object-contain  ml-40 w-48"
          />
          <div className="flex flex-col  my-auto">
            <text className="text-2xl font-semibold mb-8">{title}</text>
            <text> Release Date : {releaseDate}</text>
            <text>Director : {director}</text>
          </div>
        </div>

        <div className="flex flex-col mt-20">
          <text className="ml-48 text-xl font-semibold mb-4">Synopsis</text>
          <text className="ml-48 text-sm w-3/6">{synopsis}</text>
        </div>

        <div className="flex flex-col py-10">
          <text className="ml-48 text-xl font-semibold mt-20">Recommended Movie</text>
          <div className="flex flex-row w-4/6 mx-auto py-2 px-2 line-thorugh">
            {recommendList()}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Detail;
