import React, { FC, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { format } from 'date-fns';

import { Button } from '@mui/material';

import Venue from './sections/Map';
import Sponsors from './sections/Sponsors';
import Papercall from './sections/Papercall';
import { DeloreanRoutes } from 'components/MainLayout';

import { ApplicationState } from 'models/states';
import { getCurrentConfig } from 'store/current/selectors';
import { EventbriteConfig } from 'config/delorean.config';
import { DevfestDetails } from 'config/delorean.details.js';

import Logo from 'assets/event-logo.svg';
import background from 'assets/intro-background.jpg';

import './index.scss';

type HomeProps = ReturnType<typeof mapStateToProps> & RouteComponentProps;

const Home: FC<HomeProps> = ({
  config,
  location,
  history,
}) => {
  const startDate = config?.event?.startDate?.toDate();

  useEffect(() => {
    if (location.pathname !== DeloreanRoutes.HOME) {
      history.replace(DeloreanRoutes.HOME);
    }

    if ('EBWidgets' in window) {
      const eventbrite: any = window['EBWidgets'];
      eventbrite.createWidget({
        widgetType: 'checkout',
        eventId: EventbriteConfig.eventId,
        modal: true,
        modalTriggerElementId: `get-event-tickets-${EventbriteConfig.eventId}`
      });
    }
  }, [])

  return (
    <main className="home-page">
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

      <Papercall />
      <Venue />
      <Sponsors />
    </main>
  );
}

const mapStateToProps = (state: ApplicationState) => ({
  config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Home);