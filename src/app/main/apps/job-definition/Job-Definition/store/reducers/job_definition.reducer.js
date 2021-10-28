import * as Actions from '../actions';
const initialState = null;
const job_definition = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_JOB_DEFINITION_FAILED:
            return {
                failed: true
            }
        case Actions.GET_JOB_DEFINITION:
            return {
                ...action.payload
            }
        case Actions.CLEAR_JOB_DEFINITION:
            return null;
        case Actions.SWITCH_JOB_DEFINITION_VERSION:
            return {
                switch_version: action.payload
            }
        default:
            return state;
    }
};

export default job_definition;
