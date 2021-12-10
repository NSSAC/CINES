import * as Actions from '../actions';

const initialState = {
    analysis: false,
    output: false,
    initial_states: false,
    others: false
}

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_FILES:
            return action.payload

        case Actions.GET_FILES_FAILED:
            return {
                error: action.payload.error
            }
        default:
            return state;
    }
};

export default reducer;