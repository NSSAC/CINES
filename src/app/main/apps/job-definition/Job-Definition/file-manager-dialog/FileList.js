import React, { useEffect } from 'react';
import { Typography, Icon, Table, TableBody, TableCell, TableHead, TableRow, Link } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import filesize from 'filesize'
import { makeStyles } from "@material-ui/styles";
import clsx from 'clsx';
import * as Actions from './store/actions';
import './FileManagerDialog.css'

const useStyles = makeStyles({
    typeIcon: {
        '&.folder:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.epihiperOutput:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.csonnet_simulation_container:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.pdf:before': {
            content: "'picture_as_pdf'",
            color: 'red'
        },
        '&.epihiper_multicell_analysis:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.png:before': {
            content: "'image'",
            color: 'blue'
        },
        '&.jpg:before': {
            content: "'image'",
            color: 'blue'
        },
        '&.jpeg:before': {
            content: "'image'",
            color: 'blue'
        },
        '&.mp3:before': {
            content: "'library_music'",
            color: 'blue'
        },
        '&.mp4:before': {
            content: "'video_library'",
            color: 'blue'
        },
        '&.csv:before': {
            content: "'table_chart'",
            color: '#4CAF50'
        },
        '&.excel:before': {
            content: "'table_chart'",
            color: '#4CAF50'
        },
        '&:before': {
            content: "'insert_drive_file'",
            color: '#1565C0'
        }
    }
});


function Filelist(props) {

    const files = useSelector(({ fMApp }) => {
        if (!props.fileManager) { return fMApp.home }
        return fMApp.files
    });
    const selectedItemId = useSelector(({ fMApp }) => fMApp.selectedItemId);
    const selectedItem = useSelector(({ fMApp }) => files[fMApp.selectedItemId]);
    const classes = useStyles();
    const dispatch = useDispatch()

    const nameStyle = {
        overflow: 'hidden',
        maxWidth: '200px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }

    var searchResults = Object.values(files).filter((data) => {
        var reqType = false
        for (var f in props.fileTypes) {
            if (data.type === props.fileTypes[f] || data.type === "folder" || data.type === "epihiperOutput" || data.type === "epihiper_multicell_analysis" || data.type === "csonnet_simulation_container") {
                reqType = true;
                break;
            }
        }
        if (data.name !== "" && reqType && (props.search === "" || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase()) || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data; return null
    })


    useEffect(() => {
        var flag = 0;
        var i = 0;
        for (i = 0; i < props.fileTypes.length; i++) {
            if (document.getElementById('selectFile') && selectedItem && (selectedItem.type === props.fileTypes[i])) {
                document.getElementById('selectFile').classList.remove('buttonDisabled');
                flag = 1;
            }
        }
        if (flag === 0){
            document.getElementById('selectFile').classList.add('buttonDisabled');
            // if(document.getElementsByClassName('tableStyle').length > 0)
            // document.getElementsByClassName('tableStyle')[0].scrollTo(0,0)
        }

    });

    useEffect(()=>{
        if(document.getElementsByClassName('tableStyle').length > 0)
            document.getElementsByClassName('tableStyle')[0].scrollTo(0,0)
    },[files])

    function onClickHandler(node, canLink) {
        // props.setSearch("")
        return function (evt) {
            if (evt.detail === 1)
                if (evt.target && evt.target.getAttribute("to")) {
                    if (node.type === "folder" || node.type === "epihiperOutput" || node.type === "epihiper_multicell_analysis" || node.type === "csonnet_simulation_container") {
                        props.setTargetPath(props.targetPath + evt.target.getAttribute("to") + "/")
                        setTimeout(() => {
                            props.setSearch("")
                        }, 1000);
                    }
                }
            dispatch(Actions.setSelectedItem(node.id))

        }
    }

    if (Object.values(files).length > 0 && searchResults.length > 0) {
        return (
            <div className='tableStyle'>
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
                            {searchResults.map((node) => {
                                return (
                                    <TableRow
                                        key={node.id}
                                        hover
                                        onClick={onClickHandler(node, node.isContainer)}
                                        selected={node.id === selectedItemId}
                                        className="cursor-pointer"
                                    >
                                        <TableCell className="max-w-64 w-64 p-0 text-center">
                                            <Icon className={clsx(classes.typeIcon, node.type)} />
                                        </TableCell>
                                        <TableCell title={node.name} style={nameStyle} >{node.type === "folder" || node.type === "epihiperOutput" || node.type === "epihiper_multicell_analysis" || node.type === "csonnet_simulation_container" ? <Link style={{ color: '#61dafb' }} title={node.name} to={node.name}>{node.name}</Link> :
                                            node.name}</TableCell>
                                        <TableCell>{node.type}</TableCell>
                                        <TableCell>{node.owner_id}</TableCell>
                                        <TableCell className="text-center">{(!node.size && (node.size !== 0)) ? '-' : filesize(node.size)}</TableCell>
                                        <TableCell>{moment.utc(node.update_date).local().fromNow()}</TableCell>
                                    </TableRow>
                                );

                            })}
                        </TableBody>
                    </Table>
                </FuseAnimate>
            </div>
        )
    }

    else if (Object.values(files).length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-20">
                <Typography className="text-13 mt-16" color="textPrimary">This folder is empty.</Typography>
            </div>
        )
    }

    else if (searchResults.length === 0 && props.search !== "") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-20">
                <Typography className="text-13 mt-16" color="textPrimary">No match found for "{props.search}". Please try finding something else.</Typography>
            </div>
        )
    }

    else if (props.fileTypes[0]==="folder") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-20">
                <Typography className="text-13 mt-16" color="textPrimary">This folder does not contain any folders.</Typography>
            </div>
        )
    }

    else return null;
}

export default Filelist;