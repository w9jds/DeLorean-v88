import { Profile } from './user';
import Configuration from './config';

import Sponsor from './sponsor';
import { FirebaseApp } from '@firebase/app-types';
import { User } from '@firebase/auth-types';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { SpeakerEditorState } from './speaker';

export type CurrentState = {
    readonly user: User;
    readonly profile: Profile;
    readonly firebase: FirebaseApp;
    readonly config: Configuration;
    readonly sponsors: Record<string, Sponsor>

};

export type AdminState = {
    readonly isEditMode: boolean;
    readonly isCreateOpen: boolean;
    readonly isSpeakerEditorOpen: boolean;
};

export type ConfigState = {
    readonly isOpen: boolean;
};

export type DialogsState = {
    readonly open: boolean;
    readonly fullscreen: boolean;
    readonly views: React.ReactElement<any> | React.ReactElement<any>[];
};

export type SpeakerState = {
    readonly editor: SpeakerEditorState;
    readonly speakers: Record<string, DocumentSnapshot>;
};