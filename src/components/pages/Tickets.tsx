import * as React from 'react';
import { EventbriteConfig, DevfestDetails } from '../../../config/delorean.config';

import Typography from '@material-ui/core/Typography';
import { StyleRules, withStyles, WithStyles } from '@material-ui/core/styles';

const stylesheet: StyleRules = {
    flex: {
        flex: 1,
        textAlign: 'center'
    }
};

type TicketsProps = WithStyles<typeof stylesheet>;

class Tickets extends React.Component<TicketsProps> {

    constructor(props: TicketsProps) {
        super(props);

        window['EBWidgets'].createWidget({
            widgetType: 'checkout',
            eventId: EventbriteConfig.eventId,
            iframeContainerId: `devfest-eventbright-checkout-${EventbriteConfig.eventId}`,
            // iframeContainerHeight: 280
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <main id="tickets">
                <div className="container pt-8 pb-8 pl-3 pr-3">
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        {`Register for ${DevfestDetails.location} ${DevfestDetails.name} ${DevfestDetails.year}`}
                    </Typography>
                    <div id={`devfest-eventbright-checkout-${EventbriteConfig.eventId}`}></div>
                </div>
            </main>
        )
    }

}

export default withStyles(stylesheet)(Tickets);