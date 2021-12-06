import * as Actions from '../actions';
const initialState = {updating: false};

const reducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.UPDATING_USER_META:
            return {
                updating: true,
                success: false
            }
        case Actions.UPDATE_USER_META_FAILED:
            return {
                updating: false,
                success: false,
                error: action.payload.error
            }
        case Actions.UPDATE_USER_META_SUCCESS:
            return {
                updating: false,
                success: true
            }
        case Actions.RESET_USER_META_EDITOR:
            return {...initialState}
        default:
            return state;
    }
};

export default reducer;