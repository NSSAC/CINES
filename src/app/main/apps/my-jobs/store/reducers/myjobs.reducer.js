import * as Actions from '../actions';

const myjobsReducer = function (state = {}, action) {
    switch ( action.type )
    {
        case Actions.GET_FILES:
            //return _.keyBy(action.payload ,'id');
            return (action);
        default:
            return state;
    }
};

export default myjobsReducer;
