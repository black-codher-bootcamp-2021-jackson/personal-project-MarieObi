import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUserPlaylists } from '../spotify';
import { catchErrors } from '../utils';
import SectionWrapper from '../components/SectionWrapper';
import PlaylistsGrid from '../components/PlaylistsGrid';
import '../Loader.css';

const Playlists = () => {
  const [playlistsData, setPlaylistsData] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();
      setPlaylistsData(data);
    };

    catchErrors(fetchData());
  }, []);

  // When playlistsData updates, check if there are more playlists to fetch
  // then update the state variable
  useEffect(() => {
    if (!playlistsData) {
      return;
    }

    // Playlist endpoint only returns 20 playlists at a time, so we need to
    // make sure we get ALL playlists by fetching the next set of playlists
    // The Spotify API handles this by wrapping the JSON response in a paging object
    // which has a 'next' property containing the URL of the next page of items.
    const fetchMoreData = async () => {
      if (playlistsData.next) {
        const { data } = await axios.get(playlistsData.next);
        setPlaylistsData(data);
      }
    };

    // Use functional update to update playlists state variable
    // to avoid including playlists as a dependency for this hook
    // and creating an infinite loop
    setPlaylists(playlists => ([
      ...playlists ? playlists : [],
      ...playlistsData.items
    ]));

    // Fetch next set of playlists as needed
    catchErrors(fetchMoreData());

  }, [playlistsData]);

  return (
    <main>
      <SectionWrapper title="Public Playlists" breadcrumb={true}>
        {playlists ? (
          <PlaylistsGrid playlists={playlists} />
        ) : (
          <div className="StyledLoader">
            <div className="bars">
              <div className="StyledBar1"></div>
              <div className="StyledBar2"></div>
              <div className="StyledBar3"></div>
              <div className="StyledBar4"></div>
              <div className="StyledBar5"></div>
            </div>
          </div>
        )}
      </SectionWrapper>
    </main>
  );
};

export default Playlists;