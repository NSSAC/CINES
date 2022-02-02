import * as Actions from '../actions';
import {toast} from 'material-react-toastify'

const initialState = {
    removing_files: false
};

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.REMOVING_FILES:
            return {
                removing_files: true,
                files: action.payload
            }

        case Actions.FILE_REMOVED:
            var updated = state.files.filter((f)=>f!==action.payload)
            return {
                ...state,
                files: updated
            }
        case Actions.FILE_REMOVAL_COMPLETE:
            toast.success(`${action.payload.length} ${(action.payload.length>1)?"files/folders":"file/folder"} removed.`)
            return {
                removing_files: false,
                removal_completed: true,
                files_removed: action.payload.length
            }
        default:
            return state;
    }
};

export default reducer;