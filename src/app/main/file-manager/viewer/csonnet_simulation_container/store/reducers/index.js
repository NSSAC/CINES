import {combineReducers} from 'redux';
import files from './files.reducer';
import analysis_files from './analysis_files.reducer';
import output_file from './output_file.reducer';

const reducer = combineReducers({
    files,
    analysis_files,
    output_file
});

export default reducer;
