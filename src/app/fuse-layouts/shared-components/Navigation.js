import React from 'react';
import {FuseNavigation} from '@fuse';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';

function Navigation(props)
{
    const navigation = useSelector(({fuse}) => fuse.navigation);

    return (
        <div>
<FuseNavigation className={clsx("navigation", props.className)} navigation={navigation} layout={props.layout} dense={props.dense} active={props.active} />
        
        </div>
        
    );
}

Navigation.defaultProps = {
    layout: "vertical"
};

export default Navigation;
