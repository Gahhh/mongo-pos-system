import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './HomeNavBar.css';

const HomeNavBar = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  const { style } = props;
  const [isLogin, setIsLogin] = React.useState(false);
  
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLogin(true);
    }
  }, []);

  const navigate = useNavigate();
  const turnToHome = () => {
    navigate('/');
  };
  const turnToDashboard = () => {
    navigate('/roles');
  };
  const turnToLogin = () => {
    navigate('/login');
  };
  const turnToRegister = () => {
    navigate('/register');
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    setIsLogin(false);
  };


  
  return <div style={style}>
    {windowWidth > 430 && 
    <Button className='nav-item' type="link" ghost onClick={turnToHome}>
      Home
    </Button>
    }
    {
      localStorage.getItem('token') 
      ? <Button className='nav-item' type="link" ghost onClick={turnToDashboard}>Dashboard</Button>
      : <Button className='nav-item' type="link" ghost onClick={turnToLogin}>Login</Button>
    }
    {
      localStorage.getItem('token') 
      ? <Button className='nav-item' type="link" ghost onClick={handleLogout}>Logout</Button>
      : <Button className='nav-item' type="link" ghost onClick={turnToRegister}>Register</Button>
    }
  </div>
}

export default HomeNavBar;