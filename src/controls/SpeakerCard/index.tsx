import React, { FC } from 'react';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { DocumentReference, deleteDoc } from '@firebase/firestore';

import Details from '../../components/dialogs/Details';
import Subtitle from './Subtitle';
import { Card, Typography, Button, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

import { Speaker } from 'models/speaker';
import { editSpeaker } from 'store/speakers/reducer';
import { isEditMode } from 'store/admin/selectors';
import { openDialog } from 'store/dialogs/reducer';

import './index.scss';

type Props = {
  speaker: Speaker;
  documentRef: DocumentReference;
  index: number;
};

const SpeakerCard: FC<Props> = ({
  speaker,
  documentRef,
  index,
}) => {
  const dispatch = useDispatch();
  const isEditing = useSelector(isEditMode);

  // useEffect(() => {
  //   window.setTimeout(() => {
  //     /**
  //      * Push the animation to the back of the event queue to ensure that
  //      * react has finished adding the DOMNode.
  //      */
  //     anime({
  //       targets: ReactDOM.findDOMNode(this),
  //       translateY: [200, 0],
  //       opacity: [0, 1],
  //       delay: 100 * (index + 1),
  //       duration: 750
  //     });
  //   }, 0);
  // }, []);


  const onSpeakerClicked = e => {
    dispatch(
      openDialog({
        views: <Details speaker={speaker} />, 
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

  const buildActionButtons = () => {
    if (isEditing) {
      return (
        <>
          <Tooltip title="Edit" placement="top">
            <Button variant="text" className="action edit" onClick={onEditClicked}>
              <Edit />
            </Button>
          </Tooltip>
          <Tooltip title="Delete" placement="top">
            <Button variant="text" className="action delete" onClick={onDeleteClicked}>
              <Delete />
            </Button>
          </Tooltip>
        </>
      );
    }

    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 200 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
      className="speaker-card"
      onClick={onSpeakerClicked}
    >
      {buildActionButtons()}
      <div className="header">
        <img title="Speaker Avatar" className="portrait-image portrait-avatar" src={speaker.portraitUrl} />
      </div>
      <div className="content">
        <Typography variant="h6">{speaker.name}</Typography>
        <Subtitle company={speaker.company} title={speaker.title} />
      </div>
    </motion.div>
  );
}

export default SpeakerCard;