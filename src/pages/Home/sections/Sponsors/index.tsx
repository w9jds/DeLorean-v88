import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import SponsorTile from './Tile';

import { ApplicationState } from 'models/states';
import { getSponsors, getCurrentConfig } from 'store/current/selectors';
import { SiteTheme } from 'config/delorean.config';
import { DevfestDetails } from 'config/delorean.details.js';


const Sponsors: FC = () => {
  const sponsors = useSelector(getSponsors);
  const config = useSelector(getCurrentConfig);

  return (
    <section className="sponsors">
      <header style={SiteTheme.SponsorHeader}>
        <div className="container">
          <h1>Sponsors and Community Partners</h1>
        </div>

        <div className="action container-thin">
          <span>{`Meet the organizations that make ${DevfestDetails.location} ${DevfestDetails.name} possible. If you’d like to learn more about sponsorships, read our `}</span>
          <a href={config?.event?.sponsors?.prospectus}>Sponsor Prospectus</a>
          <span> or </span>
          <a href={config?.org ? `mailto:${config.org.email}` : ''}>email us</a>
        </div>
      </header>

      {
        sponsors && Object.keys(sponsors)?.length && (
          <div className="sponsor-grid container" >
            {Object.values(sponsors).map(sponsor => <SponsorTile details={sponsor} />)}
          </div>
        )
      }
    </section>
  );
};

export default Sponsors;