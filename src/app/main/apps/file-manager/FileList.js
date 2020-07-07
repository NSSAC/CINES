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
    const classes = useStyles();

    function onClickHandler(node,canLink){
        return function(evt){
            if (evt.target && evt.target.getAttribute("to") ){
                if(node.type == "folder")
                  var target = window.location.pathname + evt.target.getAttribute("to") + "/";
                else
                  var target = window.location.pathname + evt.target.getAttribute("to");
              props.history.push(target)
            }
            dispatch(Actions.setSelectedItem(node.id))
        }
    }
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
                    {Object.values(files).filter((data)=>{
                        if((props.search == "" || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase())  || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data }).map(node=>{
                       return(
                            <TableRow
                            key={node.id}
                                hover
                                onClick={onClickHandler(node,node.isContainer)}
                                selected={node.id === selectedItemId}
                                className="cursor-pointer"
                            >
                                <TableCell className="max-w-64 w-64 p-0 text-center">
                                    <Icon className={clsx(classes.typeIcon, node.type)}/>
                                </TableCell>
                                {/* <TableCell>{(n.type == "folder")?<Link to={n.name}>{n.name}</Link> : (n.name)}</TableCell> */}
                                <TableCell>{<Link to={node.name}>{node.name}</Link>}</TableCell>
                                <TableCell className="hidden sm:table-cell">{node.type}</TableCell>
                                <TableCell className="hidden sm:table-cell">{node.owner_id}</TableCell>
                                <TableCell className="text-center hidden sm:table-cell">{(!node.size && (node.size!==0))? '-' : filesize(node.size)}</TableCell>
                                <TableCell className="hidden sm:table-cell">{moment(node.update_date).fromNow()}</TableCell>
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
