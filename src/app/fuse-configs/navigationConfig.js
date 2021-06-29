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
            'id': "About",
            "title": "About",
            "type": "group",
            "icon": "business",
            "children": [
                {
                    'id'   : 'aboutcines',
                    'title': 'About CINES',
                    'type' : 'item',
                    'url'  :'/about',
                    'icon' : 'picture_in_picture'
                    // 'url'  : '/apps/scrumboard'
                },
                {
                    'id'   : 'collaborators',
                    'title': 'Collaborators',
                    'type' : 'item',
                    'url'  : '/collaborators',
                    'icon': 'people'
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
                    'url'  : '/publications',
                    'icon': 'library_books'
                }
            ]
        },  
        {
            'id'   : 'file-manager-guest',
            'title': 'Files',
            'type' : 'item',
            'icon' : 'folder',
            auth   : authRoles.onlyGuest,
            'url'  : '/apps/files/resources/net.science'
        },
        {
            'id'   : 'file-manager',
            'title': 'Files',
            'type' : 'group',
            'icon' : 'folder',
            auth   : authRoles.user,
            // 'url'  : '/apps/files',
            "children": [
                {
                    'id'   : 'filehome',
                    'title': 'User home',
                    'type' : 'item',
                    'icon' : 'home_work',
                    'url'  : '/apps/files/home'
                },
                {
                    'id'   : 'fileresources',
                    'title': 'Resources',
                    'type' : 'item',
                    'icon' : 'vignette',
                    'url'  : '/apps/files/resources/net.science'
                },
            ]

        },

        {
                        
            'id'   : 'my-jobs',
            'title': 'My Jobs',
             'type' : 'item',
             'icon' : 'chrome_reader_mode',
             'url'  : '/apps/my-jobs/',
            'auth'   : authRoles.user,
        },
        {
            'id'   : 'register',
            'title': 'Register',
            'type' : 'link',
            'auth'   : authRoles.onlyGuest,
            'url'  : registrationURL,
            "target": "_self"

        },  
        {
            'id'   : 'login',
            'title': 'Login',
            'type' : 'link',
            'auth'   : authRoles.onlyGuest,
            'url'  : loginURL,
            "target": "_self"

        },  
];

export default navigationConfig;
