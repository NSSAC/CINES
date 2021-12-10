import * as Actions from '../actions';
const initialState = null;

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.PARSED_DATA:
            return action.payload

        default:
            return state;
    }
};

export default reducer;