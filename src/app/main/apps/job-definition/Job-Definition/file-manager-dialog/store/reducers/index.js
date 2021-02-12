import {combineReducers} from 'redux';
import files from './files.reducer';
import home from './home.reducer';
import selectedItemId from './selectedItemIdReducer';

const reducer = combineReducers({
    files,
    home,
    selectedItemId
});

export default reducer;
