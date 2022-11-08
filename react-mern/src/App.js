import React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

const Main = styled.div`
  margin-top: 5rem;
`;
let logoutTimer;
const App = () => {
  //let navigate = useNavigate();
  const [token, setToken] = useState(false);
  const [tokenExpDate,setTokenExpDate]=useState()
  const [userId, setUserId] = useState();
  const login = useCallback((uid, token,experationDate) => {
    setToken(token);
    const tokenExpDate=experationDate || new Date(new Date().getTime()+1000*60*60)
    setTokenExpDate(tokenExpDate)
    localStorage.setItem('userData',JSON.stringify({
      userId:uid,
      token,
      tokenExpDate:tokenExpDate.toIOSString(),
    }))
    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpDate(null)
    setUserId(null);
  }, []);



  useEffect(()=>{
    const userData=JSON.parse(localStorage.getItem('userData'))
    if(userData && userData.token && new Date(userData.tokenExpDate)>new Date()){
      login(userData.id,userData.token,userData.tokenExpDate)
    }else{
      localStorage.clear()
    }
  },[login])


  useEffect(()=>{
    if(token && tokenExpDate){
      const remainingTime=tokenExpDate.getTime()-new Date().getTime()
      logoutTimer=setTimeout(logout,remainingTime)
    }else{
      clearTimeout(logoutTimer)
    }
  },[token,tokenExpDate,logout])
  
  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
    // navigate("/")
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
    // navigate("/auth")
  }
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, userId, login, logout }}
    >
      <Router>
        <MainNavigation />
        <Main>{routes}</Main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
