import { createSelector } from 'reselect';
import { DocumentSnapshot } from '@firebase/firestore';

import { ApplicationState } from 'models/states';
import { Speaker } from 'models/speaker';

export const getSpeakers = (state: ApplicationState) => state.speakers.speakers;

export const getEditorState = (state: ApplicationState) => state.speakers.editor;

export const getSpeakersInOrder = createSelector(getSpeakers, documents => {
  let speakers: DocumentSnapshot[] = [];

  if (documents && Object.keys(documents).length > 0) {
    let keys = Object.keys(documents).sort((a: string, b: string) => {
      const speakerA = documents[a].data() as Speaker;
      const speakerB = documents[b].data() as Speaker;

      if (speakerA.name > speakerB.name) {
        return 1;
      }

      if (speakerB.name > speakerA.name) {
        return -1;
      }

      return 0;
    });

    speakers = keys.map(key => documents[key]);
  }

  return speakers;
});
