// This <ArtistsGrid> component maps over an array of artists to render an item for each artist in a list
const ArtistsGrid = ({ artists }) => (
  <>
    {artists && artists.length ? (
      <ul className="StyledGrid" type="artist">
        {artists.map((artist, i) => (
          <li className="grid__item" key={i}>
            <div className="grid__item__inner">
              {artist.images[0] && (
                <div className="grid__item__img">
                  <img src={artist.images[0].url} alt={artist.name} />
                </div>
              )}
              <h3 className="grid__item__name overflow-ellipsis">{artist.name}</h3>
              <p className="grid__item__label">Artist</p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="empty-notice">No artists available</p>
    )}
  </>
);

export default ArtistsGrid;