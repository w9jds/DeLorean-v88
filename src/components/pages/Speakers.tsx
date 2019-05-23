import './Speakers.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { TransitionGroup, Transition } from 'react-transition-group';

import SpeakerCard from '../controls/SpeakerCard';

import { Speaker } from '../../../models/speaker';
import { ApplicationState } from '../../../models/states';
import { getSpeakersInOrder } from '../../ducks/speaker';

type SpeakerPageProps = RouteComponentProps & ReturnType<typeof mapStateToProps>;

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