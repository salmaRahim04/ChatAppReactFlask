import React from "react";

import { FiArrowRight } from "react-icons/fi";
import './styles.css'
import Navbar from "./Header";
import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={"https://github.com/thehyperart11/Restaurant-Landing-Page-Tutorial/blob/main/src/Assets/home-banner-background.png?raw=true"} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Your Favourite Chat App: <span>EpicTalks</span>
          </h1>
          <p className="primary-text">
          Des Conversations Enrichissantes : Votre Application de Chat Préférée
          </p>
          <Link to='/login'>
          <button className="secondary-button">
            Log in <FiArrowRight />{" "}
          </button>
          </Link>
        </div>
        <div className="home-image-section">
          <img src={"https://c8.alamy.com/comp/2F5WJC0/human-hand-using-mobile-chatting-ap-on-smartphone-screen-social-media-network-online-communication-2F5WJC0.jpg"} width={"300px"} height={"300px"} alt="" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;