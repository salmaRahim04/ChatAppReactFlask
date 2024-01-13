import React from "react";

import { FiArrowRight } from "react-icons/fi";
import './styles.css'
import Navbar from "./Header";
import { Link } from "react-router-dom";
const ChooseChat = () => {
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
               Choose your favourite chat application:
          </p>
         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
         <div>
          <Link to='/chat'>
          <button className="secondary-button">
            Chat with chatEngine <FiArrowRight />{" "}
          </button>
          </Link>
          </div>
         <div>
         <Link to='/chat2'>
          <button className="secondary-button">
            Chat with socket<FiArrowRight />{" "}
          </button>
          </Link>
         </div>
         </div>
        </div>
      
      </div>
    </div>
  );
};

export default ChooseChat;