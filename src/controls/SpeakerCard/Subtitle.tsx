import React, { FC, useMemo } from 'react';
import { Typography } from '@mui/material';

type Props = {
  title: string;
  company: string;
}

const SpeakerSubtitle: FC<Props> = ({ company, title }) => {
  const subtitle = useMemo(() => {
    if (company && title) {
      return `${title} @ ${company}`;
    } else if (title) {
      return `${title}`;
    } else if (company) {
      return `${company}`;
    }
  }, [company, title])

  if (subtitle) {
    return (
      <Typography variant="subtitle1" >
        {subtitle}
      </Typography>
    );
  }

  return null;
}

export default SpeakerSubtitle;