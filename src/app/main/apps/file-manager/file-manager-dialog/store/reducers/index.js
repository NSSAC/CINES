import {combineReducers} from 'redux';
import home from './home.reducer';
import selectedItemId from './selectedItemIdReducer';

const reducer = combineReducers({
    home,
    selectedItemId
});

export default reducer;
