import './Footer.scss';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Code from '../../assets/code.svg';
import Divider from '@material-ui/core/Divider';
import { getCurrentConfig } from '../../ducks/current';
import { ApplicationState } from '../../../models/states';

type FooterProps = ReturnType<typeof mapStateToProps>;

class Footer extends React.Component<FooterProps> {

    render() {
        const { config } = this.props;

        return (
            <footer className="footer container-wide">

                <div className="sources">
                    <div className="sources-left">
                        <a href="https://github.com/w9jds/DeLorean-v88" className="code-by">
                            <Code />
                            <span>By Jeremy Shore</span>
                        </a>
                        <span className="copyright">
                            © {new Date().getFullYear()} {config ? config.org.name : ''} | All Rights Reserved
                        </span>
                    </div>

                    <div className="sources-right">
                        <a href={config && config.org ? `mailto:${config.org.email}` : ''}>Contact Us</a>
                        <Divider className="link-divider" />
                        <Link to="/code-of-conduct">Code of Conduct</Link>
                    </div>
                </div>

            </footer>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Footer);