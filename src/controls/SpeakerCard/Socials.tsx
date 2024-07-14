import React, { FC, useMemo } from 'react';

import Github from 'assets/github.svg';
import Medium from 'assets/medium.svg';
import Twitter from 'assets/twitter.svg';
import Facebook from 'assets/facebook.svg';
import Linkedin from 'assets/linkedin.svg';
import { Link } from '@mui/icons-material';
import { Divider } from '@mui/material';

import { Speaker } from 'models/speaker';

const socials = ['github', 'medium', 'twitter', 'linkedin', 'facebook', 'blog'] as const;
type SocialType = typeof socials[number];

type Props = {
  speaker: Speaker;
}

const Socials: FC<Props> = ({ speaker }) => {

  const onSocialClicked = (type: SocialType, baseUri: string) => e => {
    if (type === 'blog') {
      window.open(speaker[type]);
    } else if (type === 'medium' && !speaker[type].startsWith('@')) {
      window.open([baseUri, speaker[type]].join('/@'));
    } else {
      window.open([baseUri, speaker[type]].join('/'));
    }
  }

  const getSocialIcon = (type: SocialType) => {
    const props = { key: type, className: type };

    switch (type) {
      case 'github':
        return <Github {...props} onClick={onSocialClicked(type, 'https://github.com')} />;
      case 'medium':
        return <Medium {...props} onClick={onSocialClicked(type, 'https://medium.com')} />;
      case 'twitter':
        return <Twitter {...props} onClick={onSocialClicked(type, 'https://twitter.com')} />;
      case 'linkedin':
        return <Linkedin {...props} onClick={onSocialClicked(type, 'https://linkedin.com/in')} />;
      case 'facebook':
        return <Facebook {...props} onClick={onSocialClicked(type, 'https://facebook.com')}/>;
      case 'blog':
        return <Link {...props} onClick={onSocialClicked(type, 'https://facebook.com')}/>;
      default:
        return null;
    }
  }

  const buttons = useMemo(() => {
    const items = [];

    for (let type of socials) {
      let username = speaker[type];

      if (username) {
        items.push(getSocialIcon(type));
      }
    }

    return items;
  }, [speaker]);

  return buttons?.length && (
    <>
      <Divider />
      <div className="social">
        {buttons}
      </div>
    </>
  );
}

export default Socials;