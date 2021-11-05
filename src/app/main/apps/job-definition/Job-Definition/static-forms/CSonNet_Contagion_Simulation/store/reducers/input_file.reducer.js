import * as Actions from '../actions';

const initial_state = {

}

const inputFileReducer = function (state = initial_state, action) {
    switch ( action.type )
    {
        case Actions.SET_INPUT_FILE_META:
            return {
                ...action.payload
            }
        default:
            return state;
    }
};

export default inputFileReducer;
