import * as Actions from '../actions';

const myjobsReducer = function (state = {}, action) {
    switch (action.type) {
        case Actions.GET_FILES:
            return (action);
        case Actions.CLEAR:
            return {}
        default:
            return state;
    }
};

export default myjobsReducer;
