import React from 'react';
import {AppBar, Hidden, Icon} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {FuseScrollbars} from '@fuse';
import clsx from 'clsx';
import UserNavbarHeader from 'app/fuse-layouts/shared-components/UserNavbarHeader';
import NavbarFoldedToggleButton from 'app/fuse-layouts/shared-components/NavbarFoldedToggleButton';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import Navigation from 'app/fuse-layouts/shared-components/Navigation';

const useStyles = makeStyles({
    content: {
        overflowX                   : 'hidden',
        overflowY                   : 'auto',
        '-webkit-overflow-scrolling': 'touch',
        background                  : 'linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 30%), linear-gradient(rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 40%)',
        backgroundRepeat            : 'no-repeat',
        backgroundSize              : '100% 40px, 100% 10px',
        backgroundAttachment        : 'local, scroll'
    }
});

function NavbarMobileLayout2(props)
{
    const classes = useStyles(props);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <AppBar
                color="primary"
                position="static"
                elevation={0}
                className="flex flex-row items-center flex-shrink h-64 min-h-64 pl-20 pr-12"
            >
                <div className="flex flex-1 pr-8">
                    <Logo/>
                </div>

                <Hidden mdDown>
                    <NavbarFoldedToggleButton className="w-40 h-40 p-0"/>
                </Hidden>

                <Hidden lgUp>
                    <NavbarMobileToggleButton className="w-40 h-40 p-0">
                        <Icon>arrow_back</Icon>
                    </NavbarMobileToggleButton>
                </Hidden>
            </AppBar>

            <FuseScrollbars className={clsx(classes.content)}>

                <UserNavbarHeader/>

                <Navigation layout="vertical"/>
            </FuseScrollbars>
        </div>
        // <div className="flex flex-auto justify-between items-center w-full h-full container p-0 lg:px-24">

        //     <div className="flex flex-shrink-0 items-center pl-8 pr-16">
        //         <Logo/>
        //     </div>

        //     <FuseScrollbars className="flex h-full items-center">
        //         <Navigation className="w-full" layout="horizontal"/>
        //     </FuseScrollbars>
        // </div>
    );
}

export default NavbarMobileLayout2;


