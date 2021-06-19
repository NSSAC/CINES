import React from 'react';
import { useSelector } from 'react-redux';

// import { FuseScrollbars } from '@fuse';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import Navigation from 'app/fuse-layouts/shared-components/Navigation';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';

function NavbarLayout2()
{
    const user = useSelector(({auth}) => auth.user);
    return (
        <div className="flex flex-auto justify-between items-center w-full h-full container p-0 lg:px-24">

            <div className="flex flex-shrink-0 items-center pl-8 pr-16">
                <Logo/>
            </div>

            <div className="flex h-full items-center">
                <Navigation className="w-full " layout="horizontal"/>

                {!user.role || user.role.length === 0 ? (
                        <React.Fragment>
                        </React.Fragment>
                ):(
                    <React.Fragment>
                        <UserMenu/>
                    </React.Fragment>
                )}
            </div>


  
           
        
        </div>
    );
}

export default NavbarLayout2;


