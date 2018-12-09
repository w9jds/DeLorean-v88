import * as React from 'react';
import { connect } from 'react-redux';

import Fab from '@material-ui/core/Fab';
import Map from '../../sections/Map/Map';
import Button from '@material-ui/core/Button';
import RightArrow from '@material-ui/icons/KeyboardArrowRight';

import { EventbriteConfig } from '../../../config/delorean.config';
import { ApplicationState } from '../../..';

import Logo from '../../../assets/event-logo.svg';
import * as background from '../../../assets/intro-background.jpg';
import { RouteComponentProps } from 'react-router';

import { isAfter, format } from 'date-fns';

import { DevfestDetails, SiteTheme } from '../../../config/delorean.config';
import Sponsors from '../../sections/Sponsors/Sponsors';
import { getCurrentConfig } from '../../../ducks/current';

type HomeProps = ReturnType<typeof mapStateToProps> & RouteComponentProps;

class Home extends React.Component<HomeProps> {

    componentDidMount() {

        // tslint:disable-next-line:no-string-literal
        window['EBWidgets'].createWidget({
            widgetType: 'checkout',
            eventId: EventbriteConfig.eventId,
            modal: true,
            modalTriggerElementId: `get-event-tickets-${EventbriteConfig.eventId}`
        });

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
                        {`Interested in speaking at ${DevfestDetails.location} ${DevfestDetails.name}?`}
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
                    <div className="container">
                        <Logo className="event-logo mb-4"/>

                        <h1 className="container-thin">
                            {DevfestDetails.description}
                        </h1>

                        <h3>Feb 01, 2019</h3>
                        <h3>{config && config.venue ? config.venue.name : ''}</h3>

                        <div className="mt-4">
                            <Button id={`get-event-tickets-${EventbriteConfig.eventId}`} variant="contained" color="secondary">
                                Get Tickets
                            </Button>
                        </div>
                    </div>
                </section>

                {this.buildPapercallSection()}
                {this.buildVenueSection()}

                <section className="sponsors">
                    <header style={SiteTheme.SponsorHeader}>
                        <div className="container">
                            <h1>Sponsors and Community Partners</h1>
                        </div>
                    </header>

                    <div className="organizations">
                        <div className="action container-thin">
                            <span>{`Meet the organizations that make ${DevfestDetails.location} ${DevfestDetails.name} possible. If you’d like to learn more about sponsorships, read our `}</span>
                            <a href="https://docs.google.com/document/d/15Bj6Cw9wZ6a128YijDlbfL8LwpuZ-mKhMgjg1DHrp5w/edit?usp=sharing">Sponsor Prospectus</a>
                            <span> or </span>
                            <a href={config && config.org ? `mailto:${config.org.email}` : ''}>email us</a>
                        </div>

                        <div className="container" style={{ margin: '16px auto' }}>
                            <Sponsors />
                        </div>
                    </div>
                </section>
            </main>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Home);