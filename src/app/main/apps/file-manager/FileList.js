import React, { useEffect, useState } from 'react';
import { Hidden, Typography, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Link, LinearProgress, Tooltip } from '@material-ui/core';
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
    const [sortByName, setSortByName] = useState(false);
    const [sortNameFlag, setSortNameFlag] = useState(false);
    const [sortByDate, setSortByDate] = useState(false);
    const [sortDateFlag, setSortDateFlag] = useState(true);
    const [sortBySize, setSortBySize] = useState(false);
    const [sortSizeFlag, setSortSizeFlag] = useState(false);
    const [sortByType, setSortByType] = useState(false);
    const [sortTypeFlag, setSortTypeFlag] = useState(false);
    const [sortByOwner, setSortByOwner] = useState(false);
    const [sortOwnerFlag, setSortOwnerFlag] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    function populateFiles(obj) {
        sessionStorage.removeItem('sortedFiles')

        if (obj === 'files') {
            setSearchResults(Object.values(files).slice().sort(function (firstUser, secondUser) {
                if (firstUser.update_date < secondUser.update_date) return 1;
                if (firstUser.update_date > secondUser.update_date) return -1;
                return 0;
            }))
            clearSort()
            props.setSearchbool(false)
        }
        else {
            setSearchResults(searchResults)
        }
    }

    function clearSort() {
        setSortNameFlag(false)
        setSortDateFlag(true)
        setSortTypeFlag(false)
        setSortSizeFlag(false)
        setSortOwnerFlag(false)
        setSortByName(false)
        setSortByDate(false)
        setSortBySize(false)
        setSortByType(false)
        setSortByOwner(false)

    }

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

    const toggleSorting = (sortType, toggleArrow) => {
        if (toggleArrow === 'sortByName') {
            setSortNameFlag(true)
            setSortDateFlag(false)
            setSortTypeFlag(false)
            setSortSizeFlag(false)
            setSortOwnerFlag(false)
            setSortByName(!sortByName)
            setSortByDate(false)
            setSortBySize(false)
            setSortByType(false)
            setSortByOwner(false)

            sortType === 'asc' ? setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                if (firstUser.name.toLowerCase() < secondUser.name.toLowerCase()) return 1;
                if (firstUser.name.toLowerCase() > secondUser.name.toLowerCase()) return -1;
                return 0;
            })) :
                setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                    if (firstUser.name.toLowerCase() > secondUser.name.toLowerCase()) return 1;
                    if (firstUser.name.toLowerCase() < secondUser.name.toLowerCase()) return -1;
                    return 0;
                }));
        }

        if (toggleArrow === 'sortByDate') {
            setSortNameFlag(false)
            setSortDateFlag(true)
            setSortTypeFlag(false)
            setSortSizeFlag(false)
            setSortOwnerFlag(false)
            setSortByName(false)
            setSortByDate(!sortByDate)
            setSortBySize(false)
            setSortByType(false)
            setSortByOwner(false)

            sortType === 'asc' ? setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                if (firstUser.update_date < secondUser.update_date) return 1;
                if (firstUser.update_date > secondUser.update_date) return -1;
                return 0;
            })) :
                setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                    if (firstUser.update_date > secondUser.update_date) return 1;
                    if (firstUser.update_date < secondUser.update_date) return -1;
                    return 0;
                }));
        }

        if (toggleArrow === 'sortBySize') {
            setSortNameFlag(false)
            setSortDateFlag(false)
            setSortTypeFlag(false)
            setSortSizeFlag(true)
            setSortOwnerFlag(false)
            setSortByName(false)
            setSortByDate(false)
            setSortBySize(!sortBySize)
            setSortByType(false)
            setSortByOwner(false)

            sortType === 'asc' ?
                setSearchResults(searchResults.sort(function (firstUser, secondUser) {
                    if (firstUser.size === undefined) {
                        firstUser.size = null
                    }
                    if (secondUser.size === undefined) {
                        secondUser.size = null
                    }

                    if (firstUser.size < secondUser.size) return 1;
                    if (firstUser.size > secondUser.size) return -1;
                    return 0;

                }))

                :
                setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                    if (firstUser.size === undefined) {
                        firstUser.size = null
                    }
                    if (secondUser.size === undefined) {
                        secondUser.size = null
                    }
                    if (firstUser.size > secondUser.size) return 1;
                    if (firstUser.size < secondUser.size) return -1;
                    return 0;
                }));
        }

        if (toggleArrow === 'sortByType') {
            setSortNameFlag(false)
            setSortDateFlag(false)
            setSortTypeFlag(true)
            setSortSizeFlag(false)
            setSortOwnerFlag(false)
            setSortByName(false)
            setSortByDate(false)
            setSortBySize(false)
            setSortByType(!sortByType)
            setSortByOwner(false)

            sortType === 'asc' ? setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                if (firstUser.type.toLowerCase() < secondUser.type.toLowerCase()) return 1;
                if (firstUser.type.toLowerCase() > secondUser.type.toLowerCase()) return -1;
                return 0;
            })) :
                setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                    if (firstUser.type.toLowerCase() > secondUser.type.toLowerCase()) return 1;
                    if (firstUser.type.toLowerCase() < secondUser.type.toLowerCase()) return -1;
                    return 0;
                }));
        }

        if (toggleArrow === 'sortByOwner') {
            setSortNameFlag(false)
            setSortDateFlag(false)
            setSortTypeFlag(false)
            setSortSizeFlag(false)
            setSortOwnerFlag(true)
            setSortByName(false)
            setSortByDate(false)
            setSortBySize(false)
            setSortByType(false)
            setSortByOwner(!sortByOwner)

            sortType === 'asc' ? setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                if (firstUser.owner_id < secondUser.owner_id) return 1;
                if (firstUser.owner_id > secondUser.owner_id) return -1;
                return 0;
            })) :
                setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                    if (firstUser.owner_id > secondUser.owner_id) return 1;
                    if (firstUser.owner_id < secondUser.owner_id) return -1;
                    return 0;
                }));
        }
    }


    useEffect(() => {
        if (sessionStorage.getItem('sortedFiles') === 'true')
            populateFiles('search')
        else
            populateFiles('files')

        setTimeout(() => {
            setSpinnerFlag(false)
        }, 5000);

        if (document.getElementsByClassName('FileWrapper').length > 0)
            document.getElementsByClassName('FileWrapper')[0].scrollTo(0, 0)

        // eslint-disable-next-line
    }, [files])

    useEffect(() => {
        populateFiles('search')
        if (document.getElementsByClassName("fileRows").length > 0)
            document.getElementsByClassName("fileRows")[0].click()
        // eslint-disable-next-line
    }, [props.search])

    useEffect(() => {
        if (searchResults.length > 0) {
            if (document.getElementsByClassName("fileRows").length > 0)
                document.getElementsByClassName("fileRows")[0].click()
        }
    }, [searchResults])

    function onClickHandler(node, canLink) {
        return function (evt) {
            if (evt.detail === 1)
                if (evt.target && evt.target.getAttribute("to")) {
                    if (node.type === "folder" || node.type === "epihiperOutput" || node.type === "epihiper_multicell_analysis") {
                        var target = window.location.pathname + evt.target.getAttribute("to") + "/";
                        // clearSort()
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

                    if (selectedItem.public === true)
                        localStorage.setItem('readPermission', true);

                    props.history.push(target);
                }
            dispatch(Actions.setSelectedItem(node.id));
            setTimeout(() => {
                document.getElementsByClassName("sidebarScroll")[2].scrollTo(0,0)
            }, 0);
        }
    }

    if (!props.prompt && props.pageLayout.current) {
        props.pageLayout.current.toggleRightSidebar();
        props.setPrompt(true);
    }

    if ((props.containerFlag && props.isFolder) || props.targetMeta === '') {
        props.setPreview(true);
        if (Object.values(files).length > 0 && searchResults.filter((data) => {
            if (data.name !== "" && (props.search === "" || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase()) || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data;
            else return null;
        }).length > 0)
            return (
                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                    <Table className='fileTableStyle'>
                        <TableHead style={{ whiteSpace: 'nowrap' }}>
                            <TableRow>
                                <TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>
                                <TableCell>Name{(sortByName) ?

                                    <Tooltip title="Sort by Name" placement="bottom">
                                        <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('asc', 'sortByName')}>
                                            <Icon >arrow_upward</Icon>
                                        </IconButton>
                                    </Tooltip>

                                    :
                                    <Tooltip title="Sort by Name" placement="bottom">
                                        <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('desc', 'sortByName')}>
                                            <Icon className={sortNameFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                    </Tooltip>
                                }</TableCell>
                                <TableCell className="hidden sm:table-cell">Type{(sortByType) ?

                                    <Tooltip title="Sort by Type" placement="bottom">
                                        <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('asc', 'sortByType')}>
                                            <Icon >arrow_upward</Icon>
                                        </IconButton>
                                    </Tooltip>

                                    :
                                    <Tooltip title="Sort by Type" placement="bottom">
                                        <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('desc', 'sortByType')}>
                                            <Icon className={sortTypeFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                    </Tooltip>
                                }</TableCell>
                                <TableCell className="hidden sm:table-cell">Owner{(sortByOwner) ?

                                    <Tooltip title="Sort by Owner" placement="bottom">
                                        <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('asc', 'sortByOwner')}>
                                            <Icon >arrow_upward</Icon>
                                        </IconButton>
                                    </Tooltip>

                                    :
                                    <Tooltip title="Sort by Owner" placement="bottom">
                                        <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('desc', 'sortByOwner')}>
                                            <Icon className={sortOwnerFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                    </Tooltip>
                                }</TableCell>
                                <TableCell className="text-center hidden sm:table-cell">Size{(sortBySize) ?

                                    <Tooltip title="Sort by Size" placement="bottom">
                                        <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('asc', 'sortBySize')}>
                                            <Icon >arrow_upward</Icon>
                                        </IconButton>
                                    </Tooltip>

                                    :
                                    <Tooltip title="Sort by Size" placement="bottom">
                                        <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('desc', 'sortBySize')}>
                                            <Icon className={sortSizeFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                    </Tooltip>
                                }</TableCell>
                                <TableCell className="hidden sm:table-cell">Modified{(sortByDate) ?

                                    <Tooltip title="Sort by Date" placement="bottom">
                                        <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('asc', 'sortByDate')}>
                                            <Icon >arrow_upward</Icon>
                                        </IconButton>
                                    </Tooltip>

                                    :
                                    <Tooltip title="Sort by Date" placement="bottom">
                                        <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('desc', 'sortByDate')}>
                                            <Icon className={sortDateFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                    </Tooltip>
                                }</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {searchResults.filter((data) => {
                                if (data.name !== "" && (props.search === "" || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase()) || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data;
                                else return null;
                            }).map((node) => {
                                return (
                                    <TableRow
                                        key={node.id}
                                        hover
                                        onClick={onClickHandler(node, node.isContainer)}
                                        selected={node.id === selectedItemId}
                                        className="cursor-pointer fileRows"
                                    >
                                        <TableCell className="max-w-64 w-64 p-0 text-center">
                                            <Icon className={clsx(classes.typeIcon, node.type)} />
                                        </TableCell>
                                        <TableCell >{window.innerWidth < 1224 ? <Link style={tableStyle} title={node.name} to={node.name}>{node.name}</Link> :
                                            <Link style={{ color: '#1565C0' }} title={node.name} to={node.name}>{node.name}</Link>}</TableCell>
                                        <TableCell className="hidden sm:table-cell wordBreak">{node.type}</TableCell>
                                        <TableCell className="hidden sm:table-cell wordBreak">{node.owner_id}</TableCell>
                                        <TableCell className="text-center hidden sm:table-cell wordBreak">{(!node.size && (node.size !== 0)) ? '-' : filesize(node.size)}</TableCell>
                                        <TableCell className="hidden sm:table-cell wordBreak">{moment.utc(node.update_date).local().fromNow()}</TableCell>
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

        else if (searchResults.filter((data) => {
            if (data.name !== "" && (props.search === "" || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase()) || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data;
            else return null;
        }).length === 0 && props.search !== '')
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
