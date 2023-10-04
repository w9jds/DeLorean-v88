import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { isAfter, format } from 'date-fns';

import { Fab, Button } from '@mui/material';
import { ArrowRight } from '@mui/icons-material';

import Map from './sections/Map';
import Sponsors from './sections/Sponsors';

import { ApplicationState } from 'models/states';
import { EventbriteConfig, SiteTheme } from 'config/delorean.config';
import { DevfestDetails } from 'config/delorean.details.js';
import { getCurrentConfig } from 'store/current/selectors';

import Logo from 'assets/event-logo.svg';
import background from 'assets/intro-background.jpg';

import './index.scss';

type HomeProps = ReturnType<typeof mapStateToProps> & RouteComponentProps;

class Home extends React.Component<HomeProps> {
  componentDidMount() {
    if (window['EBWidgets']) {
      // tslint:disable-next-line:no-string-literal
      window['EBWidgets'].createWidget({
        widgetType: 'checkout',
        eventId: EventbriteConfig.eventId,
        modal: true,
        modalTriggerElementId: `get-event-tickets-${EventbriteConfig.eventId}`
      });
    }
  }

  openCalltoAction = () => window.open(this.props.config.event.papercall.url);

  buildVenueSection = () => {
    const { config } = this.props;

    if (!config || !config.venue) {
      return null;
    }

    return (
      <section className="venue">
        <Map />
      </section>
    );
  }

  buildPapercallSection = () => {
    const { config } = this.props;
    const closing = config?.event?.papercall?.closing?.toDate();

    if (!closing || isAfter(new Date(), closing)) {
      return null;
    }

    return (
      <section className="call-to-action" style={SiteTheme.CallToAction}>
        <div className="container">
          <h1 className="container-thin">
            {`Interested in speaking at ${DevfestDetails.location} ${DevfestDetails.name}?`}
          </h1>

          <p>{`Consider submitting your talk by ${format(closing, 'MMMM d, yyyy')}`}</p>

          <div className="action">
            <Fab onClick={this.openCalltoAction}>
              <ArrowRight />
            </Fab>
          </div>
        </div>
      </section>
    );
  }

  render() {
    let { config } = this.props;
    const startDate = config?.event?.startDate?.toDate();

    return(
      <main>
        <section className="intro" style={{ backgroundImage: `url(${background})` }}>
          <div className="container">
            <Logo className="event-logo mb-4"/>

            <h1 className="container-thin">
              {DevfestDetails.description}
            </h1>

            <h3>{startDate && format(startDate, 'MMMM d, yyyy')}</h3>
            <h3>{config?.venue?.name}</h3>

            <div className="mt-4">
              <Button id={`get-event-tickets-${EventbriteConfig.eventId}`} variant="contained" color="secondary">
                Get Tickets
              </Button>
            </div>
          </div>
        </section>

        {this.buildPapercallSection()}
        {this.buildVenueSection()}

        <section className="sponsors">
          <Sponsors />
        </section>
      </main>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Home);