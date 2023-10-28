import anime from 'animejs';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

import { EventbriteConfig } from 'config/delorean.config';
import { Button, ButtonProps, Fab, FabProps } from '@mui/material';
import { LocalActivity } from '@mui/icons-material';


const TicketButton = () => {
  const mobileAnimation = useRef<any>();

  const [isMobile, setMobile] = useState(false);
  const [isFooterVisible, setFooterVisibility] = useState(false);
  const [isTicketsVisible, setTicketsVisibility] = useState(true);
  const prev = useRef({
    isFooterVisible: false,
    isTicketsVisible: true
  });

  useEffect(() => {
    window.addEventListener('scroll', onScrollEvent);
    window.addEventListener('resize', onResizeEvent);

    if (window.innerWidth <= 550) {
      setMobile(true);
    }

    return () => {
      window.removeEventListener('scroll', onScrollEvent);
      window.removeEventListener('resize', onResizeEvent);
    }
  }, [])

  const onResizeEvent = () => {
    if (window.innerWidth <= 550) {
      setMobile(true);
    }
  }

  useEffect(() => {
    if (isMobile) {
      const animationBase = {
        targets: '.get-ticket-mobile',
        duration: 725
      };

      if (prev.current.isTicketsVisible !== isTicketsVisible) {
        if (isTicketsVisible === false) {
          mobileAnimation.current = anime({
            targets: '.get-ticket-mobile',
            duration: 725,
            scale: [0, 1]
          });
        }

        if (mobileAnimation.current && isTicketsVisible === true) {
          mobileAnimation.current.reverse();
          mobileAnimation.current.play();
        }
      }

      if (!isTicketsVisible && prev.current.isFooterVisible !== isFooterVisible) {
        if (isFooterVisible === true) {
          expandTickets();
        }
        if (isFooterVisible === false) {
          anime({
            ...animationBase,
            translateY: 0,
            translateX: 0
          });
        }
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

  const onScrollEvent = () => {
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

  const expandTickets = () => {
    const targets = document.querySelector('.get-ticket-mobile');
    const footer = document.querySelector('.footer.container-wide');

    const targetBounds = targets.getBoundingClientRect();
    const footerHeight = footer.getBoundingClientRect().height;

    anime({
      targets: targets,
      translateY: [0, -(footerHeight - 10)],
      translateX: () => {
        let left = (window.innerWidth / 2) - (targetBounds.width / 2);
        return [0, left - targetBounds.left];
      },
      duration: 725
    });
  }

  if (isMobile) {
    const classes = classnames('get-ticket-mobile', {
      'extended': isFooterVisible && window.innerWidth <= 550
    });

    const props = {
      id: `get-header-event-tickets-${EventbriteConfig.eventId}`,
      color: 'secondary',
      variant: isFooterVisible ? 'extended' : null,
      href: 'https://devfestkc23.eventbrite.com/?aff=dotcom'
    };

    return (
      <div className={classes}>
        <Fab {...props as FabProps}>
          <LocalActivity />
          {isFooterVisible ? 'Get Tickets' : null}
        </Fab>
      </div>
    );
  }

  const classes = classnames('get-tickets-header', {
    'hidden': isTicketsVisible
  });

  const props = {
    id: `get-header-event-tickets-${EventbriteConfig.eventId}`,
    color: 'secondary',
    variant: 'contained',
    href: 'https://devfestkc23.eventbrite.com/?aff=dotcom'
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