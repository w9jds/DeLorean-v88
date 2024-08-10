import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useLocation, useNavigation } from 'react-router-dom';
import classnames from 'classnames';

import { EventbriteConfig } from 'config/delorean.config';
import { Button, ButtonProps, Collapse, Fab, Grow, Typography, Zoom } from '@mui/material';
import { LocalActivity } from '@mui/icons-material';

import './TicketsButton.scss';

const TicketButton = () => {
  const location = useLocation();
  const [scope, animate] = useAnimate();

  const [isMobile, setMobile] = useState(false);
  const [isFooterVisible, setFooterVisibility] = useState(false);
  const [isTicketsVisible, setTicketsVisibility] = useState(true);

  const prev = useRef({
    isFooterVisible: false,
    isTicketsVisible: true
  });

  useEffect(() => {
    window.addEventListener('scroll', onTransitionEvent);
    window.addEventListener('resize', onResizeEvent);

    if (window.innerWidth <= 550) {
      setMobile(true);
    }

    return () => {
      window.removeEventListener('scroll', onTransitionEvent);
      window.removeEventListener('resize', onResizeEvent);
    }
  }, [])

  useEffect(() => {
    onTransitionEvent();
  }, [location]);

  useEffect(() => {
    if (scope.current && isMobile && prev.current.isFooterVisible !== isFooterVisible) {
      if (isFooterVisible) {
        const footer = document.querySelector('.footer.container-wide');
  
        animate(scope.current, {
          x: '50%',
          translateX: 'calc(-50vw + 24px)',
          translateY: -footer.getBoundingClientRect().height,
        }, { 
          duration: 0.25 
        });
      } else {
        animate(scope.current, {
          x: 0,
          translateX: 0,
          translateY: 0,
        }, { 
          duration: 0.25
        })
      }
    }

    prev.current = { isFooterVisible, isTicketsVisible };
  }, [isMobile, isFooterVisible, isTicketsVisible]);

  const isElementInViewport = (el: Element) => {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + (rect.height / 2) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  const onResizeEvent = () => {
    if (window.innerWidth <= 550) {
      setMobile(true);
    } else {
      setMobile(false);
    }

    onTransitionEvent();
  }

  const onTransitionEvent = () => {
    const intro = document.querySelector(`.intro #get-event-tickets-${EventbriteConfig.eventId}`);
    const footer = document.querySelector('.footer.container-wide');

    let ticketsVisible = intro ? true : false;
    let footerVisible = false;

    if (intro) {
      ticketsVisible = isElementInViewport(intro);
    }

    if (footer) {
      footerVisible = isElementInViewport(footer);
    }

    setFooterVisibility(footerVisible);
    setTicketsVisibility(ticketsVisible);
  }

  if (isMobile) {
    return (
      <motion.div ref={scope} className="get-ticket-mobile">
        <Zoom in={!isTicketsVisible} unmountOnExit>
          <Fab id={`get-event-tickets-${EventbriteConfig.eventId}`} size="large" color="secondary" variant="extended">
            <Collapse in={isFooterVisible} orientation="horizontal" collapsedSize={24} exit={true}>
              <div className="contents">
                <LocalActivity />
                <Grow in={isFooterVisible}>
                  <Typography variant="button" display="block" noWrap>
                    Get Tickets
                  </Typography>
                </Grow>
              </div>
            </Collapse>
          </Fab>
        </Zoom>
      </motion.div>
    );
  }

  const classes = classnames('get-tickets-header', {
    'hidden': isTicketsVisible
  });

  const props = {
    id: `get-event-tickets-${EventbriteConfig.eventId}`,
    color: 'secondary',
    variant: 'contained'
  };

  return (
    <div className={classes}>
      <Button {...props as ButtonProps}>
        Get Tickets
      </Button>
    </div>
  );

}

export default TicketButton;