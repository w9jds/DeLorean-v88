import * as React from 'react';
import { ApplicationState } from '../..';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getSponsors } from '../../selectors/current';
import { Card, CardMedia } from '@material-ui/core';

type SponsorsProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class Sponsors extends React.Component<SponsorsProps> {

    constructor(props: SponsorsProps) {
        super(props);
    }

    buildSponsorItems = () => {
        let sponsors = [];

        for (let name in this.props.sponsors) {
            let sponsor = this.props.sponsors[name];

            sponsors.push(
                <li key={name}>
                    <a href={sponsor.siteUri}>
                        <img src={sponsor.logoUri} />
                    </a>
                </li>
            );
        }

        return sponsors;
    }

    render() {
        return(
            <React.Fragment>
                <h2>Sponsors</h2>
                <ul className="logo-list">
                    {this.buildSponsorItems()}
                </ul>
            </React.Fragment>

        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    sponsors: getSponsors(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Sponsors);