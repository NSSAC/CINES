import * as Actions from '../actions';

const childReducer = function (state = {}, action) {
    switch ( action.type )
    {
        case Actions.GET_CHILDFILES:
            //return _.keyBy(action.payload ,'id');
            return (action);
        case Actions.CLEAR_CHILDJOB:
            return {}
        default:
            return state;
    }
};

export default childReducer;
