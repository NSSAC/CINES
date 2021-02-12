import {combineReducers} from 'redux';
import jobdefinition from './jobdefinition.reducer';
import selectedjobid from './selectedjobid';

const reducer = combineReducers({
    jobdefinition,
    selectedjobid,
    
});

export default reducer;
