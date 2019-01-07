import './Sessions.scss';

import * as React from 'react';
import { connect } from 'react-redux';

import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../..';
import { getSessions } from '../../../ducks/session';
import { getSpeakers } from '../../../ducks/speaker';
import { Session } from '../../../models/session';
import SessionSheet from '../../controls/SessionSheet/SessionSheet';
import { Speaker } from '../../../models/speaker';

type SessionPageProps = RouteComponentProps & ReturnType<typeof mapStateToProps>;

const SessionPage = (props: SessionPageProps) => {

    const buildSessionSheet = () => {
        const {speakers, sessions} = props;

        return Object.keys(sessions).map(key => {
            const session = sessions[key].data() as Session;
    
            return (
                <SessionSheet
                    key={key}
                    speakers={session.speakers.map(id => speakers[id].data() as Speaker)}
                    reference={sessions[key].ref}
                    session={session} />
            );
        });
    };

    return (
        <main className="sessions page-base">
            <div className="container" >
                {buildSessionSheet()}
            </div>
        </main>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    sessions: getSessions(state),
    speakers: getSpeakers(state)
});

export default connect(mapStateToProps)(SessionPage);