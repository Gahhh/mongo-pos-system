import React, {useState, useEffect} from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import './Dashboard.css';
import { Layout, Menu } from 'antd';
import { sideBarData } from '../config/sideBarItems';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
const { Sider } = Layout;

const isSmallScreen = () => {
  return window.innerWidth < 576;
}

const Dashboard = () => {
  const [showSider, setShowSider] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isSmallScreen()) {
      setShowSider(false);
    } else {
      setShowSider(true);
    }
    window.addEventListener('resize', () => {
      if (isSmallScreen()) {
        setShowSider(false);
      } else {
        setShowSider(true);
      }
    });
  }, []);
  const handleMenuClick = (item) => {
    navigate(item.key);
  }

  if (!localStorage.getItem('token')) {
    navigate('/login');
  }

  if (!sessionStorage.getItem('verified')) {
    navigate('/adminpin');
  }

  return <React.Fragment>
    <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: showSider ? 0 : -200,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['/dashboard/mysite']} items={sideBarData} onSelect={handleMenuClick} />
    </Sider>
    <div style={{marginLeft: showSider ? 200 : 0, 
      position: 'fixed',
      top:10,
      backgroundColor: 'lightgrey',
      borderBottomRightRadius: 8,
      borderTopRightRadius: 8,
      padding: 5,
      cursor: 'pointer',
      zIndex: 1000,
    }}
    onClick={() => setShowSider(!showSider)}
    >
      {
        showSider ?
        <LeftOutlined/> :
        <RightOutlined/>
      }
    </div>
    <div style={{
      marginLeft: showSider ? 200 : 0,
      minWidth: 300,
      height: '100vh',
      overflowY : 'scroll',
      overflowX: 'hidden',
      }}>
      <Outlet />
    </div>
    </React.Fragment>
}

export default Dashboard;