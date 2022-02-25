/**
 * This component takes two props: activeRange and setActiveRange. 
 * activeRange is a string that's either short, medium, or long that we'll use to set the active button & fetch the right data from the Spotify API.
 * setActiveRange is the function that we'll use to update the activeRange state variable when users click the buttons.
 */
const TimeRangeButtons = ({ activeRange, setActiveRange }) => {
  return (
    <ul className ="StyledRangeButtons">
      <li>
        <button
          className={activeRange === 'short' ? 'active' : ''}
          onClick={() => setActiveRange('short')}>
          This Month
        </button>
      </li>
      <li>
        <button
          className={activeRange === 'medium' ? 'active' : ''}
          onClick={() => setActiveRange('medium')}>
          Last 6 Months
        </button>
      </li>
      <li>
        <button
          className={activeRange === 'long' ? 'active' : ''}
          onClick={() => setActiveRange('long')}>
          All Time
        </button>
      </li>
    </ul>
  );
};

export default TimeRangeButtons;