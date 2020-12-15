import * as Actions from '../actions';
import _ from '@lodash';

const filesReducer = function (state={}, action) {
    switch ( action.type )
    {
        case Actions.GET_FILES:
            return _.keyBy(action.payload, 'id');
        case Actions.DELETE_FILE:
           var postDelete= Object.values(state).filter(data => action.delete_id !== data.id);
           return _.keyBy(postDelete, 'id');
        default:
            return state || [];
    }
};

export default filesReducer;
