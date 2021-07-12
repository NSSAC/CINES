import {combineReducers} from 'redux';
import myjobs from './myjobs.reducer';
import selectedjobid from './selectedjobid';
import jobDef from './jobDefinitions.reducer';

const reducer = combineReducers({
    myjobs,
    selectedjobid,
    jobDef
});

export default reducer;
