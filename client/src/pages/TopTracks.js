import { useState, useEffect } from 'react';
import { getTopTracks } from '../spotify';
import { catchErrors } from '../utils';
import SectionWrapper from '../components/SectionWrapper';
import TrackList from '../components/TrackList';
import TimeRangeButtons from '../components/TimeRangeButtons';
import '../Loader.css';

// We're calling getTopTracks() & displaying each track with the <TrackList> component
const TopTracks = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopTracks(`${activeRange}_term`);
      setTopTracks(data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      <SectionWrapper title="Top Tracks" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topTracks && topTracks.items ? (
          <TrackList tracks={topTracks.items} />
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

export default TopTracks;