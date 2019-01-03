import './Speakers.scss';

import * as React from 'react';
import { connect } from 'react-redux';

import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../..';
import { getSpeakersInOrder } from '../../../ducks/speaker';
import SpeakerCard from '../../controls/SpeakerCard/SpeakerCard';
import { Speaker } from '../../../models/speaker';
import { DocumentSnapshot } from '@firebase/firestore-types';

type SpeakerPageProps = RouteComponentProps & ReturnType<typeof mapStateToProps>;

const buildSpeakerCard = (speaker: DocumentSnapshot) => {
    return (
        <SpeakerCard key={speaker.id} 
            documentRef={speaker.ref}
            speaker={speaker.data() as Speaker} /> 
    );
};

const SpeakerPage = (props: SpeakerPageProps) => {
    const {speakers} = props;

    return (
        <main className="speaker page-base">
            <div className="container">
                {speakers.map(buildSpeakerCard)}
            </div>
        </main>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    speakers: getSpeakersInOrder(state)
});

export default connect(mapStateToProps)(SpeakerPage);