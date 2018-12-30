import './Speakers.scss';

import * as React from 'react';
import { connect } from 'react-redux';

import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../..';
import { getSpeakers } from '../../../ducks/speaker';
import SpeakerCard from '../../controls/SpeakerCard/SpeakerCard';
import { Speaker } from '../../../models/speaker';

type SpeakerPageProps = RouteComponentProps & ReturnType<typeof mapStateToProps>;

class SpeakerPage extends React.Component<SpeakerPageProps> {

    buildSpeakerCards = () => {
        const { speakers } = this.props;
        let cards = [];

        for (let key in speakers) {
            cards.push(
                <SpeakerCard key={key} 
                    documentRef={speakers[key].ref}
                    speaker={speakers[key].data() as Speaker} />
            );
        }

        return cards;
    }

    render() {
        return (
            <main className="speaker page-base">
                <div className="container">
                    {this.buildSpeakerCards()}
                </div>
            </main>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    speakers: getSpeakers(state)
});

export default connect(mapStateToProps)(SpeakerPage);