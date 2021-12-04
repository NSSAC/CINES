import { combineReducers } from 'redux';

import files from './files.reducer'
import filtered_files from "./filtered_files.reducer"
import home from './home.reducer';
import selectedItemId from './selectedItemIdReducer';
import target from './target.reducer';

const reducer = combineReducers({
    home,
    selectedItemId,
    target,
    files,
    filtered_files
});

export default reducer;
