import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { format, isBefore } from 'date-fns';

import { SiteTheme } from 'config/delorean.config';
import { DevfestDetails } from 'config/delorean.details.js';

import { Fab } from '@mui/material';
import { ArrowRight } from '@mui/icons-material';

import { getCurrentConfig } from 'store/current/selectors';
import { ApplicationState } from 'models/states';
import { getAnalytics, logEvent } from 'firebase/analytics';

const Papercall = ({ config }) => {
  const closing = useMemo(
    () => config?.event?.papercall?.closing?.toDate(),
    [config]
  );

  const openCalltoAction = () => {
    logEvent(getAnalytics(), 'select_content', {
      content_type: 'button',
      item_id: 'cfp',
    });
    window.open(config.event.papercall.url);
  };

  return closing && isBefore(new Date(), closing) && (
    <section className="call-to-action" style={SiteTheme.CallToAction}>
      <div className="container">
        <h1 className="container-thin">
          {`Interested in speaking at ${DevfestDetails.location} ${DevfestDetails.name}?`}
        </h1>

        <p>{`Consider submitting your talk by ${format(closing, 'MMMM d, yyyy')}`}</p>

        <div className="action">
          <Fab onClick={openCalltoAction}>
            <ArrowRight />
          </Fab>
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state: ApplicationState) => ({
  config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Papercall);