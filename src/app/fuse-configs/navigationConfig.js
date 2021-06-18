// import { authRoles } from 'app/main/documentation/material-ui-components/MaterialUIComponentsNavigation';
import {authRoles} from 'app/auth';

const userServiceURL=`${process.env.REACT_APP_SCIDUCT_USER_SERVICE}`
const logoutURL = `${process.env.REACT_APP_LOGOUT_URL}`
const registrationURL = userServiceURL + "/register?redirect=" + encodeURIComponent(logoutURL);
const sciductID=`${process.env.REACT_APP_SCIDUCT_APP_ID}`
var loginURL = userServiceURL + "/authenticate/" + sciductID
const navigationConfig = [
        {
            'id'   : 'dashboards',
            'title': 'Home',
            'type' : 'item',
            'icon' : 'home',
            'url'  : '/home'
        },
        {
            'id'   : 'scrumboard',
            'title': 'About',
            'type' : 'item',
            'icon' : 'font_download',
            'url'  :'/about'
            // 'url'  : '/apps/scrumboard'
        },
        {
            'id'   : 'mail',
            'title': 'Collaborators',
            'type' : 'item',
            'icon' : 'group',
            'url'  : '/collaborators'
            // 'badge': {
            //     'title': 25,
            //     'bg'   : '#F44336',
            //     'fg'   : '#FFFFFF'
            // }
            },
            {
            'id'   : 'publications',
            'title': 'Publications',
            'type' : 'item',
            'icon' : 'library_books',
            'url'  : '/publications'
        },
           
        {
            'id'   : 'file-manager',
            'title': 'File Manager',
            'type' : 'item',
            'icon' : 'folder',
            auth   : authRoles.onlyGuest,
            'url'  : `/apps/files/`
        },
        {
            'id'   : 'file-manager',
            'title': 'File Manager',
            'type' : 'item',
            'icon' : 'folder',
            auth   : authRoles.user,
            'url'  : `/apps/files/home/`

        },

        {
            'id'   : 'register',
            'title': 'Register',
            'type' : 'link',
            'auth'   : authRoles.onlyGuest,
            'url'  : registrationURL

        },  
        {
            'id'   : 'login',
            'title': 'Login',
            'type' : 'link',
            'auth'   : authRoles.onlyGuest,
            'url'  : loginURL

        },  
];

export default navigationConfig;
