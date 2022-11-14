import React from 'react';
import LoginForm from '../components/LoginForm';
import { Parallax } from 'react-parallax';
import bg from '../assets/loginBg.jpg';
import HeaderBar from '../components/HeaderBar';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    margin: 'auto',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    minHeight: '100vh',
    height: '100%',
    paddingTop: '100px',
  },
  formTitle: {
    fontSize: '30px',
    fontWeight: '600',
    margin: '0 auto',
    marginButtom: '20px',
    textAlign: 'center'
  },
  formBackground: {
    backgroundColor: '#f5f5f5',
    borderRadius: '25px',
    padding: '20px',
    margin: '0 auto',
    width: '60vw',
    minWidth: '280px',
    maxWidth: '400px',
    opacity: '0.9',
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
}

const LoginPage = () => {
  return (<Parallax style={styles.background} blur={0} bgImage={bg} strength={100} bgImageStyle={{minHeight:"100vh"}}>
    <div style={styles.container}>
      <HeaderBar styles={styles}/>
      <div style={styles.loginForm}>
        <div style={styles.formBackground}>
          <div style={styles.formTitle}>Login</div>
          <LoginForm />
        </div>
      </div>
    </div>
    </Parallax>);
}


export default LoginPage;