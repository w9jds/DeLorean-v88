import React, { FC } from 'react';

import Sponsor from 'models/sponsor';


type Props = {
  details: Sponsor;
}

const SponsorTile: FC<Props> = ({ details }) => {
  const openTile = () => {
    window.open(details.siteUri);
  }

  return (
    <div key={details.name} className="sponsor-tile" onClick={openTile}>
      <img src={details.logoUri} />
    </div>
  );
}

export default SponsorTile;