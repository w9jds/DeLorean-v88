import { DocumentReference, Timestamp } from '@firebase/firestore';

export interface Session {
  name: string;
  type: string;
  location?: string;
  slidesUrl?: string;
  speakers: string[];
  description: string;
  isUnscheduled?: boolean;
  startTime?: Timestamp;
  endTime?: Timestamp;
  tracks: string[];
}

export type SessionEditorFullState = SessionEditorState & {
  description: string;
  ref?: DocumentReference;
};

export enum SessionTypes {
  BREAK = 'Break',
  SESSION = 'Session',
  CODELAB = 'Codelab',
  WORKSHOP = 'Workshop',
  REGISTRATION = 'Registration',
  LIGHTNING_TALK = 'Lightning Talk',
}

export type SessionEditorState = {
  name: string;
  type: string;
  location?: string;
  slidesUrl?: string;
  startTime?: Date;
  endTime?: Date;
  speakers: string[];
  tracks: string[];
  errors: string[];
};
