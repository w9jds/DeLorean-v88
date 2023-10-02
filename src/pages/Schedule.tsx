import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { DocumentSnapshot } from 'firebase/firestore';
import { formatToTimeZone } from 'date-fns-timezone';

import { ApplicationState } from 'models/states';
import { Session } from 'models/session';
import { Speaker } from 'models/speaker';
import { getSessionByStartTime } from 'store/sessions/selectors';
import { getSpeakers } from 'store/speakers/selectors';

import { Typography } from '@mui/material';
import SessionSheet from 'controls/SessionSheet';

import './Schedule.scss';

type ScheduleProps = RouteComponentProps & ReturnType<typeof mapStateToProps>;

class SchedulePage extends React.Component<ScheduleProps> {

  buildTimeSlot = () => {
    const {sessions} = this.props;
    const times = Object.keys(sessions).sort();
    const slots = [];

    for (let time of times) {
      let dateTime = formatToTimeZone(Number(time), 'h:mm A', { timeZone: 'America/Chicago' });

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
        session={data}
      />
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