import React, { useState } from 'react';
import {Hidden, Typography, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow,Link} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate} from '@fuse';
import {useDispatch, useSelector} from 'react-redux';
import clsx from 'clsx';
import * as Actions from './store/actions';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import filesize from 'filesize';
import Preview from './Preview'


const useStyles = makeStyles({
    typeIcon: {
        '&.folder:before' : {
            content: "'folder'",
            color  : '#FFB300'
        },
        '&.epihiperOutput:before'     : {
            content: "'folder'",
            color  : '#FFB300'
        },
        '&.pdf:before'     : {
            content: "'picture_as_pdf'",
            color  : 'red'
        },
        '&.epihiper_multicell_analysis:before' : {
            content: "'folder'",
            color  : '#FFB300'
        },
        '&.png:before'     : {
            content: "'image'",
            color  : 'blue'
        },
        '&.jpg:before'     : {
            content: "'image'",
            color  : 'blue'
        },
        '&.jpeg:before'     : {
            content: "'image'",
            color  : 'blue'
        },
        '&.mp3:before'     : {
            content: "'library_music'",
            color  : 'blue'
        },
        '&.mp4:before'     : {
            content: "'video_library'",
            color  : 'blue'
        },
        '&.csv:before': {
            content: "'table_chart'",
            color  : '#4CAF50'
        },
        '&.excel:before': {
            content: "'table_chart'",
            color  : '#4CAF50'
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
    var path = window.location.pathname
    var pathEnd=path.charAt(path.length-1)
    const [click, setClick] = useState(false);

    function onClickHandler(node,canLink){
        return function(evt){
            if(click == false)
            if (evt.target && evt.target.getAttribute("to") ){
                setClick(true)
                setTimeout(() => {
                   setClick(false)
                }, 1000);
                if(node.type == "folder" || node.type == "epihiperOutput" || node.type == "epihiper_multicell_analysis"){
                  var target = window.location.pathname + evt.target.getAttribute("to") + "/";
                }
                else{
                  var target = window.location.pathname + evt.target.getAttribute("to");
                  props.setPreview(false)
                  localStorage.setItem('nodeType',node.type)
                  localStorage.setItem('nodeId',node.id)
                  localStorage.setItem('nodeSize',node.size)
                }
               props.history.push(target)
            }
            dispatch(Actions.setSelectedItem(node.id))
        }
    }

   var searchResults = Object.values(files).filter((data)=>{
        if(data.name !== "" && (props.search == ""  || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase())  || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data })
    
    if(pathEnd == "/"){
        props.setPreview(true)
        localStorage.removeItem('nodeId', 'nodeSize','nodeType')
        if(Object.values(files).length > 0 && searchResults.length > 0)
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
                            {searchResults.map((node)=>{
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
            else if(Object.values(files).length == 0){              
                        return (
                            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                            <Typography className="text-18 mt-16" color="textSecondary">This folder is empty.</Typography>
                            </div>
                        )             
            }
               
            else if(searchResults.length  == 0)
                return (
                    <div className="flex flex-1 flex-col items-center justify-center mt-40">
                    <Typography className="text-18 mt-16" color="textSecondary">No match found for "{props.search}". Please try finding something else.</Typography>
                    </div>
                )
           
  
}
    else{
    var type = localStorage.getItem('nodeType')
    var id = localStorage.getItem('nodeId')
    var size = localStorage.getItem('nodeSize')
    props.setPreview(false)
    if(id !== null)
      return (
          <Preview type={type} fileId={id} size={size} ></Preview>
      )
     else  return (
        <div className="flex flex-1 flex-col items-center justify-center">
         <Typography className="text-20 mt-16" color="textSecondary">No such file exists</Typography>
        </div>
       )
    }
 }

export default withRouter(FileList);
