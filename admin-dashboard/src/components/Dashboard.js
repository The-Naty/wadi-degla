import Analytics from './Analytics'
import Users from './Users'
import Products from './Products'
import Orders from './Orders'
import { Routes , Route, useNavigate } from 'react-router-dom'

import React, { useState } from 'react';
import { Menu, Modal, Drawer, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ProductOutlined,
  OrderedListOutlined,
  PoweroffOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import wd_logo from '../components/Assets/wadi-degla-logo-color.svg'


const SideBar = () => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  function Content () {

    return <Routes>
      
      <Route path='/' element={<Analytics/>}></Route>
      <Route path='/users' element={<Users/>}></Route>
      {/*<Route path='/products' element={<Products/>}></Route>*/}
      <Route path='/orders' element={<Orders/>}></Route>

    </Routes>

  }

  const handleMenuClick = ({ key }) => {
    if (key === 'signout') {
      Modal.confirm({
        title: 'Are you sure you want to sign out?',
        onOk: () => {
          localStorage.removeItem('token');
          navigate('/');
          window.location.reload();
        },
        okText: 'Yes',
        okType: 'danger',
      });
    } else {
      navigate(key);
      if (isMobile) {
        setDrawerVisible(false);  // Close drawer on menu item click in mobile view
      }
    }
  };

  const menuItems = [
    { label: 'Dashboard', key: '/', icon: <DashboardOutlined /> },
    { label: 'Users', key: '/users', icon: <UserOutlined /> },
    // { label: 'Products', key: '/products', icon: <ProductOutlined /> },
    { label: 'Orders', key: '/orders', icon: <OrderedListOutlined /> },
    { label: 'Signout', key: 'signout', icon: <PoweroffOutlined />, danger: true },
  ];

  return (
    <div style={{ display: 'flex', width: '100%', marginTop: 0 }}>
      {isMobile ? (
        <>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            style={{ position:"absolute" , top:0 ,left:10 }}
          >
            
          </Button>
          <Drawer
            title="Menu"
            placement="left"
            closable={true}
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
          >
            <Menu
              mode="inline"
              onClick={handleMenuClick}
              items={menuItems}
            />
          </Drawer>
        </>
      ) : (
        <Menu
          mode="inline"
          onClick={handleMenuClick}
          style={{ width: 256 }}
          items={menuItems}
        />
      )}
      <div style={{ flex: 1, padding: '5px' }}>
        <Content />
      </div>
    </div>
  );
};




const Dashboard = () => {


  return (
    <>
    <Header/>
    <SideBar/>
    </>
    
  )



  function Header (){

    return <div style={{height:100 , backgroundColor:"white" , fontWeight:"bold" , display:"flex" , flexDirection:"column", justifyContent:"center",
                alignItems:"start" , color:"rgb(80, 48, 4)" , fontFamily:"sans-serif" , marginLeft: "2rem", marginRight: "2rem"
    }}>

      <img src={wd_logo}/>
      <hr style={{
      width: "100%", 
      border: "1px solid rgb(80, 48, 4, 0.1)", 
      marginTop: "1rem"
    }} />
    </div>
  }


  

  

}

export default Dashboard 