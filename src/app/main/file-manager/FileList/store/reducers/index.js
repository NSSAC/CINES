import {combineReducers} from 'redux';
import files from './files.reducer';
import filtered_files from './filtered_files.reducer';
import file_removal from './file_removal.reducer';


const reducer = combineReducers({
    files,
    filtered_files,
    file_removal
});

export default reducer;
