import * as Actions from '../actions';

const initialState = null;

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_ANALYSIS_FILES:
            return action.payload

        case Actions.GET_ANALYSIS_FILES_FAILED:
            return {
                error: action.payload.error
            }
        default:
            return state;
    }
};

export default reducer;