import * as React from 'react';
import { ApplicationState } from '../..';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

type SponsorsProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class Sponsors extends React.Component<SponsorsProps> {

    constructor(props: SponsorsProps) {
        super(props);
    }

    buildSponsorItems = () => {
        let sponsors = [];

        return sponsors;
    }

    render() {
        return(
            <ul className="logo-list">
                {this.buildSponsorItems()}
            </ul>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Sponsors);