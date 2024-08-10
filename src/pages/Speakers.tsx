import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DocumentSnapshot } from '@firebase/firestore';

import SpeakerCard from 'controls/SpeakerCard';

import { Speaker } from 'models/speaker';
import { getSpeakersInOrder } from 'store/speakers/selectors';

import './Speakers.scss';

const SpeakerPage: FC = () => {
  const speakers = useSelector(getSpeakersInOrder);

  const cards = useMemo(() => 
    speakers.map((speaker: DocumentSnapshot, index: number) => {
      return (
        <SpeakerCard key={speaker.id}
            index={index} documentRef={speaker.ref}
            speaker={speaker.data() as Speaker} />
      );
    }), 
    [speakers]
  );

  return (
    <main className="speaker page-base">
      <div className="container">
        {cards}
      </div>
    </main>
  );
};

export default SpeakerPage;