import { Link } from 'react-router-dom';

// <SectionWrapper> component is used to make the styles visually consistent with the rest of the site

const SectionWrapper = ({ children, title, seeAllLink, breadcrumb }) => (
  <section className= "StyledSection">
    <div className="section__inner">
      <div className="section__top">
        <h2 className="section__heading">
          {breadcrumb && (
            <span className="section__breadcrumb">
              <Link to="/">Profile</Link>
            </span>
          )}
          {title && (
            <>
              {seeAllLink ? (
                <Link to={seeAllLink}>{title}</Link>
              ) : (
                <span>{title}</span>
              )}
            </>
          )}
        </h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="section__see-all">See All</Link>
        )}
      </div>

      {children}
    </div>
  </section>
);

export default SectionWrapper;