import { DocumentReference } from '@firebase/firestore';

export type Speaker = {
  name: string;
  title?: string;
  company?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  medium?: string;
  linkedin?: string;
  blog?: string;
  portraitUrl: string;
  featured: boolean;
  bio: string;
};

export type SpeakerEditorFullState = SpeakerEditorState & {
  bio: string;
  ref?: DocumentReference;
};

export type SpeakerEditorState = {
  name: string;
  title?: string;
  company: string;
  featured: boolean;
  file: {
    metadata?: File;
    contents?: ArrayBuffer;
    preview: string;
  };
  twitter?: string;
  github?: string;
  facebook?: string;
  medium?: string;
  linkedin?: string;
  blog?: string;
  errors: string[];
};
