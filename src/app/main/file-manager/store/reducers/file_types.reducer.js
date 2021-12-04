import * as Actions from '../actions';
const initialState = null;

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_FILE_TYPES:
            return {
                ...state,
                ...action.payload
            }
        case Actions.GET_FILE_TYPES_FAILED:
            return {
                ...state,
                file_types: false,
                error: action.payload.error
            }
        default:
            return state;
    }
};

export default reducer;