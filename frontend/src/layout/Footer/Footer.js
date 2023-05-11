import React from 'react';
import playStore from "../../images/playstore.png";
import appStore from "../../images/Appstore.png";
import "./Footer.css"

const Footer = () => {
  return (
    <footer id="footer">
        <div className="leftFooter">
            <h4>Download our app</h4>
            <p>Download App for Android and IOS mobile phone</p>
            <img src={playStore} alt="playstore" />
            <img src={appStore} alt="AppStore" />

        </div>
        <div className="midFooter">
            <h1>Shopus</h1>
            <p>High Quality is our first priority &copy; SoumyaJaiswal</p>
            <p>Copyright 2023 </p>

        </div>
        <div className="rightFooter">
            <h4>Follow Us</h4>
            <a href="http://instagram.com/SoumyaJaiswal">Instagram</a>
            <a href="http://instagram.com/SoumyaJaiswal">Youtube</a>
            <a href="http://instagram.com/SoumyaJaiswal">Facebook</a>

        </div>




    </footer>
    
  );
};

export default Footer;