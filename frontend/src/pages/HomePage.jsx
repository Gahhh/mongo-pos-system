import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { Parallax } from 'react-parallax';
import bg from '../assets/intro-bg.jpg'
import HeaderBar from '../components/HeaderBar';


const styles = {
  background: {
    height: '100vh',
    width: '100vw',
  },
  container: {
    maxWidth: '1200px',
    margin: 'auto',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px',
    justifyContent: 'space-between',
  },
  logo: {
    height: '50px',
    width: '50px',
    margin: 'auto 10px'
  },
  logoText: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#545453',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    width: '100%',
    color: '#545453',
    justifyContent: 'center',
  },
  title: {
    fontSize: '70px',
    fontWeight: 'bold', 
    padding: '0 100px',
    textAlign: 'center',
  },
  mediumTitle: {
    fontSize: '50px',
    fontWeight: 'bold', 
    padding: '0 100px',
    textAlign: 'center',
  },
  smallTitle: {
    fontSize: '30px',
    fontWeight: 'bold', 
    padding: '0 50px',
    textAlign: 'center',
  },
  contentText: {
    fontSize: '20px',
    padding: '0 100px',
    textAlign: 'center',
  },
  smallContentText: {
    fontSize: '16px',
    padding: '0 50px',
    textAlign: 'center',
  },
  button: {
    width: '150px',
    margin: '20px auto',
    backgroundColor: '#5ca9fb',
    backgroundImage: 'linear-gradient(315deg, #5ca9fb 0%, #6372ff 100%)',
  },
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}

const HomePage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);
  const navigate = useNavigate();

  const turnToDashboard = () => {
    navigate('/register');
  };

  return <Parallax style={styles.background} blur={0} bgImage={bg} strength={100} bgImageStyle={{minHeight:"100vh"}}>
    <div style={{overflowY:'auto'}}>
    <div style={styles.container}>
      <HeaderBar styles={styles}/>
      <div style={styles.content}>
        <div style={windowWidth>700? styles.title : windowWidth>500 ? styles.mediumTitle : styles.smallTitle}>A POS SYSTEM TO INGITE YOUR BUSINESS</div>
        <div style={windowWidth>500 ? styles.contentText : styles.smallContentText}>
          Beautiful QR menu and order & pay solutions for restaurants. <br/>
          Frees up your team.
          No more writing down orders, entering it into POS & taking payments.
          <br/>
          Seamless POS integration
        </div>
        <Button type="primary" shape="round" size='large' style={styles.button} onClick={turnToDashboard}>
        Get Started
      </Button>
      </div>
    </div>
    </div>
</Parallax>
}

export default HomePage;