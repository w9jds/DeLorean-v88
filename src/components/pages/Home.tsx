import * as React from 'react';
import { connect } from 'react-redux';

import Map from '../controls/Map';
import Button from '@material-ui/core/Button';
import RightArrow from '@material-ui/icons/KeyboardArrowRight';
import { EventbriteConfig } from '../../../config/delorean.config';

import { ApplicationState } from '../..';
import { getCurrentConfig } from '../../selectors/current';

import Logo from '../../assets/event-logo.svg';
import * as background from '../../assets/intro-background.jpg';
import { RouteComponentProps } from 'react-router';

import { DevfestDetails } from '../../../config/delorean.config';

type MainLayoutProps = ReturnType<typeof mapStateToProps> & RouteComponentProps;

class Home extends React.Component<MainLayoutProps> {

    constructor(props: MainLayoutProps) {
        super(props);

        window['EBWidgets'].createWidget({
            widgetType: 'checkout',
            eventId: EventbriteConfig.eventId,
            modal: true,
            modalTriggerElementId: `get-event-tickets-${EventbriteConfig.eventId}`
        });
    }

    openCalltoAction = () => window.open(this.props.config.papercall.url);

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
                            <Button id={`get-event-tickets-${EventbriteConfig.eventId}`} variant="contained" color="secondary">
                                Get Tickets
                            </Button>
                        </div>
                    </div>
                </section>
                
                {
                    config && config.papercall ?
                        <section className="call-to-action">
                            <div className="container">
                                <h1 className="container-thin">
                                    {`Interested in speaking at ${DevfestDetails.location} ${DevfestDetails.name}?`}
                                </h1>

                                <p>Consider submitting your talk by December 1st, 2018</p>

                                <div className="action">
                                    <Button variant="fab" onClick={this.openCalltoAction}>
                                        <RightArrow />
                                    </Button>
                                </div>
                            </div>
                        </section> : null
                }

                {
                    config && config.venue ?
                        <section className="venue">
                            <Map theme={null} />
                        </section> : null
                }

            </main>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Home);