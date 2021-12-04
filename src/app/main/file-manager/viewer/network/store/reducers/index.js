import {combineReducers} from 'redux';
import network from './network.reducer';
import data from './data.reducer';

const reducer = combineReducers({
    network,
    data
});

export default reducer;
