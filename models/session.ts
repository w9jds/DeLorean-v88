import { DocumentReference, Timestamp } from '@firebase/firestore-types';

export interface Session {
    name: string;
    type: string;
    location?: string;
    speakers: string[];
    description: string;
    startTime?: Timestamp;
    endTime?: Timestamp;
    tracks: string[];
}

export type SessionEditorFullState = SessionEditorState & { 
    description: string;
    ref?: DocumentReference;
};

export enum SessionTypes {
    SESSION = 'Session',
    CODELAB = 'Codelab',
    WORKSHOP = 'Workshop',
    BREAK = 'Break',
    REGISTRATION = 'Registration'
}

export type SessionEditorState = {
    name: string;
    type: string;
    location?: string;
    startTime?: Date;
    endTime?: Date;
    speakers: string[];
    tracks: string[];
    errors: string[];
};