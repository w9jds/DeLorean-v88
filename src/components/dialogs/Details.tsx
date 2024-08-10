import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import createDOMPurity from 'dompurify';

import { Speaker } from 'models/speaker';
import { Clear } from '@mui/icons-material';

import Socials from '../../controls/SpeakerCard/Socials';
import Subtitle from '../../controls/SpeakerCard/Subtitle';
import { Typography, DialogContent, Divider, Button } from '@mui/material';
import { closeDialog } from 'store/dialogs/reducer';

import './Details.scss';

type Props = {
  speaker: Speaker;
};

const DOMPurify = createDOMPurity(window);

const Details: FC<Props> = ({ speaker }) => {
  const dispatch = useDispatch();
  
  const close = () => {
    dispatch(closeDialog());
  }

  return (
    <DialogContent className="speaker-details">
      <Button className="action close" onClick={close}>
        <Clear />
      </Button>

      <div className="header">
        <img title="Speaker Portrait" className="portrait-image portrait-avatar" src={speaker.portraitUrl} />
      </div>
      <div className="content">
        <Typography variant="h6">{speaker.name}</Typography>
        <Subtitle title={speaker.title} company={speaker.company} />
      </div>

      <Socials speaker={speaker} />

      {speaker?.bio && (
        <>
          <Divider />
          <div className="bio" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(speaker.bio) }} />
        </>
      )}
    </DialogContent>
  );
}

export default Details;
