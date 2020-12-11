import * as Actions from '../actions';
import _ from '@lodash';

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
