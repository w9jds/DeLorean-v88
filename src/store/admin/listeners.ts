import { startListening } from 'store/middleware';
import { toggleEditMode } from './reducer';
import { ApplicationState } from 'models/states';
import { isEditMode } from './selectors';
import { setSessionEditorOpen } from 'store/sessions/reducer';
import { setSpeakerEditorOpen } from 'store/speakers/reducer';

startListening({
  actionCreator: toggleEditMode,
  effect: async (action, { getState, dispatch }) => {
    const state = getState() as ApplicationState;
    const isEdit = isEditMode(state);

    if (!isEdit) {
      dispatch(setSessionEditorOpen(false));
      dispatch(setSpeakerEditorOpen(false));
    }
  }
});