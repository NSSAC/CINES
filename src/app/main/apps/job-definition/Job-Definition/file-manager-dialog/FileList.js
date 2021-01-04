import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import React, { useState, useRef, useEffect } from 'react';
import {Hidden, Typography, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow,Link} from '@material-ui/core';
import {FuseAnimate} from '@fuse';
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import filesize from 'filesize'
import { makeStyles } from "@material-ui/styles";
import clsx from 'clsx';
import * as Actions from './store/actions';
import './FileManagerDialog.css'

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


function Filelist(props) {
    
    const files = useSelector(({fMApp}) => fMApp.files);
    const selectedItemId = useSelector(({fMApp}) => fMApp.selectedItemId);
    const selectedItem = useSelector(({fMApp}) => files[fMApp.selectedItemId]);
    const classes = useStyles();
    const dispatch = useDispatch()
    const [click, setClick] = useState(false);

    const tableStyle={
        overflow:'auto',
        maxHeight:'400px',
        backgroundColor:'black',
        borderRadius:'10px'
        // marginTop:'15px',

    }
    const nameStyle={
        overflow: 'hidden',
        maxWidth: '200px',
        textOverflow: 'ellipsis',
        // display:'inline-block',
        whiteSpace: 'nowrap'
    }

    var searchResults = Object.values(files).filter((data)=>{
        if(data.name !== "" && (props.search === ""  || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase())  || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data })
  

    useEffect(() => {
        var flag=0;
        var i=0;
        for (i=0;i<props.fileTypes.length;i++){
        if(document.getElementById('selectFile') && selectedItem && (selectedItem.type == props.fileTypes[i]))  {
          document.getElementById('selectFile').classList.remove('buttonDisabled');
          flag=1;
        }}
        if(flag == 0)
          document.getElementById('selectFile').classList.add('buttonDisabled');

    
    });

    function onClickHandler(node,canLink){
        // props.setSearch("")
        return function(evt){
            if(click === false)
            if (evt.target && evt.target.getAttribute("to") ){
                setClick(true)
                setTimeout(() => {
                   setClick(false)
                }, 1500);
                if(node.type === "folder" || node.type === "epihiperOutput" || node.type === "epihiper_multicell_analysis"){
                    props.setTargetPath(props.targetPath  + evt.target.getAttribute("to") + "/") 
                    setTimeout(() => {
                        props.setSearch("")
                    }, 1000);
                }
            }
            dispatch(Actions.setSelectedItem(node.id))

        }
    }

    if(Object.values(files).length > 0 && searchResults.length > 0){
    return (
        <div style={tableStyle}>
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
                  <Table >
                      <TableHead>
                          <TableRow>
                              <TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>Owner</TableCell>
                              <TableCell className="text-center">Size</TableCell>
                              <TableCell>Modified</TableCell>
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
                                        <TableCell title={node.name} style={nameStyle} >{node.type === "folder" || node.type === "epihiperOutput" || node.type === "epihiper_multicell_analysis"?<Link style={{color:'#61dafb'}} title={node.name} to={node.name}>{node.name}</Link>:
                                                                            node.name}</TableCell>
                                        <TableCell>{node.type}</TableCell>
                                        <TableCell>{node.owner_id}</TableCell>
                                        <TableCell className="text-center">{(!node.size && (node.size!==0))? '-' : filesize(node.size)}</TableCell>
                                        <TableCell>{moment(node.update_date).fromNow()}</TableCell>
                                    </TableRow>
                                );

                            })}
                        </TableBody>
                  </Table>
          </FuseAnimate>
        </div>
    )}

    else if(Object.values(files).length === 0){              
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-20">
            <Typography className="text-13 mt-16" color="textPrimary">This folder is empty.</Typography>
            </div>
        )             
}

else if(searchResults.length  === 0){
return (
    <div className="flex flex-1 flex-col items-center justify-center mt-20">
    <Typography className="text-13 mt-16" color="textPrimary">No match found for "{props.search}". Please try finding something else.</Typography>
    </div>
)
 }
}

export default Filelist;