import React from 'react';
import {Icon, ListItem, ListItemText} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {NavLinkAdapter, FuseUtils} from '@fuse';
import {withRouter} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector} from 'react-redux';
import * as Actions from 'app/store/actions';
import FuseNavBadge from './../FuseNavBadge';

const useStyles = makeStyles(theme => ({
    item: {
        height                     : 45,
        width                      : 'calc(100% - 16px)',
        borderRadius               : '0 20px 20px 0',
        paddingRight               : 12,
        '&.active'                 : {
            backgroundColor            : theme.palette.secondary.main,
            color                      : theme.palette.secondary.contrastText + '!important',
            pointerEvents              : 'none',
            transition                 : 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
            '& .list-item-text-primary': {
                color: 'inherit'
            },
            '& .list-item-icon'        : {
                color: 'inherit'
            }
        },
        '& .list-item-icon'        : {},
        '& .list-item-text'        : {
            wordBreak: 'break-all',
            whiteSpace: 'normal'
        },
        color                      : theme.palette.text.primary,
        cursor                     : 'pointer',
        textDecoration             : 'none!important'
    }
}));

function FuseNavVerticalItem(props)
{
    const dispatch = useDispatch();
    const userRole = useSelector(({auth}) => auth.user.role);

    const classes = useStyles(props);
    const {item, nestedLevel} = props;
    let paddingValue = 40 + (nestedLevel * 16);
    var listItemPadding = nestedLevel > 0 ? 'pl-' + (paddingValue > 80 ? 80 : paddingValue) : 'pl-24';
    if(item.id === 'aboutcines' || item.id === 'filehome' || item.id === 'fileresources')
     listItemPadding = 'pl-40'

    if ( !FuseUtils.hasPermission(item.auth, userRole) )
    {
        return null;
    }

    return (
        <ListItem
            button
            component={NavLinkAdapter}
            to={item.url}
            activeClassName="active"
            className={clsx(classes.item, listItemPadding, 'list-item')}
            onClick={ev => dispatch(Actions.navbarCloseMobile())}
            exact={item.exact}
        >
            {item.icon && (
                <Icon className="list-item-icon text-16 flex-shrink-0 mr-16" color="action">{item.icon}</Icon>
            )}
            <ListItemText className="list-item-text" primary={item.title} classes={{primary: 'text-14 list-item-text-primary'}}/>
            {item.badge && (
                <FuseNavBadge badge={item.badge}/>
            )}
        </ListItem>
    );
}

FuseNavVerticalItem.propTypes = {
    item: PropTypes.shape(
        {
            id   : PropTypes.string.isRequired,
            title: PropTypes.string,
            icon : PropTypes.string,
            url  : PropTypes.string
        })
};

FuseNavVerticalItem.defaultProps = {};

const NavVerticalItem = withRouter(React.memo(FuseNavVerticalItem));

export default NavVerticalItem;
