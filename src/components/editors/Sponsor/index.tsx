import React, { FC, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import classnames from 'classnames';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UploadTaskSnapshot, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { Button, TextField, DialogTitle, DialogContent, DialogActions, FormControl } from '@mui/material';

import { ApplicationState } from 'models/states';
import { getDatabase, getFirebaseStorage } from 'store/current/selectors';
import { closeDialogWindow } from 'store/dialogs/actions';

import './index.scss';

// const stylesheet: StyleRulesCallback = theme => ({
//     formControl: {
//         margin: theme.spacing.unit,
//         width: '75%',
//         minWidth: '120px'
//     },
//     sponsorDetails: {
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         marginTop: 'auto',
//         marginBottom: 'auto'
//     }
// });

type SponsorDialogProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
type Avatar = {
  metadata: File;
  preview: string;
  contents: ArrayBuffer;
};

const SponsorDialog: FC<SponsorDialogProps> = ({
  db,
  storage,

  closeDialogWindow
}) => {
  const [fields, setFields] = useState({ name: '', site: '' });
  const [file, setFile] = useState<Avatar>();

  const onSettingChange = (e, name: string) => setFields({
    ...fields,
    [name]: e.target.value
  });

  const onSaveSponsor = async () => {
    const sponsor = await getDoc(doc(db, `/sponsors/${fields.name}`));

    if (!sponsor.exists && fields.name && fields.site && file) {
      uploadBytes(
        ref(storage, `sponsors/${fields.name}`),
        file.contents, { contentType: file.metadata.type}
      ).then(onImageStored);
    }
  }

  const onImageStored = async (task: UploadTaskSnapshot) => {
    await setDoc(doc(db, `/sponsors/${fields.name}`), {
      name: fields.name,
      siteUri: fields.site,
      logoUri: await getDownloadURL(task.ref)
    });

    closeDialogWindow();
  }

  const onFileDrop = files => {
    if (files.length > 0 && files[0].type.startsWith('image')) {
      const reader = new FileReader();

      reader.onload = () => setFile({
        metadata: files[0],
        preview: URL.createObjectURL(files[0]),
        contents: reader.result as ArrayBuffer
      });

      reader.onabort = () => console.error('file reading was aborted');
      reader.onerror = () => console.error('file reading has failed');

      reader.readAsArrayBuffer(files[0]);
    }
  }

  const buildDropZone = () => {
    if (!file) {
      return (
        <Dropzone accept="image/*" onDrop={onFileDrop}>
          {dropZoneRender}
        </Dropzone>
      );
    }

    return (
      <div className="drag-drop-preview">
        <div>
          <img src={file.preview} />
        </div>
      </div>
    );
  }

  const dropZoneRender = ({ getRootProps, getInputProps, isDragActive }) => (
    <div {...getRootProps()} className={classnames('dropzone', 'drag-drop-logo', {'dropzone--isActive': isDragActive})}>
      <input {...getInputProps()} />
      <p>Drop sponsor logo</p>
    </div>
  );

  return (
    <Fragment>
      <DialogTitle id="responsive-dialog-title">{'Create New Sponsor'}</DialogTitle>
      <DialogContent>
        <div className="create-sponsor-form">
          {buildDropZone()}

          <div className="sponsor-details">
            <TextField label="Name" value={fields.name} onChange={e => onSettingChange(e, 'name')}/>
            <TextField label="Site" value={fields.site} onChange={e => onSettingChange(e, 'site')}/>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialogWindow}>
          Cancel
        </Button>
        <Button onClick={onSaveSponsor} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Fragment>
  );
}

const mapStateToProps = (state: ApplicationState) => ({
  db: getDatabase(state),
  storage: getFirebaseStorage(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  closeDialogWindow
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SponsorDialog);