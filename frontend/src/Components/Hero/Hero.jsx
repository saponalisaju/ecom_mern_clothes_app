import React from "react";
import "./Hero.css";
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow.png";
import hero_image from "../Assets/hero.webp";
const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        {/* <marquee
          className="marquee fs-3 text-danger"
          behavior="scroll"
          direction="rtl"
        >
          Eid Offer 25% discount
        </marquee> */}
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className="hero-hand-icon">
            <p>new</p>
            <img src={hand_icon} alt="" />
          </div>
          <p>collections</p>
          <p>for everyone</p>
        </div>
        <div className="hero-latest-btn">
          <div>Latest Collection</div>
          <a href="/new_collection">
            <img src={arrow_icon} alt="" />
          </a>
        </div>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  );
};

export default Hero;
