import './Schedule.scss';

import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Typography } from '@material-ui/core';

type ScheduleProps = RouteComponentProps;
class Schedule extends React.Component<ScheduleProps> {

    render() {
        return (
            <main className="schedule page-base">
                <div className="container">
                    <Typography variant="h1">
                        Coming Soon!
                    </Typography>
                </div>
            </main>
        );
    }

}

export default Schedule;