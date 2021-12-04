import * as Actions from '../actions';

const initialState = null;

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_TARGET_META:
            return {
                ...state,
                ...action.payload
            }
        case Actions.GET_TARGET_META_FAILED:
            return {
                ...state,
                file_meta: false,
                error: action.payload.error
            }
        default:
            return state;
    }
};

export default reducer;