import * as Actions from '../../actions/fuse/index';
import navigationConfig from 'app/fuse-configs/navigationConfig';

const initialState = navigationConfig;

const navigation = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_NAVIGATION:
        {
            return [
                ...state
            ];
        }
        case Actions.SET_NAVIGATION:
        {
            return [
                ...action.navigation
            ];
        }
        case Actions.RESET_NAVIGATION:
        {
            return [
                ...initialState
            ];
        }
        default:
        {
            // if(localStorage.getItem("loggedIn")){

            //     for (var i = 0; i < state.length; i++) {
            //         if (state[i].id === 'my-jobs') {
                        
            //                  return state;                   // exit loop and function
            //         }
            //     }
             

            //         state.push({
                        
            //             'id'   : 'my-jobs',
            //             'title': 'My Jobs',
            //              'type' : 'item',
            //              'icon' : 'chrome_reader_mode',
            //              'url'  : '/apps/my-jobs/'
            //           })
                  
             
            // }
            return state;
        }
    }
};

export default navigation;
