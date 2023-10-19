import React from 'react';
import { connect } from 'react-redux';
import { DocumentSnapshot } from 'firebase/firestore';
import { formatToTimeZone } from 'date-fns-timezone';

import SessionSheet from 'controls/SessionSheet';
import { ApplicationState } from 'models/states';
import { Session } from 'models/session';
import { Speaker } from 'models/speaker';
import { getSessionByStartTime, getUnscheduledSessions } from 'store/sessions/selectors';
import { getEventTimezone } from 'store/current/selectors';
import { getSpeakers } from 'store/speakers/selectors';

import { Typography } from '@mui/material';

import './Schedule.scss';

type ScheduleProps = ReturnType<typeof mapStateToProps>;

class SchedulePage extends React.Component<ScheduleProps> {

  buildTimeSlot = () => {
    const { scheduled, unscheduled } = this.props;
    const times = Object.keys(scheduled).sort();
    const slots = [];

    if (unscheduled?.length > 0) {
      slots.push(
        <div key="unscheduled" className="timeslot">
          <div className="timeslot-header">
            <Typography variant="h3">To Be Announced</Typography>
          </div>

          {unscheduled.map(this.buildSessionSheet)}
        </div>
      );
    }

    for (let time of times) {
      let dateTime = formatToTimeZone(Number(time), 'h:mm A', { timeZone: this.props.timezone });

      slots.push(
        <div key={time} className="timeslot">
          <div className="timeslot-header">
            <Typography variant="h3">{dateTime}</Typography>
          </div>

          {scheduled[time].map(this.buildSessionSheet)}
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
  timezone: getEventTimezone(state),
  scheduled: getSessionByStartTime(state),
  unscheduled: getUnscheduledSessions(state),
  speakers: getSpeakers(state)
});

export default connect(mapStateToProps)(SchedulePage);