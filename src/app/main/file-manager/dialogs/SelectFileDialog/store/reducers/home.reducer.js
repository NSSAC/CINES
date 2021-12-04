import * as Actions from '../actions';
import _ from '@lodash';

const homeReducer = function (state={}, action) {
    switch ( action.type )
    {
        case Actions.GET_HOME:
            return _.keyBy(action.payload, 'id');
        default:
            return state || [];
    }
};

export default homeReducer;
