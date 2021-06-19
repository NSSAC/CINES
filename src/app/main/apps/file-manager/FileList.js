import React, { useEffect, useState } from 'react';
import { Hidden, Typography, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Link, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import * as Actions from './store/actions';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import filesize from 'filesize';
import Preview from './Preview'
import instance from 'app/services/sciductService/sciductService.js'

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

function FileList(props) {
    const dispatch = useDispatch();
    const files = useSelector(({ fileManagerApp }) => fileManagerApp.files);
    const selectedItemId = useSelector(({ fileManagerApp }) => fileManagerApp.selectedItemId);
    const selectedItem = useSelector(({ fileManagerApp }) => files[fileManagerApp.selectedItemId]);
    const classes = useStyles();
    const [spinnerFlag, setSpinnerFlag] = useState(true);
    var token = localStorage.getItem('id_token');

    var searchResults = Object.values(files).filter((data) => {
        if (data.name !== "" && (props.search === "" || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase()) || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data;
        else return null;
    })

    if (props.containerFlag || props.targetMeta === '') {
        if (!selectedItem && searchResults[0]) {
            if (Object.values(files).length > 0 && (searchResults[0].id !== undefined)) {
                dispatch(Actions.setSelectedItem(searchResults[0].id));
            }
        }
    }

    const infoIcon = {
        right: '0',
        backgroundColor: '#eeeeee',
        position: 'sticky',
        width: '15px',
    }

    const tableStyle = {
        overflow: 'hidden',
        maxWidth: '200px',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        color: '#1565C0'
    }


    useEffect(() => {
        setTimeout(() => {
            setSpinnerFlag(false)
        }, 5000);

        if (document.getElementsByClassName('FileWrapper').length > 0)
            document.getElementsByClassName('FileWrapper')[0].scrollTo(0, 0)
    }, [files])

    function onClickHandler(node, canLink) {
        return function (evt) {
            if (evt.detail === 1)
                if (evt.target && evt.target.getAttribute("to")) {
                    if (node.type === "folder" || node.type === "epihiperOutput" || node.type === "epihiper_multicell_analysis") {
                        var target = window.location.pathname + evt.target.getAttribute("to") + "/";
                    }
                    else {
                        target = window.location.pathname + evt.target.getAttribute("to");
                        props.setPreview(false)
                        localStorage.setItem('nodeType', node.type);
                        localStorage.setItem('nodeId', node.id);
                        localStorage.setItem('nodeSize', node.size);
                        localStorage.setItem('nodeName', node.name);


                        if (token !== null) {
                            var canRead = false;
                            for (var team in instance.getTokenData().teams) {
                                for (var readRights in node.readACL) {
                                    if (team === readRights) {
                                        canRead = true;
                                        localStorage.setItem('readPermission', true);
                                        break;
                                    }
                                }
                                for (var writeRights in node.writeACL) {
                                    if (team === writeRights) {
                                        canRead = true;
                                        localStorage.setItem('readPermission', true);
                                        break;
                                    }
                                }
                            }
                            if (instance.getTokenData().sub === node.owner_id) {
                                canRead = true;
                                localStorage.setItem('readPermission', true);
                            }
                            if (instance.getTokenData().roles.indexOf('superadmin') !== -1) {
                                canRead = true;
                                localStorage.setItem('readPermission', true);
                            }
                            if (canRead === false) {
                                localStorage.setItem('readPermission', false);
                            }
                        }
                        else {
                            localStorage.setItem('readPermission', false);
                        }
                    }

                    if(selectedItem.public === true)
                        localStorage.setItem('readPermission', true);

                    props.history.push(target);
                }
            dispatch(Actions.setSelectedItem(node.id));
        }
    }

    if (!props.prompt && props.pageLayout.current) {
        props.pageLayout.current.toggleRightSidebar();
        props.setPrompt(true);
    }

    if ((props.containerFlag && props.isFolder) || props.targetMeta === '') {
        props.setPreview(true);
        if (Object.values(files).length > 0 && searchResults.length > 0)
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
                                        <TableCell >{window.innerWidth < 1224 ? <Link style={tableStyle} title={node.name} to={node.name}>{node.name}</Link> :
                                            <Link style={{ color: '#1565C0' }} title={node.name} to={node.name}>{node.name}</Link>}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{node.type}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{node.owner_id}</TableCell>
                                        <TableCell className="text-center hidden sm:table-cell">{(!node.size && (node.size !== 0)) ? '-' : filesize(node.size)}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{moment.utc(node.update_date).local().fromNow()}</TableCell>
                                        <Hidden lgUp>
                                            <TableCell style={infoIcon}>
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

        else if (spinnerFlag === true) {
            return (
                <div className="flex flex-1 flex-col items-center justify-center mt-40">
                    <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                    <LinearProgress className="w-xs" color="secondary" />
                </div>
            )
        }

        else if (Object.values(files).length === 0) {
            if (props.containerFlag === "error-unknown") {
                return (
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <Typography className="text-20 mt-16" color="textPrimary">An error occured. Please try again.</Typography>
                    </div>
                )
            }

            else if (props.containerFlag === "error-404") {
                return (
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <Typography className="text-20 mt-16" color="textPrimary">No such file / folder exists.</Typography>
                    </div>
                )
            }

            else
                return (
                    <div className="flex flex-1 flex-col items-center justify-center mt-20">
                        <Typography className="text-18 mt-16" color="textPrimary">The folder is empty.</Typography>
                    </div>
                )
        }

        else if (searchResults.length === 0 && props.search !== '')
            return (
                <div className="flex flex-1 flex-col items-center justify-center mt-20">
                    <Typography className="text-18 mt-16" color="textPrimary">No match found for "{props.search}". Please try finding something else.</Typography>
                </div>
            )

        else return null


    }
    else if (props.containerFlag === false) {
        var type = localStorage.getItem('nodeType')
        var id = localStorage.getItem('nodeId')
        var size = localStorage.getItem('nodeSize')
        var name = localStorage.getItem('nodeName')
        var readPermission = localStorage.getItem('readPermission')
        props.setPreview(false)
        if (id !== null)
            return (
                <Preview type={type} fileId={id} size={size} perm={readPermission} name={name} ></Preview>
            )
        else return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>

        )
    }

    else if (props.containerFlag === "") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>
        )
    }

    else if (props.containerFlag === "error-unknown") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Typography className="text-20 mt-16" color="textPrimary">An error occured. Please try again.</Typography>
            </div>
        )
    }

    else if (props.containerFlag === "error-404") {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Typography className="text-20 mt-16" color="textPrimary">No such file / folder exists.</Typography>
            </div>
        )
    }

    else return null;
}

export default withRouter(FileList);
