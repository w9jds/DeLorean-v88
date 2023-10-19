import { createSelector } from 'reselect';
import { DocumentSnapshot } from '@firebase/firestore';

import { Session } from 'models/session';
import { ApplicationState } from 'models/states';

export const getSessions = (state: ApplicationState) => state.sessions.sessions;

export const getSessionEditorState = (state: ApplicationState) => state.sessions.editor;

export const getSessionByStartTime = createSelector(
  [getSessions], (sessions) => {
    const slots: Record<number, DocumentSnapshot[]> = {};

    for (let sessionId in sessions) {
      const document = sessions[sessionId];
      const session = document.data() as Session;

      if (session.startTime && session.isUnscheduled === false) {
        const time = session.startTime.toDate().setSeconds(0, 0);
        slots[time] = slots[time] ? slots[time].concat(document) : [document];
      }
    }

    return slots;
  }
);

export const getUnscheduledSessions = createSelector(
  [getSessions], (sessions) => {
    const items = [];

    for (let sessionId in sessions) {
      const document = sessions[sessionId];
      const session = document.data() as Session;

      if (!session.startTime || session.isUnscheduled === true) {
        items.push(document);
      }
    }

    return items;
  }
)