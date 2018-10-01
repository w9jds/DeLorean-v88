import * as React from 'react';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../..';
import { connect } from 'react-redux';
import { getCurrentConfig } from '../../selectors/current';

import Code from '../../assets/code.svg';

type FooterProps = ReturnType<typeof mapStateToProps>;

class Footer extends React.Component<FooterProps> {

    render() {
        return (
            <footer className="footer">
                <div className="container-wide">
                    <a href="https://github.com/w9jds/DeLorean-v88">
                        <Code />
                        <span>By w9jds</span>
                    </a>

                    <ul className="nav flex-auto">
                        <li>
                            <Link to="/code-of-conduct">Code of Conduct</Link>
                        </li>

                    </ul>
                </div>
            </footer>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Footer);