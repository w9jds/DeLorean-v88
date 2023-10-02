import { Profile } from './user';
import Configuration from './config';

import { User } from '@firebase/auth';
import { FirebaseApp } from '@firebase/app';
import { DocumentSnapshot } from '@firebase/firestore';

import Sponsor from './sponsor';
import { SpeakerEditorFullState } from './speaker';
import { SessionEditorFullState } from './session';

export interface ApplicationState {
  readonly current: CurrentState;
  readonly config?: ConfigState;
  readonly dialogs?: DialogsState;
  readonly admin?: AdminState;
  readonly speakers: SpeakerState;
  readonly sessions: SessionState;
}

export type CurrentState = {
  readonly user?: User;
  readonly profile?: Profile;
  readonly firebase?: FirebaseApp;
  readonly config: Configuration;
  readonly sponsors: Record<string, Sponsor>
};

export type AdminState = {
  readonly isEditMode: boolean;
  readonly isCreateOpen: boolean;
  readonly isSpeakerEditorOpen: boolean;
  readonly isSessionEditorOpen: boolean;
};

export type ConfigState = {
  readonly isOpen: boolean;
};

export type DialogsState = {
  readonly open: boolean;
  readonly fullscreen: boolean;
  readonly views: React.ReactElement<any> | React.ReactElement<any>[];
};

export type SponsorState = {
  // readonly editor;
  // readonly sponsors: Record<string, DocumentSnapshot>;
};

export type SpeakerState = {
  readonly editor?: SpeakerEditorFullState;
  readonly speakers: Record<string, DocumentSnapshot>;
};

export type SessionState = {
  readonly editor?: SessionEditorFullState;
  readonly sessions: Record<string, DocumentSnapshot>;
};