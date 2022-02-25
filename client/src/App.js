import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import {accessToken, logout, getCurrentUserProfile} from './spotify'; //imported the access token from spotify.js and used the useState hook to keep track of the token
import { catchErrors } from './utils';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TopArtists from './pages/TopArtists';
import TopTracks from './pages/TopTracks';
import Playlists from './pages/Playlists';
import IndividualPlaylist from './pages/IndividualPlaylist';
import './App.css';

// SERVICES THAT CALL OUR API ENDPOINTS
// import { getAllProfiles } from "./services/profileService";
//////


// Scroll to top of page when changing routes
// https://reactrouter.com/web/guides/scroll-restoration/scroll-to-top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


function App() {
  const [token, setToken] = useState(null);  //token state variable used to conditionally render the login button, or a logged-in state, with a ternary.
  // useEffect(() => {
  //   async function getProfiles() {
  //     if (!profiles) {
  //       const response = await getAllProfiles();
  //       setProfiles(response);
  //     }
  //   }

  //The useEffect hook stores the values of the access_token and refresh_token into variables
  useEffect(() => {
    setToken(accessToken);
  }, []);


  //   getProfiles();
  // }, [profiles]);

  // const renderProfile = (user) => {
  //   return (
  //     <li key={user._id}>
  //       <h3>
  //         {`${user.first_name} 
  //         ${user.last_name}`}
  //       </h3>
  //       <p>{user.location}</p>
  //     </li>
  //   );
  // };

  return (
    <div className="App">
      {/* <ul>
        {profiles && profiles.length > 0 ? (
          profiles.map((profile) => renderProfile(profile))
        ) : (
          <p>No profiles found</p>
        )}
      </ul> */}
      {!token ? (
        <Login />
      ) : (
        <>
          <button onClick={logout} className="StyledLogoutButton">Log Out</button>

          <Router>
            <ScrollToTop />

            {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. (previously <Switch> in react router v5)*/}
            <Routes>
              {/* Each route (page) is wrapped in a <Route> component, and we declare the path we want that route to use with the path prop */}
              <Route element={<TopArtists />} path="/top-artists"/>
              <Route element={<TopTracks />} path="/top-tracks"/>
              <Route element={<IndividualPlaylist />} path="/playlists/:id"/>
              <Route element={<Playlists />} path="/playlists"/>
              <Route element={<Profile />} path="/"/>
            </Routes>
          </Router>
        </>
      )}
    </div>
  );
}


export default App;
