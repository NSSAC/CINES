import * as Actions from '../actions';

const jobDefReducer = function (state = {}, action) {
    switch ( action.type )
    {
        case Actions.GET_JOBS:
            return (action.payload);
        default:
            return state;
    }
};

export default jobDefReducer;
