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
import instance from 'app/services/sciductService/sciductService.js'
import { FormatAlignLeftSharp } from '@material-ui/icons';

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
    const selectedItem = useSelector(({fileManagerApp}) => files[fileManagerApp.selectedItemId]);
    const classes = useStyles();
    var path = window.location.pathname
    var pathEnd=path.charAt(path.length-1)
    var token=localStorage.getItem('id_token')
    const [click, setClick] = useState(false)
    var searchResults = Object.values(files).filter((data)=>{
        if(data.name !== "" && (props.search == ""  || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase())  || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data })
  
        if(pathEnd == "/"){
            if(!selectedItem){
             if(Object.values(files).length > 0  && (searchResults[0].id !== undefined)) {
                dispatch(Actions.setSelectedItem(searchResults[0].id))
              }
            }
         }


    const tableStyle={
        overflow: 'hidden',
        maxWidth: '200px',
        textOverflow: 'ellipsis',
        display:'inline-block',
        whiteSpace: 'nowrap'
    }

    function onClickHandler(node,canLink){
        return function(evt){
            if(click == false)
            if (evt.target && evt.target.getAttribute("to") ){
                setClick(true)
                setTimeout(() => {
                   setClick(false)
                }, 1500);
                if(node.type == "folder" || node.type == "epihiperOutput" || node.type == "epihiper_multicell_analysis"){
                  var target = window.location.pathname + evt.target.getAttribute("to") + "/";
                }
                else{
                  var target = window.location.pathname + evt.target.getAttribute("to");
                  props.setPreview(false)
                  localStorage.setItem('nodeType',node.type)
                  localStorage.setItem('nodeId',node.id)
                  localStorage.setItem('nodeSize',node.size)
          
                   if(token !==null){
                       var canRead = false;
                     for(var team in instance.getTokenData().teams){
                         for(var readRights in node.readACL){
                             if(team === readRights){
                                canRead = true;
                                localStorage.setItem('readPermission',true)
                                break;
                             }  
                         }
                         for(var writeRights in node.writeACL){
                            if(team === writeRights){
                                canRead = true;
                                localStorage.setItem('readPermission',true)
                                   break;
                            } 
                         }
                     }
                   if(instance.getTokenData().sub === node.owner_id){
                       canRead = true;
                       localStorage.setItem('readPermission',true)
                    }
                   if(canRead === false){
                        localStorage.setItem('readPermission',false)
                    } 
                  }
                  else{
                    localStorage.setItem('readPermission',false)
                  }
                }
                 
               props.history.push(target)
            }
            dispatch(Actions.setSelectedItem(node.id))
        }
    }
        
    
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
                                        <TableCell >{window.innerWidth<1224?<Link style={tableStyle} title={node.name} to={node.name}>{node.name}</Link>:
                                                                            <Link title={node.name} to={node.name}>{node.name}</Link>}</TableCell>
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
                            <div className="flex flex-1 flex-col items-center justify-center mt-20">
                            <Typography className="text-18 mt-16" color="textPrimary">This folder is empty.</Typography>
                            </div>
                        )             
            }
               
            else if(searchResults.length  == 0)
                return (
                    <div className="flex flex-1 flex-col items-center justify-center mt-20">
                    <Typography className="text-18 mt-16" color="textPrimary">No match found for "{props.search}". Please try finding something else.</Typography>
                    </div>
                )
           
  
}
    else{
    var type = localStorage.getItem('nodeType')
    var id = localStorage.getItem('nodeId')
    var size = localStorage.getItem('nodeSize')
    var readPermission = localStorage.getItem('readPermission')
    props.setPreview(false)
    if(id !== null)
      return (
          <Preview type={type} fileId={id} size={size} perm={readPermission}  ></Preview>
      )
     else  return (
        <div className="flex flex-1 flex-col items-center justify-center">
         <Typography className="text-20 mt-16" color="textPrimary">No such file exists</Typography>
        </div>
       )
    }
 }

export default withRouter(FileList);
