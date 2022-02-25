import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { catchErrors } from "../utils";
import { getPlaylistById, getAudioFeaturesForTracks } from "../spotify";
import TrackList from '../components/TrackList';
import SectionWrapper from '../components/SectionWrapper';
import '../Loader.css';

/**
 * This page will display all of the tracks in the playlist as well as add a way for users
 * to sort songs by different audio features like danceability, tempo, and energy.
 * We'll use React Router's useParams hook to get the ID param off of the URL
 *  and pass it to getPlaylistsById to fetch our playlist data.
 */

const IndividualPlaylist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [sortValue, setSortValue] = useState('');
  const sortOptions = ['danceability', 'tempo', 'energy'];  //set an array of audio features we want our tracks to be sortable by (sortOptions)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylistById(id);
      setPlaylist(data);
      setTracksData(data.tracks);
    };

    catchErrors(fetchData());
  }, [id]);

  // When tracksData updates, compile arrays of tracks and audioFeatures
  useEffect(() => {
    if (!tracksData) {
      return;
    }

    // When tracksData updates, check if there are more tracks to fetch
    // then update the state variable
    const fetchMoreData = async () => {
      if (tracksData.next) {
        const { data } = await axios.get(tracksData.next);
        setTracksData(data);
      }
    };

    setTracks(tracks => ([
      ...tracks ? tracks : [],
      ...tracksData.items
    ]));

    catchErrors(fetchMoreData());

    // Also update the audioFeatures state variable using the track IDs
    const fetchAudioFeatures = async () => {
      const ids = tracksData.items.map(({ track }) => track.id).join(",");
      const { data } = await getAudioFeaturesForTracks(ids);
      setAudioFeatures((audioFeatures) => ([
        ...audioFeatures ? audioFeatures : [],
        ...data["audio_features"],
      ]));
    };
    catchErrors(fetchAudioFeatures());

  }, [tracksData]);

  // Map over tracks and add audio_features property to each track
  //We're just mapping over the tracks array, finding the corresponding audio features object from the audioFeatures array using the track's id,
  // and assigning it to the track's audio_features property.
  const tracksWithAudioFeatures = useMemo(() => {
    if (!tracks || !audioFeatures) {
      return null;
    }

    return tracks.map(({ track }) => {
      const trackToAdd = track;

      if (!track.audio_features) {
        const audioFeaturesObj = audioFeatures.find((item) => {
          if (!item || !track) {
            return null;
          }
          return item.id === track.id;
        });

        trackToAdd["audio_features"] = audioFeaturesObj;
      }

      return trackToAdd;
    });
  }, [tracks, audioFeatures]);

  // Sort tracks by audio feature to be used in template
  const sortedTracks = useMemo(() => {
    if (!tracksWithAudioFeatures) {
      return null;
    }

    return [...tracksWithAudioFeatures].sort((a, b) => {
      const aFeatures = a["audio_features"];
      const bFeatures = b["audio_features"];

      if (!aFeatures || !bFeatures) {
        return false;
      }

      return bFeatures[sortValue] - aFeatures[sortValue];
    });
  }, [sortValue, tracksWithAudioFeatures]);

  return (
    <>
      {playlist && (
        <>
          <header className="StyledHeader">
            <div className="header__inner">
              {playlist.images.length && playlist.images[0].url && (
                <img
                  className="header__img"
                  src={playlist.images[0].url}
                  alt="Playlist Artwork"
                />
              )}
              <div>
                <div className="header__overline">Playlist</div>
                <h1 className="header__name">{playlist.name}</h1>
                <p className="header__meta">
                  {playlist.followers.total ? (
                    <span>
                      {playlist.followers.total}{" "}
                      {`follower${playlist.followers.total !== 1 ? "s" : ""}`}
                    </span>
                  ) : null}
                  <span>
                    {playlist.tracks.total}{" "}
                    {`song${playlist.tracks.total !== 1 ? "s" : ""}`}
                  </span>
                </p>
              </div>
            </div>
          </header>

          <main>
            <SectionWrapper title="Playlist" breadcrumb={true}>
              <div className="StyledDropdown" active={!!sortValue}>
                <label className="sr-only" htmlFor="order-select">
                  Sort tracks
                </label>
                <select
                  name="track-order"
                  id="order-select"
                  onChange={(e) => setSortValue(e.target.value)} //The onChange event calls our setSortValue function to update the active sortValue.
                >
                  <option value="">Sort tracks</option>
                  {sortOptions.map((option, i) => (
                    <option value={option} key={i}>
                      {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                    </option>
                  ))}
                </select>
              </div>

              {sortedTracks ? (
                <TrackList tracks={sortedTracks} />
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
        </>
      )}
    </>
  );
};

export default IndividualPlaylist;
