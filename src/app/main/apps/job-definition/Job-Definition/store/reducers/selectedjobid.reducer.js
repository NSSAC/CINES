import * as Actions from '../actions';

const selectedjobid = function (state ={}, action) {
    switch ( action.type )
    {
        case Actions.SET_SELECTED_ITEM_ID:
            return action.payload;
        case Actions.CLEAR_SELECTED_ITEM_ID:
            return null;
        default:
            return state;
    }
};

export default selectedjobid;
