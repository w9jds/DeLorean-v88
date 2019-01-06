import { DocumentReference } from '@firebase/firestore-types';

export interface Session {
    name: string;
    type: string;
    location?: string;
    speakers: string[];
    description: string;
    tracks: string[];
}

export type SessionEditorFullState = SessionEditorState & { 
    description: string;
    ref?: DocumentReference;
};

export enum SessionTypes {
    SESSION = 'Session',
    CODELAB = 'Codelab',
    WORKSHOP = 'Workshop'
}

export type SessionEditorState = {
    name: string;
    type: string;
    speakers: string[];
    tracks: string[];
    errors: string[];
};