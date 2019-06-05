import './Home.scss';

// import Logo from '../../assets/event-logo.svg';
import * as logo from '../../assets/event-logo.png';
import * as background from '../../assets/intro-background.jpg';

import * as React from 'react';
import { connect } from 'react-redux';
import { isAfter, format } from 'date-fns';
import { RouteComponentProps } from 'react-router';

import Map from './sections/Map';
import Sponsors from './sections/Sponsors';

import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import RightArrow from '@material-ui/icons/KeyboardArrowRight';
import { DeloreanRoutes } from '../controls/MainLayout';

import { EventbriteConfig, SiteTheme } from '../../config/delorean.config';
import { KotlinDetails } from '../../config/delorean.details';
import { getCurrentConfig } from '../../ducks/current';
import { ApplicationState } from '../../../models/states';

type HomeProps = ReturnType<typeof mapStateToProps> & RouteComponentProps;

class Home extends React.Component<HomeProps> {

    componentDidMount() {
        const {location} = this.props;

        if (location.pathname !== DeloreanRoutes.HOME) {
            this.props.history.replace(DeloreanRoutes.HOME);
        }

        if ('EBWidgets' in window) {
            window.EBWidgets.createWidget({
                widgetType: 'checkout',
                eventId: EventbriteConfig.eventId,
                modal: true,
                modalTriggerElementId: `get-event-tickets-${EventbriteConfig.eventId}`
            });
        }
    }

    openCalltoAction = () => window.open(this.props.config.event.papercall.url);

    buildVenueSection = () => {
        const { config } = this.props;

        if (!config || !config.venue) {
            return null;
        }

        return (
            <section className="venue">
                <Map />
            </section>
        );
    }

    buildPapercallSection = () => {
        const { config } = this.props;

        if (!config || !config.event || !config.event.papercall) {
            return null;
        }

        if (isAfter(new Date(), config.event.papercall.closing.toDate())) {
            return null;
        }

        return (
            <section className="call-to-action" style={SiteTheme.CallToAction}>
                <div className="container">
                    <h1 className="container-thin">
                        {`Interested in speaking at ${KotlinDetails.name} ${KotlinDetails.location}?`}
                    </h1>

                    <p>{`Consider submitting your talk by ${format(config.event.papercall.closing.toDate(), 'MMMM d, YYYY', { awareOfUnicodeTokens: true })}`}</p>

                    <div className="action">
                        <Fab onClick={this.openCalltoAction}>
                            <RightArrow />
                        </Fab>
                    </div>
                </div>
            </section>
        );
    }

    render() {
        let { config } = this.props;

        return(
            <main>
                <section className="intro" style={{ backgroundImage: `url(${background})` }}>
                    <div className="event">
                        <div className="description">
                            <img className="event-logo" src={logo} />
                            <h2>{KotlinDetails.description}</h2>
                        </div>

                        <div className="details">
                            <span>Venue: {config && config.venue ? config.venue.name : ''}</span>
                            <span>Aug 23, 2019</span>
                        </div>

                        <div className="mt-4 ticket-button">
                            <Button id={`get-event-tickets-${EventbriteConfig.eventId}`} variant="contained" color="secondary">
                                Get Tickets
                            </Button>
                        </div>
                    </div>
                </section>

                {this.buildPapercallSection()}
                {this.buildVenueSection()}

                <section className="sponsors">
                    <Sponsors />
                </section>
            </main>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Home);