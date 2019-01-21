import './Schedule.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { getSessionByStartTime } from '../../../ducks/session';

import { ApplicationState } from '../../..';
import { RouteComponentProps } from 'react-router';
import { Typography } from '@material-ui/core';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { Session } from '../../../models/session';
import { format } from 'date-fns';
import SessionSheet from '../../controls/SessionSheet/SessionSheet';
import { Speaker } from '../../../models/speaker';
import { getSpeakers } from '../../../ducks/speaker';

type ScheduleProps = RouteComponentProps & ReturnType<typeof mapStateToProps>;

class SchedulePage extends React.Component<ScheduleProps> {

    buildTimeSlot = () => {
        const {sessions} = this.props;
        const times = Object.keys(sessions).sort();
        const slots = [];

        for (let time of times) {
            let dateTime = format(Number(time), 'p');

            slots.push(
                <div key={time} className="timeslot">
                    <div className="timeslot-header">
                        <Typography variant="h3">{dateTime}</Typography>
                    </div>
                    
                    {sessions[time].map(this.buildSessionSheet)}
                </div>
            );
        }

        return slots;
    }

    buildSessionSheet = (session: DocumentSnapshot) => {
        const { speakers } = this.props;
        const data = session.data() as Session;

        return (
            <SessionSheet
                key={session.id}
                speakers={data.speakers.map(id => speakers[id].data() as Speaker)}
                reference={session.ref}
                session={data} />
        );
    }

    render() {
        return (
            <main className="schedule page-base">
                <div className="container">
                    {this.buildTimeSlot()}
                </div>
            </main>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    sessions: getSessionByStartTime(state),
    speakers: getSpeakers(state)
});

export default connect(mapStateToProps)(SchedulePage);
