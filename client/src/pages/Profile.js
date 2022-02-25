import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserProfile, getCurrentUserPlaylists, getTopArtists, getTopTracks } from '../spotify';
import SectionWrapper from '../components/SectionWrapper';
import ArtistsGrid from '../components/ArtistsGrid';
import TrackList from '../components/TrackList';
import PlaylistsGrid from '../components/PlaylistsGrid';
import '../Loader.css';
// import Loader from './Loader.css'

const Profile = () => {
  const [profile, setProfile] = useState(null);  // adding another use state hook to keep track of the data it returns
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  //The useEffect hook stores the values of the access_token and refresh_token into variables
  useEffect(() => {
    // setToken(accessToken);

    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();  //using destructuring to access the data property of the axios response.
      setProfile(userProfile.data);  //set data to profile state variable

      const userPlaylists = await getCurrentUserPlaylists();  //using destructuring to access the data property of the axios response.
      setPlaylists(userPlaylists.data);  //set data to playlists state variable

      // console.log(userPlaylists.data) - used to check if playlist objects are shown in console

      const userTopArtists = await getTopArtists();
      setTopArtists(userTopArtists.data);

      const userTopTracks = await getTopTracks();
      setTopTracks(userTopTracks.data);
    };

    //our higher-order function will take our async function, fetchData(), as an argument, and wrap our asynchronous code in a try/catch for us.
    catchErrors(fetchData());
  }, []);

  return (
    <>
      {profile && (
        <>
          <header className="StyledHeader" type="user">
            <div className="header__inner">
              {profile.images.length && profile.images[0].url && (
                <img
                  className="header__img"
                  src={profile.images[0].url}
                  alt="Avatar"
                />
              )}
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">
                  {playlists && (
                    <span>
                      {playlists.total} Playlist
                      {playlists.total !== 1 ? "s " : ""}
                    </span>
                  )}
                  <span>
                    {profile.followers.total} Follower
                    {profile.followers.total !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>
          </header>

          <main>
            {topArtists && topTracks && playlists ? (
              <>
                <SectionWrapper title="Top artists this month" seeAllLink="/top-artists">
                  {/* Passed our top 10 artists (topArtists.items.slice(0, 10)) to our <ArtistsGrid> component to keep our Profile page tidy. */}
                  <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
                </SectionWrapper>

                <SectionWrapper title="Top tracks this month" seeAllLink="/top-tracks">
                  <TrackList tracks={topTracks.items.slice(0, 10)} />
                </SectionWrapper>

                <SectionWrapper title="Public Playlists" seeAllLink="/playlists">
                  {/* Passed the top ten playlists to our <PlaylistsGrid> */}
                  <PlaylistsGrid playlists={playlists.items.slice(0, 10)} />
                </SectionWrapper>
              </>
            ) : (
              <div className="StyledLoader">
                <div className="bars">
                  <div className= "StyledBar1"></div>
                  <div className= "StyledBar2"></div>
                  <div className= "StyledBar3"></div>
                  <div className= "StyledBar4"></div>
                  <div className= "StyledBar5"></div>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </>
  );
};

export default Profile;