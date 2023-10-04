import React, { useEffect } from 'react';
import Logo from 'assets/event-logo.svg';

import './Conduct.scss';

const CodeOfConduct = () => {
  const conduct = require('assets/code_of_conduct.md').default;

  return (
    <main className="conduct-page">
      <p className="event-logo">
        <Logo />
      </p>

      <div className="container code-of-conduct" dangerouslySetInnerHTML={{ __html: conduct }} />
    </main>
  );
}

export default CodeOfConduct;