import * as Actions from '../actions';

const initialState = null;

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_OUTPUT_FILE:
            return action.payload

        case Actions.GET_OUTPUT_FILE_FAILED:
            return {
                error: action.payload
            }
        default:
            return state;
    }
};

export default reducer;