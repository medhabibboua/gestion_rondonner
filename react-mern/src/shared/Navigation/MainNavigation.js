import React from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import './MainNavigation.css';
import { useState } from 'react';
import BackDrop from '../components/UIElements/BackDrop';

const MainNavigation = props => {
  const [drawerIsOpen,setDrawerIsOpen]=useState(false);
const handleOpenDrawer=()=>{
setDrawerIsOpen(true)
}

const handleCloseDrawer=()=>{
  setDrawerIsOpen(false)
}

  return (
    <React.Fragment>
    {drawerIsOpen && <BackDrop onClick={handleCloseDrawer} />}
   <SideDrawer isOpen={drawerIsOpen}>
     <nav className='main-navigation__drawer-nav' >
        <NavLinks/>
    </nav>
    </SideDrawer>
    <MainHeader>
      <button className="main-navigation__menu-btn" onClick={handleOpenDrawer}>
        <span />
        <span />
        <span />
        <span />
      </button>
      <h1 className="main-navigation__title">
        <Link to="/">YourPlaces</Link>
      </h1>
      <nav className='main-navigation__header-nav'>
        <NavLinks/>
      </nav>
    </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
