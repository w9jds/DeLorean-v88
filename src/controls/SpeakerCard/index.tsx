import React, { FC, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { DocumentReference, deleteDoc } from '@firebase/firestore';

import Subtitle from './Subtitle';
import SpeakerDetails from 'components/dialogs/Details';
import { Typography, Button, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

import { Speaker } from 'models/speaker';
import { editSpeaker } from 'store/speakers/reducer';
import { isEditMode } from 'store/admin/selectors';
import { openDialog } from 'store/dialogs/reducer';

import './index.scss';

type Props = {
  index: number;
  speaker: Speaker;
  documentRef: DocumentReference;
};

// const DOMPurify = createDOMPurity(window);

const SpeakerCard: FC<Props> = ({
  speaker,
  documentRef,
  index,
}) => {
  const dispatch = useDispatch();
  const isEditing = useSelector(isEditMode);

  const cardRef = useRef<HTMLDivElement>();

  const onSpeakerClicked = e => {
    dispatch(
      openDialog({
        views: <SpeakerDetails key={speaker.name} speaker={speaker} />,
        fullscreen: false
      })
    );
  }

  const onDeleteClicked = e => {
    e.preventDefault();
    e.stopPropagation();

    deleteDoc(documentRef);
  }

  const onEditClicked = e => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(editSpeaker({ 
      ref: documentRef, 
      speaker 
    }));
  }

  return (
    <motion.div ref={cardRef}
      layout="position"
      className="speaker-card"
      initial={{ opacity: 0, y: 200 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
      onClick={onSpeakerClicked}
    >
      {isEditing && [
        <Tooltip title="Edit" placement="top">
          <Button variant="text" className="action edit" onClick={onEditClicked}>
            <Edit />
          </Button>
        </Tooltip>,
        <Tooltip title="Delete" placement="top">
          <Button variant="text" className="action delete" onClick={onDeleteClicked}>
            <Delete />
          </Button>
        </Tooltip>
      ]} 
      <div className="header">
        <img title="Speaker Avatar" className="portrait-image portrait-avatar" src={speaker.portraitUrl} />
      </div>
      <div className="content">
        <Typography variant="h6">
          {speaker.name}
        </Typography>
        <Subtitle company={speaker.company} title={speaker.title} />
      </div>
    </motion.div>
  );
}

export default SpeakerCard;