import * as React from 'react';
import { Link } from 'react-router-dom';

class Footer extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <footer className="footer">
                <div className="container-wide">
                    <ul className="nav flex-auto">
                        <li>
                            <Link to="/code-of-conduct">Code of Conduct</Link>
                        </li>
                        <li>
                            <a href="mailto:contact@devfest.io">contact@devfest.io</a>
                        </li>
                    </ul>
                </div>
            </footer>
        )
    }

}

export default Footer;