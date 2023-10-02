import React from 'react';
import Logo from 'assets/event-logo.svg';

import './Conduct.scss';

export default class CodeOfConduct extends React.PureComponent {

  private conduct;

  constructor(props: any) {
    super(props);
    this.conduct = require('assets/code_of_conduct.md');
  }

  render() {
    return(
      <main className="conduct-page">
        <p className="event-logo">
          <Logo />
        </p>

        <div className="container code-of-conduct" dangerouslySetInnerHTML={{ __html: this.conduct }} />
      </main>
    );
  }
}