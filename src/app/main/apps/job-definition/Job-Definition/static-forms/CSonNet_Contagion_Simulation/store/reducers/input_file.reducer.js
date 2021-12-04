import * as Actions from '../actions';
import { LOCATION_CHANGE } from 'react-router-redux'

const initial_state = {

}

const inputFileReducer = function (state = initial_state, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            console.log("Location Reset")
            return { ...initial_state }
        case Actions.INIT_INPUT_FILE_META:
            return {
                ...initial_state
            }
        case Actions.SET_INPUT_FILE_META:
            return {
                ...action.payload
            }
        default:
            return state;
    }
};

export default inputFileReducer;
