import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { getSiteIdRequest } from '../utils/apiRequests';
import RoleDisplayCard from '../components/RoleDisplayCard';
import backpic from '../assets/backoffice.jpg';
import pospic from '../assets/pos.jpg';
import kitchenpic from '../assets/produce.jpg';
import HeaderBar from '../components/HeaderBar';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    margin: 'auto',
    width: '100%',
    textAlign: 'center',
  },
  roleDisplayCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    width: '100%',
    marginTop: "150px",
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px',
    justifyContent: 'space-between',
  },
  logo: {
    height: '30px',
    width: '30px',
    margin: 'auto 10px'
  },
  logoText: {
    fontSize: '25px',
    fontWeight: 'bold',
    color: '#545453',
  },
  button: {
    fontSize: '20px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    marginBottom: '20px',
  },
  smallCardStyle: {
    width: '70vw',
    minWidth: '250px',
    margin: 6
  },
  mediumCardStyle: {
    width: '30vw',
    margin: 6
  },
  largeCardStyle: {
    width: 230,
    margin: 6
  },
}

const ChoiceOfRoles = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);
  const navigate = useNavigate();
  const [siteId, setSiteId] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const getSiteId = async () => {
    const response = await getSiteIdRequest();
    if (response.ok) {
      const data = await response.json();
      setSiteId(data.siteId);
      setIsLoaded(true);
    } else {
      setIsLoaded(true);
    }
  }

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
    getSiteId();
  }, []);

  if (!isLoaded) {
    return null
  }

  return <div style={styles.container}>
    <HeaderBar styles={styles}/>
    <div style={windowWidth>550 ?styles.roleDisplayCard : {...styles.roleDisplayCard, flexDirection:'column', marginTop:20}}>
      <div onClick={() => navigate('/adminpin')}>
        <RoleDisplayCard title={'Back Office'} link={backpic} cardStyle={windowWidth>725 ? styles.largeCardStyle: windowWidth>550 ? styles.mediumCardStyle : styles.smallCardStyle}/>
      </div>
      <div onClick={() => navigate('/pos')}>
        <RoleDisplayCard title={'POS'} link={pospic} cardStyle={windowWidth>725 ? styles.largeCardStyle: windowWidth>550 ? styles.mediumCardStyle : styles.smallCardStyle}/>
      </div>
      <div onClick={() => navigate('/kitchen')}>
        <RoleDisplayCard title={'Kitchen'} link={kitchenpic} cardStyle={windowWidth>725 ? styles.largeCardStyle: windowWidth>550 ? styles.mediumCardStyle : styles.smallCardStyle}/>
      </div>
    </div>
    <div style={{fontSize:"18px", fontWeight:"bold", margin:"20px 0px"}}>
      <span>Restaurant Menu Page</span><br/> <span>(Only Support Mobile Device View):</span>
      <br />
      <Button style={styles.button} danger type='link' onClick={() => navigate(`/restaurant/${siteId}`)}>Customer Menu</Button>
    </div>
  </div>
}

export default ChoiceOfRoles;