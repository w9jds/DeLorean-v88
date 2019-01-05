import { DocumentReference } from '@firebase/firestore-types';

export interface Session {
    name: string;
    location?: string;
    speakers: string[];
    description: string;
    tags: string[];
}

export type SessionEditorFullState = SessionEditorState & { 
    description: string;
    ref?: DocumentReference;
};

export type SessionEditorState = {
    name: string;
    speakers: string[];
    tracks: string[];
    errors: string[];
};