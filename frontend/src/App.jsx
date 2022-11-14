import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChoiceOfRoles from './pages/ChoiceOfRoles';
import Dashboard from './pages/Dashboard';
import VerifyAdminPage from './pages/VerifyAdminPage';
import React from 'react';
import DashboardProfile from './components/DashboardProfile';
import ChangePasswordPage from './pages/ChangePasswordPage';
import MenuHomePage from './pages/MenuHomePage';
import CreateMenuItem from './components/CreateMenuItem';
import RestaurantPage from './pages/RestaurantPage';
import SiteInfo from './components/SiteInfo';
import CreateCategory from './components/CreateCategory';
import CashierPage from './pages/CashierPage';
import KitchenPage from './pages/KitchenPage';
import MySite from './components/MySite';

const App = () => {
  return (

      <Router>
        <Routes >
          <Route path='/' element={<HomePage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/roles' element={<ChoiceOfRoles />} />
          <Route path='/dashboard' element={<Dashboard />}>
            <Route path='mysite' element={<MySite />} />
            <Route path='profile' element={<DashboardProfile />} />
            <Route path='createMenuItem' element={<CreateMenuItem />} />
            <Route path='createCategory' element={<CreateCategory/>} />
            <Route path='SiteInfo' element={<SiteInfo />} />
          </Route>
          <Route path='/adminpin' element={<VerifyAdminPage />} />
          <Route path='/changepassword' element={<ChangePasswordPage />} />
          <Route path='/customer' element={<MenuHomePage />} />
          <Route path='/restaurant/:id' element={<RestaurantPage />} />
          <Route path='/pos' element={<CashierPage />} />
          <Route path='/kitchen' element={<KitchenPage />} />
          
        </Routes>
      </Router>
  );
}

export default App;