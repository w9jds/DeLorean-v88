import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, Transition } from 'react-transition-group';
import { DocumentSnapshot } from '@firebase/firestore';

import SpeakerCard from 'controls/SpeakerCard';

import { Speaker } from 'models/speaker';
import { ApplicationState } from 'models/states';
import { getSpeakersInOrder } from 'store/speakers/selectors';

import './Speakers.scss';

type SpeakerPageProps = ReturnType<typeof mapStateToProps>;

const buildSpeakerCard = (speaker: DocumentSnapshot, index: number) => {
  return (
    <Transition key={speaker.id} timeout={300} mountOnEnter unmountOnExit>
      <SpeakerCard key={speaker.id}
          index={index} documentRef={speaker.ref}
          speaker={speaker.data() as Speaker} />
    </Transition>
  );
};

const SpeakerPage = (props: SpeakerPageProps) => {
  const {speakers} = props;

  return (
    <main className="speaker page-base">
      <TransitionGroup component="div" className="container">
        {speakers.map(buildSpeakerCard)}
      </TransitionGroup>
    </main>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  speakers: getSpeakersInOrder(state)
});

export default connect(mapStateToProps)(SpeakerPage);