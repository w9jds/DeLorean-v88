import './Sessions.scss';

import * as React from 'react';
import { connect } from 'react-redux';

import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../..';

type SessionPageProps = RouteComponentProps & ReturnType<typeof mapStateToProps>;

const SessionPage = (props: SessionPageProps) => {

    return (
        <main className="sessions page-base">
            <div className="container" />
        </main>
    );
};

const mapStateToProps = (state: ApplicationState) => ({ });

export default connect(mapStateToProps)(SessionPage);