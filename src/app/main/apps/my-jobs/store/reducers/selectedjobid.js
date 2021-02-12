import * as Actions from '../actions';

const selectedjobid = function (state ={}, action) {
    switch ( action.type )
    {
        case Actions.SET_SELECTED_ITEM_ID:
            return action.payload.data;
        default:
            return state;
    }
};

export default selectedjobid;
