import * as Actions from '../actions';

const myjobsReducer = function (state = {}, action) {
    switch (action.type) {
        case Actions.GET_ALL_JOB_DEFINITIONS:
            return (action);
        case Actions.CLEAR_ALL_JOB_DEFINITIONS:
            return {}
        default:
            return state;
    }
};

export default myjobsReducer;
