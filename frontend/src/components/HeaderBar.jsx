import React,{useEffect, useState} from 'react';
import logo from '../assets/logo.png';
import HomeNavBar from '../components/HomeNavBar';


const HeaderBar = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);
  const { styles } = props;
  return (
    <div style={{...styles.titleContainer, }}>
      <div style={{display:"flex"}}>
        <img src={logo} alt="logo" style={styles.logo}/>
        {windowWidth>820 &&<div style={{...styles.logoText}} >Mongo Magic</div>}
      </div>
      <HomeNavBar style={styles.navBar}/>
  </div>
  )
}

export default HeaderBar;