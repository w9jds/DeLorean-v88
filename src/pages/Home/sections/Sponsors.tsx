import React, { FC, Fragment } from 'react';
import { connect } from 'react-redux';

// import { GridList, GridListTile } from '@mui/material';

import { ApplicationState } from 'models/states';
import { getSponsors, getCurrentConfig } from 'store/current/selectors';
import { SiteTheme } from 'config/delorean.config';
import { DevfestDetails } from 'config/delorean.details.js';

import './Sponsors.scss';

type SponsorsProps = ReturnType<typeof mapStateToProps>;

const Sponsors: FC<SponsorsProps> = ({config, sponsors}) => {

  // const buildSponsorTiles = () => Object.keys(sponsors).map(key => {
  //   let sponsor = sponsors[key];

  //   return (
  //     <GridListTile key={key}
  //       className="sponsor-tile"
  //       classes={{
  //           tile: 'tile-override',
  //           imgFullWidth: 'image-override',
  //           imgFullHeight: 'image-override'
  //       }}
  //       onClick={() => window.open(sponsor.siteUri)}
  //     >
  //       <img className="sponsor-image" src={sponsor.logoUri} />
  //     </GridListTile>
  //   );
  // });

  return(
    <Fragment>
      <header style={SiteTheme.SponsorHeader}>
        <div className="container">
          <h1>Sponsors and Community Partners</h1>
        </div>

        <div className="action container-thin">
          <span>{`Meet the organizations that make ${DevfestDetails.location} ${DevfestDetails.name} possible. If you’d like to learn more about sponsorships, read our `}</span>
          <a href="https://docs.google.com/document/d/15Bj6Cw9wZ6a128YijDlbfL8LwpuZ-mKhMgjg1DHrp5w/edit?usp=sharing">Sponsor Prospectus</a>
          <span> or </span>
          <a href={config && config.org ? `mailto:${config.org.email}` : ''}>email us</a>
        </div>
      </header>

      <div className="organizations">
        <div className="sponsor-grid container" >
          {/* <GridList classes={{ root: 'grid-root' }} cellHeight={90} cols={4}>
            {sponsors ? buildSponsorTiles() : null}
          </GridList> */}
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  sponsors: getSponsors(state),
  config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Sponsors);