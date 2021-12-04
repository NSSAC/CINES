import {combineReducers} from 'redux';
import files from './files.reducer';
import selectedItemId from './selectedItemIdReducer';
import file_meta from './file_meta.reducer'
import uploader from './uploader.reducer'

const reducer = combineReducers({
    files,
    selectedItemId,
    file_meta,
    uploader
});

export default reducer;
