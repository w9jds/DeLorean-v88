import * as React from 'react';

import Button from '@material-ui/core/Button';

import Logo from '../../assets/event-logo.svg';
import * as background from '../../assets/intro-background.jpg';

class Home extends React.Component {

    constructor(props) {
        super(props);

    }

    getTickets = () => {
        this.props['history'].push('/buy-tickets')
    }

    render() {
        return(
            <main>
                <section className="intro" style={{ backgroundImage: `url(${background})` }}>
                    <div className="container">
                        <Logo className="event-logo mb-4"/>

                        <h1 className="container-thin">
                            A community-run conference offering sessions, hack-a-thons, and codelabs accross many different technologies
                        </h1>

                        <h5 className="mb-2">Feb 01, 2019</h5>

                        <p>Depaul University | Chicago, IL</p>

                        <div className="mt-4">
                            <Button variant="contained" color="secondary" onClick={this.getTickets}>
                                Get Tickets
                            </Button>               
                        </div>
                    </div>
                </section>
                <section className="pictures">

                </section>
                <section className="venue">

                </section>
                <section className="sponsors">
                    <header>

                    </header>
                    <div>

                    </div>
                </section>
            </main>
        )
    }

}

export default Home;