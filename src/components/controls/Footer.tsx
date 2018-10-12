import * as React from 'react';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../..';
import { connect } from 'react-redux';
import { getCurrentConfig } from '../../selectors/current';

import Code from '../../assets/code.svg';
import Configuration from '../../models/config';
import Facebook from '../../assets/facebook.svg';
import Twitter from '../../assets/twitter.svg';
import Github from '../../assets/github.svg';
import Meetup from '../../assets/meetup.svg';

type FooterProps = ReturnType<typeof mapStateToProps>;

class Footer extends React.Component<FooterProps> {

    buildSocialLinks = (config: Configuration) => {
        let width = 0;

        if (!config) {
            return null;
        }

        for (let key in config.org) {
            if (key !== 'name' && key !== 'email') {
                width += 1;
            }
        }

        return (
            <div className="social">
                <div className="container-thin" style={{ width: (width + 1) * 50 }}>
                    {
                        config.org.facebook ?
                        <a href={`https://facebook.com/${config.org.facebook}`}>
                            <Facebook />
                        </a> : null
                    }
                    {
                        config.org.twitter ?
                        <a href={`https://twitter.com/${config.org.twitter}`}>
                            <Twitter />
                        </a> : null
                    }
                    {
                        config.org.meetup ?
                        <a href={`https://meetup.com/${config.org.meetup}`}>
                            <Meetup />
                        </a> : null
                    }
                    {
                        config.org.github ?
                        <a href={`https://github.com/${config.org.github}`}>
                            <Github />
                        </a> : null
                    }
                </div>
            </div>
        );
    }

    render() {
        const { config } = this.props;

        return (
            <footer className="footer">
                {this.buildSocialLinks(config)}
                <div className="container-wide">
                    <div>
                        <a href="https://github.com/w9jds/DeLorean-v88" className="code-by">
                            <Code />
                            <span>By Jeremy Shore</span>
                        </a>
                        <span className="copyright">
                            © {new Date().getFullYear()} {config ? config.org.name : ''} | All Rights Reserved
                        </span>
                    </div>

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