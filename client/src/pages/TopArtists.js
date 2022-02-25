import { useState, useEffect } from 'react';
import { getTopArtists } from '../spotify';
import { catchErrors } from '../utils';
import SectionWrapper from '../components/SectionWrapper';
import ArtistsGrid from '../components/ArtistsGrid';
import TimeRangeButtons from '../components/TimeRangeButtons';
import '../Loader.css';


//This is an expanded version of the top artists section on the Profile page, with some buttons at the top for the user to toggle between time ranges.
//This component calls the getTopArtists() function from our spotify.js file, and passes ${activeRange}_term as an argument.
const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopArtists(`${activeRange}_term`);  //controls the time range toggle buttons.
      setTopArtists(data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      <SectionWrapper title="Top Artists" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topArtists && topArtists.items ? (
          <ArtistsGrid artists={topArtists.items} />
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

export default TopArtists;