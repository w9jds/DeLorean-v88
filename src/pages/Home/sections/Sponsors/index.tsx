import React, { FC } from 'react';
import { connect } from 'react-redux';

import SponsorTile from './Tile';

import { ApplicationState } from 'models/states';
import { getSponsors, getCurrentConfig } from 'store/current/selectors';
import { SiteTheme } from 'config/delorean.config';
import { DevfestDetails } from 'config/delorean.details.js';

type SponsorsProps = ReturnType<typeof mapStateToProps>;

const Sponsors: FC<SponsorsProps> = ({config, sponsors}) => {

  return (
    <section className="sponsors">
      <header style={SiteTheme.SponsorHeader}>
        <div className="container">
          <h1>Sponsors and Community Partners</h1>
        </div>

        <div className="action container-thin">
          <span>{`Meet the organizations that make ${DevfestDetails.name} ${DevfestDetails.location} possible. If you’d like to learn more about sponsorships, read our `}</span>
          <a href="https://docs.google.com/document/d/15Bj6Cw9wZ6a128YijDlbfL8LwpuZ-mKhMgjg1DHrp5w/edit?usp=sharing">Sponsor Prospectus</a>
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

const mapStateToProps = (state: ApplicationState) => ({
  sponsors: getSponsors(state),
  config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Sponsors);