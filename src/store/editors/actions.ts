import { createAction } from 'redux-actions';
import { DocumentReference } from 'firebase/firestore';

import { EditorEvents } from 'store/events';
import { Speaker } from 'models/speaker';
import { Session } from 'models/session';

export const editSpeaker = createAction(
  EditorEvents.EDIT_SPEAKER,
  (ref: DocumentReference, speaker: Speaker) => ({ ref, speaker })
);

export const editSession = createAction(
  EditorEvents.EDIT_SESSION,
  (ref: DocumentReference, session: Session) => ({ ref, session})
);
