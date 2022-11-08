import React,{ useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../components/FormElements/Button';
import { AuthContext } from '../context/auth-context';
import './NavLinks.css'

function NavLinks() {
    const {isLoggedIn,userId,login,logout}=useContext(AuthContext)
  return (
    <ul className='nav-links'>
        <li>
            <NavLink to="/">all Users</NavLink>
        </li>
        {isLoggedIn && <li>
            <NavLink to={`/${userId}/places`}>my places</NavLink>
        </li>}
        {isLoggedIn && <li>
            <NavLink to="/places/new">add places</NavLink>
        </li>}
        {!isLoggedIn && <li>
            <NavLink to="/auth">authenticate</NavLink>
        </li>}
        {isLoggedIn &&<Button onClick={logout} danger>LOGOUT</Button> }
    </ul>
  )
}

export default NavLinks