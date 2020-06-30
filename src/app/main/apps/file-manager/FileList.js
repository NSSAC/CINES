import React from 'react';
import {Hidden, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow,Link} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate} from '@fuse';
import {useDispatch, useSelector} from 'react-redux';
import clsx from 'clsx';
import * as Actions from './store/actions';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import filesize from 'filesize';

const useStyles = makeStyles({
    typeIcon: {
        '&.folder:before'     : {
            content: "'folder'",
            color  : '#FFB300'
        },
        '&:before'   : {
            content: "'insert_drive_file'",
            color  : '#1565C0'
        }
    }
});

function FileList(props)
{
    const dispatch = useDispatch();
    const files = useSelector(({fileManagerApp}) => fileManagerApp.files);
    const selectedItemId = useSelector(({fileManagerApp}) => fileManagerApp.selectedItemId);
    console.log("History", props.history)
    const classes = useStyles();

    function onClickHandler(id,canLink){
        return function(evt){
            if (evt.target && evt.target.getAttribute("to") ){
                var target = window.location.pathname + evt.target.getAttribute("to") + "/";
                console.log("Target URL: ", window.location.pathname)
                props.history.push(target)
            }
            dispatch(Actions.setSelectedItem(id))
        }
    }
/// tablerow click handler    {event => dispatch(Actions.setSelectedItem(n.id))}
    return (
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <Table>

                <TableHead>
                    <TableRow>
                        <TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell className="hidden sm:table-cell">Type</TableCell>
                        <TableCell className="hidden sm:table-cell">Owner</TableCell>
                        <TableCell className="text-center hidden sm:table-cell">Size</TableCell>
                        <TableCell className="hidden sm:table-cell">Modified</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Object.entries(files).map(([key, n]) => {
                        return (
                            <TableRow
                                key={n.id}
                                hover
                                onClick={onClickHandler(n.id,n.isContainer)}
                                selected={n.id === selectedItemId}
                                className="cursor-pointer"
                            >
                                <TableCell className="max-w-64 w-64 p-0 text-center">
                                    <Icon className={clsx(classes.typeIcon, n.type)}/>
                                </TableCell>
                                <TableCell>{(n.type == "folder")?<Link to={n.name}>{n.name}</Link> : (n.name)}</TableCell>
                                <TableCell className="hidden sm:table-cell">{n.type}</TableCell>
                                <TableCell className="hidden sm:table-cell">{n.owner_id}</TableCell>
                                <TableCell className="text-center hidden sm:table-cell">{(!n.size && (n.size!==0))? '-' : filesize(n.size)}</TableCell>
                                <TableCell className="hidden sm:table-cell">{moment(n.update_date).fromNow()}</TableCell>
                                <Hidden lgUp>
                                    <TableCell>
                                        <IconButton
                                            onClick={(ev) => props.pageLayout.current.toggleRightSidebar()}
                                            aria-label="open right sidebar"
                                        >
                                            <Icon>info</Icon>
                                        </IconButton>
                                    </TableCell>
                                </Hidden>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </FuseAnimate>
    );
}

export default withRouter(FileList);
