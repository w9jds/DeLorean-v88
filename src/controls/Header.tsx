import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import UserMenu from './UserMenu';
import TicketButton from './TicketsButton';
import { DeloreanRoutes } from 'components/MainLayout';
import { EventbriteConfig } from 'config/delorean.config';

import { AppBar, Tabs, Tab } from '@mui/material';

import './Header.scss';

const Header = ({ }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [route, setRoute] = useState(0);

  useEffect(() => {
    switch (location.pathname) {
      case DeloreanRoutes.HOME:
        setRoute(0);
        break;
      case DeloreanRoutes.SPEAKERS:
        setRoute(1);
        break;
      case DeloreanRoutes.SCHEDULE:
        setRoute(2);
        break;
      default:
        setRoute(-1);
        break;
    }
  }, [location]);

  useEffect(() => {
    // if (location.pathname !== DeloreanRoutes.HOME) {
    //   navigate(DeloreanRoutes.HOME);
    // }

    if ('EBWidgets' in window) {
      // tslint:disable-next-line:no-string-literal
      (window['EBWidgets'] as any).createWidget({
        widgetType: 'checkout',
        eventId: EventbriteConfig.eventId,
        modal: true,
        modalTriggerElementId: `get-event-tickets-${EventbriteConfig.eventId}`
      });
    }
  }, []);

  const onNavigationChanged = (event, value) => {
    switch (value) {
      case 0:
        navigate(DeloreanRoutes.HOME);
        break;
      case 1:
        navigate(DeloreanRoutes.SPEAKERS);
        break;
      case 2:
        navigate(DeloreanRoutes.SCHEDULE);
        break;
      default:
        break;
    }
  }

  return (
    <AppBar position="sticky" className="header">
      <div className="inner container">
        <nav className="nav" >
          <Tabs
            value={route}
            onChange={onNavigationChanged}
            classes={{ flexContainer: 'thicc-tab', root: 'thicc-tab' }}>
            <Tab key="home" label="Home" />
            <Tab key="speakers" label="Speakers" />
            <Tab key="schedule" label="Schedule" />
          </Tabs>
        </nav>

        <TicketButton />
        <UserMenu />
      </div>
    </AppBar>
  );
}

export default Header;