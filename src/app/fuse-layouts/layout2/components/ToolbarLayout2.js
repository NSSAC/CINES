import { AppBar, Hidden, Toolbar } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { useSelector } from 'react-redux';

import Logo from 'app/fuse-layouts/shared-components/Logo';
// import {FuseSearch, FuseShortcuts} from '@fuse';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
// import QuickPanelToggleButton from 'app/fuse-layouts/shared-components/quickPanel/QuickPanelToggleButton';
// import ChatPanelToggleButton from 'app/fuse-layouts/shared-components/chatPanel/ChatPanelToggleButton';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';

const userServiceURL=`${process.env.REACT_APP_SCIDUCT_USER_SERVICE}`
const logoutURL = `${process.env.REACT_APP_LOGOUT_URL}`
const registrationURL = userServiceURL + "/register?redirect=" + encodeURIComponent(logoutURL);
const sciductID=`${process.env.REACT_APP_SCIDUCT_APP_ID}`
var loginURL = userServiceURL + "/authenticate/" + sciductID

const useStyles = makeStyles(theme => ({
    separator: {
        width          : 1,
        height         : 64,
        backgroundColor: theme.palette.divider
    }
}));

function ToolbarLayout2(props)
{
    const config = useSelector(({fuse}) => fuse.settings.current.layout.config);
    const toolbarTheme = useSelector(({fuse}) => fuse.settings.toolbarTheme);
    const user = useSelector(({auth}) => auth.user);
    const classes = useStyles(props);

    return (
        <ThemeProvider theme={toolbarTheme}>
            <AppBar id="fuse-toolbar" className="flex relative z-10" color="default" style={{backgroundColor: toolbarTheme.palette.background.default}}>
            <Hidden lgUp>
                <Toolbar className="  container  p-0 ">
                    {config.navbar.display && (
                        <Hidden lgUp>
                            <NavbarMobileToggleButton className="w-64 h-64 p-0"/>
                            <div className={classes.separator}/>
                        </Hidden>
                    )}

                    <div className="flex flex-1 items-center text-center">
                        <div className="flex flex-shrink-0 items-center pl-8 pr-16 m-auto">
                            <Logo/>
                        </div>
                    </div>

                    <div className="flex">
                        {!user.role || user.role.length === 0 ? (
                            <React.Fragment>
                                <div className="flex flex-1 items-center text-center m-8">
                                    <a href={registrationURL}>Register</a>
                                </div>
                                <div className="flex flex-1 items-center text-center m-8">
                                    <a href={loginURL}>Login</a>
                                </div>
                            </React.Fragment>
                        ):(
                            <React.Fragment>
                                <UserMenu/>
                            </React.Fragment>
                        )}
   
                    </div>

                </Toolbar>
                </Hidden>
            </AppBar>
        </ThemeProvider>
    );
}

export default ToolbarLayout2;
