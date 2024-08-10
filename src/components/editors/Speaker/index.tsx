import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { DocumentSnapshot, addDoc, collection, updateDoc } from 'firebase/firestore';
import { UploadTaskSnapshot, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { 
  Dialog, AppBar, Toolbar, Button, Slide, Typography, 
  IconButton, DialogContent, TextField 
} from '@mui/material';
import { Close, Face } from '@mui/icons-material';

import { Editor } from '@tinymce/tinymce-react';

import { SpeakerEditorState, Speaker } from 'models/speaker';
import { setSpeakerEditorOpen } from 'store/speakers/reducer';
import { getDatabase, getFirebaseStorage } from 'store/current/selectors';
import { getEditorState, isSpeakerEditorOpen } from 'store/speakers/selectors';

import './index.scss';

const Transition = (props) => <Slide direction="up" {...props} />;

enum ErrorTypes {
  NAME = 'name',
  PORTRAIT = 'portrait',
};

type EditableTypes = 'medium' | 'name' | 'title' | 'company' | 'twitter' | 'github' | 'facebook' | 'linkedin' | 'blog';

type Avatar = {
  metadata?: File;
  contents?: ArrayBuffer;
  preview: string;
}

type Props = {
  speaker?: DocumentSnapshot;
};

const SpeakerEditor: FC<Props> = ({ speaker }) => {
  const dispatch = useDispatch();

  const db = useSelector(getDatabase);
  const isOpen = useSelector(isSpeakerEditorOpen);
  const storage = useSelector(getFirebaseStorage);
  const initState = useSelector(getEditorState);

  const [file, setFile] = useState<Avatar>();
  const [errors, setErrors] = useState<string[]>([]);
  const [fields, setFields] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      setFile(initState?.file);
      setFields(initState);
    }
  }, [isOpen])

  const closeSpeakerEditor = () => {
    dispatch(setSpeakerEditorOpen(false));
  }

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
        {file?.preview ? <img title="avatar" src={file.preview} className="portrait-image" /> : <Face />}
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
    bio: fields?.bio.trim() || null,
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

  return (
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
          <Dropzone accept={{ 'image/*': [] }} onDrop={onFileDrop} >
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

        <div>
          <Editor
            licenseKey='gpl'
            tinymceScriptSrc={'/static/tinymce/tinymce.min.js'}
            value={fields?.bio}
            onEditorChange={newValue => setFields({...fields, bio: newValue})}
            init={{
              plugins: [ 'autolink', 'lists', 'advlist' ],
              resize: false,
              menubar: false,
              statusbar: false,
              extended_valid_elements : 'span[!class]',
              font_family_formats: 'Roboto',
              invalid_styles: 'color font-size font-family background-color',
              toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | outdent indent'
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SpeakerEditor;