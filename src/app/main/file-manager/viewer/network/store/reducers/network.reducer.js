import * as Actions from '../actions';

const reducer = function (state={}, action) {
    // console.log("action.type: ", action.type)
    switch ( action.type )
    {
       
        case Actions.TRANSFORM_NETWORK:
            return action.payload
        default:
            return state || [];
    }
};

export default reducer;
