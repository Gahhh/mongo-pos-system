import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { sideBarData } from '../config/sideBarItems';
const { Header, Content, Sider } = Layout;

const SiderBar = () => {
  const navigate = useNavigate();
  return( 
    <Layout>
  <Sider width={200} className="site-layout-background">
  <Menu
    mode="inline"
    defaultSelectedKeys={['1']}
    defaultOpenKeys={['sub1']}
    style={{
      height: '100%',
      borderRight: 0,
    }}
    items={sideBarData}
    onSelect={({ key }) => {
      navigate(`${key}`)
    }}
  />
</Sider>
</Layout>
  );
}

export default SiderBar;