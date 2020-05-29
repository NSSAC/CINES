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
        <div className="flex flex-auto justify-between items-center w-full h-full container p-0 lg:px-24">

            <div className="flex flex-shrink-0 items-center pl-8 pr-16">
                <Logo/>
            </div>

            <FuseScrollbars className="flex h-full items-center">
                <Navigation className="w-full" layout="horizontal"/>
            </FuseScrollbars>
        </div>
    );
}

export default NavbarMobileLayout2;


