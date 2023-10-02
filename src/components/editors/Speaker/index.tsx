import React, { FC, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { DocumentSnapshot, addDoc, collection, updateDoc } from 'firebase/firestore';
import { UploadTaskSnapshot, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { Dialog, AppBar, Toolbar, Button, Slide, Typography, IconButton, DialogContent, FormControl, TextField } from '@mui/material';
import { Close, Face } from '@mui/icons-material';

import tinymce from 'tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/models/dom';
import 'tinymce/skins/ui/oxide-dark/skin.css';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';

import { ApplicationState } from 'models/states';
import { SpeakerEditorState, Speaker } from 'models/speaker';
import { getDatabase, getFirebaseStorage } from 'store/current/selectors';
import { closeConfigDialog } from 'store/config/actions';
import { getEditorState } from 'store/speakers/selectors';

import { getIsSpeakerEditorOpen } from 'store/admin/selectors';
import { setSpeakerEditorOpen } from 'store/admin/actions';

import './index.scss';

const Transition = (props) => <Slide direction="up" {...props} />;

type EditableTypes = 'medium' | 'name' | 'title' | 'company' | 'twitter' | 'github' | 'facebook' | 'linkedin' | 'blog';
type SpeakerEditorProps = SpeakerEditorAttrs & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
type SpeakerEditorAttrs = {
  speaker?: DocumentSnapshot;
};

enum ErrorTypes {
  NAME = 'name',
  PORTRAIT = 'portrait',
};

type Avatar = {
  metadata?: File;
  contents?: ArrayBuffer;
  preview: string;
}

const SpeakerEditor: FC<SpeakerEditorProps> = ({
  db,
  isOpen,
  storage,
  initState,

  closeConfigDialog,
  setSpeakerEditorOpen
}) => {

  const prevOpen = useRef(false);
  const [file, setFile] = useState<Avatar>();
  const [errors, setErrors] = useState<string[]>([]);
  const [fields, setFields] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!prevOpen.current && isOpen) {
      setTimeout(initTinyMce, 0);

      setFile(initState?.file);
      setFields(initState);
    }

    if (prevOpen.current && !isOpen) {
      tinymce.remove('textarea.bio-editor');
    }

    prevOpen.current = isOpen;
  }, [isOpen])

  const initTinyMce = () => {
    tinymce.init({
      selector: 'textarea.bio-editor',
      plugins: [ 'autolink', 'lists', 'advlist' ],
      resize: false,
      menubar: false,
      statusbar: false,
      extended_valid_elements : 'span[!class]',
      font_family_formats: 'Roboto',
      invalid_styles: 'color font-size font-family background-color',
      toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | outdent indent'
    });

    tinymce.activeEditor.setContent(initState.bio);
  }

  const closeSpeakerEditor = () => setSpeakerEditorOpen(false);

  const buildFieldInput = (label: String, id: EditableTypes) => {
    return (
      <TextField
        label={label}
        error={errors.indexOf(id) >= 0}
        value={fields[id]}
        onChange={onValueChanged(id)} />
    );
  }

  const onValueChanged = (name: EditableTypes) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFields({...fields, [name]: e.target.value } as Pick<SpeakerEditorState, EditableTypes>)
  }

  const dropZoneRender = ({ getRootProps, getInputProps, isDragActive }) => {
    const style = classnames('dropzone', 'editor-portrait', {
      'dropzone--isActive': isDragActive,
      'portrait-error': errors.indexOf(ErrorTypes.PORTRAIT) > -1
    });

    return (
      <div {...getRootProps()} className={style}>
        <input {...getInputProps()} />
        {file?.preview ? <img src={file.preview} className="portrait-image" /> : <Face />}
      </div>
    );
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

  const isSpeakerValid = () => {
    let errors = [];

    debugger;
    if (!fields?.name) {
      errors.push(ErrorTypes.NAME);
    }

    if (!file) {
      errors.push(ErrorTypes.PORTRAIT);
    }

    if (errors.length > 0) {
      setErrors(errors);
    }

    return errors.length == 0;
  }

  const getChanges = () => ({
    name: fields.name.trim(),
    title: fields.title ? fields.title.trim() : null,
    company: fields.company ? fields.company.trim() : null,
    twitter: fields.twitter ? fields.twitter.trim() : null,
    github: fields.github ? fields.github.trim() : null,
    facebook: fields.facebook ? fields.facebook.trim() : null,
    medium: fields.medium ? fields.medium.trim() : null,
    linkedin: fields.linkedin ? fields.linkedin.trim() : null,
    // featured: this.state.featured,
    featured: false,
    blog: fields.blog ? fields.blog.trim() : null,
    bio: tinymce.activeEditor.getContent()
  })


  const onSaveClicked = () => {
    if (isSpeakerValid()) {
      if ((!initState || !initState.ref) && file?.contents) {
        uploadBytes(
          ref(storage, `speakers/${fields.name.replace(' ', '_')}`),
          file.contents, { contentType: file.metadata.type }
        ).then(createSpeaker);
      }
      else if (file.contents) {
        uploadBytes(
          ref(storage, `speakers/${fields.name.replace(' ', '_')}`),
          file.contents, { contentType: file.metadata.type }
        ).then(updateSpeaker);
      }
      else {
        updateSpeaker();
      }
    }
  }

  const createSpeaker = async (task: UploadTaskSnapshot) => {
    addDoc(collection(db, '/speakers'), {
      ...getChanges(),
      portraitUrl: await getDownloadURL(task.ref)
    });

    closeSpeakerEditor();
  }

  const updateSpeaker = async (task?: UploadTaskSnapshot) => {
    const changes: Speaker = {
      ...getChanges(),
      portraitUrl: initState.file.preview
    };

    if (task) {
      changes.portraitUrl = await getDownloadURL(task.ref);
    }

    updateDoc(initState.ref, changes);
    closeSpeakerEditor();
  }

  return(
    // classes={{ paperFullScreen: classes.fullscreen }}
    <Dialog fullScreen
      open={isOpen}
      className="speaker-editor"
      TransitionComponent={Transition}
    >
      <AppBar className="header">
        <Toolbar>
          <IconButton color="inherit" aria-label="Close" onClick={closeSpeakerEditor}>
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Speaker Editor
          </Typography>
          <Button color="inherit" onClick={onSaveClicked}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <div className="editor-profile-header">
          <Dropzone accept="image/*" onDrop={onFileDrop} >
            {dropZoneRender}
          </Dropzone>

          <div className="field-containers">
            {buildFieldInput('Name', 'name')}
            {buildFieldInput('Title', 'title')}
            {buildFieldInput('Company', 'company')}
          </div>
          <div className="field-containers">
            {buildFieldInput('Twitter Handle', 'twitter')}
            {buildFieldInput('Github Username', 'github')}
            {buildFieldInput('Facebook Username', 'facebook')}
          </div>
          <div className="field-containers">
            {buildFieldInput('Medium Username', 'medium')}
            {buildFieldInput('LinkedIn Username', 'linkedin')}
            {buildFieldInput('Blog Url', 'blog')}
          </div>
        </div>

        {/* className={classes.formControl} */}
        <FormControl>
          <textarea className="bio-editor" />
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}

const mapStateToProps = (state: ApplicationState) => ({
  db: getDatabase(state),
  storage: getFirebaseStorage(state),
  isOpen: getIsSpeakerEditorOpen(state),
  initState: getEditorState(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  closeConfigDialog,
  setSpeakerEditorOpen
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SpeakerEditor);