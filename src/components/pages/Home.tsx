import * as React from 'react';
import { connect } from 'react-redux';

import Map from '../controls/Map';
import Button from '@material-ui/core/Button';

import { ApplicationState } from '../..';
import { getCurrentConfig } from '../../selectors/current';

import Logo from '../../assets/event-logo.svg';
import * as background from '../../assets/intro-background.jpg';
import { RouteComponentProps } from 'react-router';

type MainLayoutProps = ReturnType<typeof mapStateToProps> & RouteComponentProps;

class Home extends React.Component<MainLayoutProps> {

    getTickets = () => {
        this.props.history.push('/buy-tickets');
    }

    render() {
        let { config } = this.props;

        return(
            <main>
                <section className="intro" style={{ backgroundImage: `url(${background})` }}>
                    <div className="container">
                        <Logo className="event-logo mb-4"/>

                        <h1 className="container-thin">
                            A community-run conference offering sessions, hack-a-thons, and codelabs accross many different technologies
                        </h1>

                        <h5 className="mb-2">Feb 01, 2019</h5>

                        <p>{config && config.venue ? config.venue.name : ''}</p>

                        <div className="mt-4">
                            <Button variant="contained" color="secondary" onClick={this.getTickets}>
                                Get Tickets
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="pictures" />

                {
                    config && config.venue ?
                        <section className="venue">
                            <Map theme={null} />
                        </section> : null
                }

                <section className="sponsors">
                    <header />
                    <div />
                </section>
            </main>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Home);