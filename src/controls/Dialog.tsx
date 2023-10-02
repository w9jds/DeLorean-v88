import React, { FC } from 'react';
import { connect } from 'react-redux';

import { Dialog } from '@mui/material';

import { ApplicationState } from 'models/states';
import { isDialogVisible, getDialogViews, isDialogFullscreen } from 'store/dialogs/selectors';

// const styleSheet: StyleRules = {
//   paper: {
//     minWidth: '50vw',
//     overflow: 'visible'
//   }
// };

type DialogWindowProps = ReturnType<typeof mapStateToProps>;

const UniversalDialog: FC<DialogWindowProps> = ({
  views,
  visible,
  fullscreen,
}) => {

  return (
    // classes={{ paper: classes.paper }}
    <Dialog fullScreen={fullscreen} open={visible}>
      {views ? views : <div/>}
    </Dialog>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  visible: isDialogVisible(state),
  views: getDialogViews(state),
  fullscreen: isDialogFullscreen(state)
});

export default connect(mapStateToProps)(UniversalDialog);
