import * as Actions from '../actions';

const initialState = false;

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.CLEAR_FILTER:
            return false
        case Actions.FILTERED_FILES:
            return {
                ...action.payload
            }
        default:
            return state;
    }
};

export default reducer;