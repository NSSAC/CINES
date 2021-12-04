import * as Actions from '../actions';

const initialState = null;

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_FILES:
            return action.payload

        case Actions.GET_FILES_FAILED:
            return {
                error: action.payload.error
            }
        case Actions.CLEAR_FILES:
            return {...initialState}
        default:
            return state;
    }
};

export default reducer;