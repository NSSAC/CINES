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
import Checkbox from "@material-ui/core/Checkbox";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteMultiple from './DeleteMultiple';
import { confirmAlert } from 'react-confirm-alert';
import { MoveMultiple } from './MoveMultiple';
import './FileManager.css'

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
    var tokenData = null
    var token = localStorage.getItem('id_token');
    if (token)
        tokenData = instance.getTokenData()
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
    const [selected, setSelected] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [deleteAll, setDeleteAll] = useState(false);
    const [moveAll, setMoveAll] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);

    const handleCheckboxClick = (event, node, row) => {
        event !== null && event.stopPropagation();
        const selectedIndex = selected.indexOf(node);
        let newSelected = [];

        if(row){
           newSelected.push(node)
           setSelectedCount(1)
        }
       else{
        if (selectedIndex === -1) {
            setSelectedCount(selectedCount + 1)
            newSelected = newSelected.concat(selected, node);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            setSelectedCount(selectedCount - 1)
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            setSelectedCount(selectedCount - 1)
        } else if (selectedIndex > 0) {
            setSelectedCount(selectedCount - 1)
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }}
        setSelected(newSelected);
        if(newSelected.length === 1)
        dispatch(Actions.setSelectedItem(newSelected[0].id));
         
    };

    const handleAllCheckboxClick = (event, modifiedData) => {
        if (event.target.checked) {
            setSelected(modifiedData.map(n => n))
            setSelectedCount(modifiedData.length)
        }
        else {
            setSelected([selectedItem])
            setSelectedCount(1)
        }
    }

    function populateFiles(obj) {
        sessionStorage.removeItem('sortedFiles')

        if (obj === 'files') {
            setSearchResults(Object.values(files).slice().sort(function (firstUser, secondUser) {
                if (firstUser.update_date < secondUser.update_date) return 1;
                if (firstUser.update_date > secondUser.update_date) return -1;
                return 0;
            }))
            clearSort()
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

    const isSelected1 = node => selected.indexOf(node) !== -1

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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

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
                if (firstUser.name < secondUser.name) return 1;
                if (firstUser.name > secondUser.name) return -1;
                return 0;
            })) :
                setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                    if (firstUser.name > secondUser.name) return 1;
                    if (firstUser.name < secondUser.name) return -1;
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
                setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
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
                if (firstUser.type < secondUser.type) return 1;
                if (firstUser.type > secondUser.type) return -1;
                return 0;
            })) :
                setSearchResults(searchResults.slice().sort(function (firstUser, secondUser) {
                    if (firstUser.type > secondUser.type) return 1;
                    if (firstUser.type < secondUser.type) return -1;
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
        localStorage.setItem('selectedCount', selectedCount)
        selectedCount < 2 ? localStorage.setItem('checked', false) : localStorage.setItem('checked', true)
        selectedItem && dispatch(Actions.setSelectedItem(selectedItem))
        selectedItem && dispatch(Actions.setSelectedItem(selectedItem.id))
                // eslint-disable-next-line
    }, [selectedCount])

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
             setSelected([searchResults[0]])
             setSelectedCount(1)
        }
        localStorage.setItem('checked', false)

        if (document.getElementsByClassName('FileWrapper').length > 0)
            document.getElementsByClassName('FileWrapper')[0].scrollTo(0, 0)
    }, [searchResults])

    const handleDeleteAll = () => {
        setAnchorEl(null)
        confirmAlert({
            title: 'Confirm',
            message: `Are you sure you want to delete ${selectedCount} item(s)?`,
            buttons: [
                {
                    label: 'No',
                    onClick: (null)
                },
                {
                    label: 'Yes',
                    onClick: () => setDeleteAll(true)
                }
            ],
            closeOnClickOutside: false
        })
    }

    const handleMoveAll = () => {
        setMoveAll(true)
        setAnchorEl(false)
    }

    const closeMoveDialog = () => {
        setMoveAll(false)
    }

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
            selectedCount === 1 && handleCheckboxClick(evt,node,'row')
            setTimeout(() => {
                document.getElementsByClassName("sidebarScroll").length > 0 && document.getElementsByClassName("sidebarScroll")[2].scrollTo(0, 0)
            }, 0);
        }
    }

    if (!props.prompt && props.pageLayout.current) {
        props.pageLayout.current.toggleRightSidebar();
        props.setPrompt(true);
    }

    if ((props.containerFlag && props.isFolder) || props.targetMeta === '') {
        props.setPreview(true);
        var modifiedData = searchResults.filter((data) => {
            if (data.name !== "" && (props.search === "" || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase()) || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data;
            else return null;
        })
        if (Object.values(files).length > 0 && modifiedData.length > 0)
            return (
                <React.Fragment>
                    <FuseAnimate animation="transition.slideUpIn" delay={300}>
                        <Table stickyHeader className='fileTableStyle webkitSticky'>
                            <TableHead style={{ whiteSpace: 'nowrap' }}>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <div className='flex flex-col items-center justify-between'>
                                        <Tooltip title={`${modifiedData.length === selected.length ? 'Deselect All' : 'Select All'}`} placement="bottom">
                                            <Checkbox size='small'
                                                onClick={event =>
                                                    handleAllCheckboxClick(event, modifiedData)
                                                }
                                                className="selectCheckbox"
                                                checked={modifiedData.length === selected.length}
                                            />
                                        </Tooltip>
                                            {/* {selected.length > 0 && <span className="badge badge-light subcategory-count-badge">{selectedCount}</span>} */}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-64 w-64 p-0 text-center">
                                        {selected.length > 0 &&
                                            <React.Fragment>
                                                <Tooltip title="Selected items menu" placement="bottom">
                                                    <IconButton size='medium' onClick={event => handleClick(event)}>
                                                        <Icon >menu</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                                {selected.length > 0 && <span className="badge badge-light subcategory-count-badge">{selectedCount}</span>}
                                            </React.Fragment>}
                                        <div>
                                            <Menu
                                                id="simple-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseMenu}
                                            >
                                                <MenuItem onClick={handleDeleteAll} disabled={!token || (selected.some(selectedItem => token && tokenData.sub !== selectedItem.owner_id) || (tokenData.roles && tokenData.roles.indexOf('superadmin') !== -1))}>
                                                    <IconButton className='py-0 pl-0' style={{ pointerEvents: 'none' }}>
                                                        <Icon>delete</Icon>
                                                        {deleteAll && <DeleteMultiple selectedCount={selectedCount} selectedItems={selected} setDeleteAll={(p) => setDeleteAll(p)}></DeleteMultiple>}
                                                    </IconButton>   
                                                    Delete
                                                </MenuItem>
                                                <MenuItem style={{ height: '36px' }} onClick={() => handleMoveAll()} disabled={!token || (selected.some(selectedItem => token && tokenData.teams.filter(value => selectedItem.writeACL.includes(value)).length === 0 && tokenData.sub !== selectedItem.owner_id) || (tokenData.roles && tokenData.roles.indexOf('superadmin') !== -1))}>
                                                    <IconButton className='py-0 pl-0' style={{ pointerEvents: 'none' }}>
                                                        <Icon >compare_arrows</Icon>
                                                    </IconButton>
                                                    Move
                                                </MenuItem>
                                                {moveAll && <MoveMultiple
                                                    selectedCount={selectedCount} selectedItems={selected} setMoveAll={(p) => setMoveAll(p)}
                                                    showModal={moveAll}
                                                    handleClose={closeMoveDialog}
                                                />}
                                            </Menu>
                                        </div>
                                    </TableCell>
                                    <TableCell>Name{searchResults.some(result => result.name !== searchResults[0].name) ? ((sortByName) ?

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
                                    ) :
                                     <Tooltip title="Sort by Name" placement="bottom">
                                            <IconButton style={{visibility:'hidden'}} aria-label="arrow_downward" onClick={() => toggleSorting('desc', 'sortByName')}>
                                                <Icon className={sortNameFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    }</TableCell>
                                    <TableCell className="hidden sm:table-cell">Type{searchResults.some(result => result.type !== searchResults[0].type) && ((sortByType) ?

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
                                    )}</TableCell>
                                    <TableCell className="hidden sm:table-cell">Owner{searchResults.some(result => result.owner_id !== searchResults[0].owner_id) && ((sortByOwner) ?

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
                                    )}</TableCell>
                                    <TableCell className="text-center hidden sm:table-cell">Size{searchResults.some(result => result.size !== searchResults[0].size) && ((sortBySize) ?

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
                                    )}</TableCell>
                                    <TableCell className="hidden sm:table-cell">Modified{searchResults.some(result => result.update_date !== searchResults[0].update_date) && ((sortByDate) ?

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
                                    )}</TableCell>
                                    <Hidden lgUp><TableCell style={infoIcon}></TableCell></Hidden>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {searchResults.filter((data) => {
                                    if (data.name !== "" && (props.search === "" || (data.name.toLowerCase().includes(props.search.toLowerCase()) || data.type.toLowerCase().includes(props.search.toLowerCase()) || data.owner_id.toLowerCase().includes(props.search.toLowerCase())))) return data;
                                    else return null;
                                }).map((node) => {
                                    const isSelected = isSelected1(node);
                                    return (
                                        <TableRow
                                            role="checkbox"
                                            aria-checked={node.id === selectedItemId}
                                            key={node.id}
                                            hover
                                            onClick={onClickHandler(node, node.isContainer)}
                                            selected={node.id === selectedItemId}
                                            className="cursor-pointer fileRows"
                                        >
                                            <TableCell className="selectCheckbox" padding="checkbox">
                                                <Checkbox size='small'
                                                    onClick={event =>
                                                        handleCheckboxClick(event, node)
                                                    }
                                                    className="selectCheckbox"
                                                    checked={isSelected}
                                                />
                                            </TableCell>
                                            <TableCell className="max-w-64 w-64 p-0 text-center">
                                                <Icon className={clsx(classes.typeIcon, node.type)} />
                                            </TableCell>
                                            <TableCell >{window.innerWidth < 1224 ? <Link style={tableStyle} title={node.name} to={node.name}>{node.name}</Link> :
                                                <Link style={{ color: '#1565C0' }} title={node.name} to={node.name}>{node.name}</Link>}
                                            </TableCell>
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
                </React.Fragment>
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
