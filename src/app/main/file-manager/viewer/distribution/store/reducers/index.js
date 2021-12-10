import {combineReducers} from 'redux';
import data from './data.reducer';
import parsed_data from './parsed_data.reducer';

const reducer = combineReducers({
    data,
    parsed_data
});

export default reducer;
