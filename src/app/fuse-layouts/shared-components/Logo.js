import React from 'react';
import {Typography} from '@material-ui/core';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import { version } from "../../../../package.json"

const useStyles = makeStyles(theme => ({
    root      : {
        '& .logo-icon'                : {
            width     : 32,
            height    : 32,
            transition: theme.transitions.create(['width', 'height'], {
                duration: theme.transitions.duration.shortest,
                easing  : theme.transitions.easing.easeInOut
            })
        },
        '& .react-badge, & .logo-text': {
            transition: theme.transitions.create('opacity', {
                duration: theme.transitions.duration.shortest,
                easing  : theme.transitions.easing.easeInOut
            })
        }
    },
    reactBadge: {
        backgroundColor: '#121212',
        color          : '#61DAFB'
    }
}));

function Logo()
{
    const classes = useStyles();

    const logsize = {
    fontSize:'2rem',
    fontWeight: '700'
    }

    const instance_name = `${process.env.REACT_APP_INSTANCE_NAME}`

    return (
        <div className={clsx(classes.root, "flex items-center")}>
            <img className="logo-icon" src="assets/images/logos/favicon-32x32.png" alt="logo"/>
            <div className="flex flex-row">
                <Typography className="text-16 ml-12 font-light logo-text" style={logsize}  color="inherit">Net.Science</Typography>
                <Typography className="text-xs ml-4 font-light align bottom" style={{color: 'orange'}}>v{version} {instance_name}</Typography>
            </div>
            {/* <div className={clsx(classes.reactBadge, "react-badge flex items-center ml-12 mr-8 py-4 px-8 rounded")}>
                <img
                    className="react-logo"
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
                    alt="react"
                    width="16"
                />
                <span className="react-text text-12 ml-4">React</span>
            </div> */}
        </div>
    );
}

export default Logo;
