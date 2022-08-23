import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import ReactDOM from "react-dom";

import { Button, Hidden, Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Tooltip, Typography } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { toast } from "material-react-toastify";

import { FuseAnimate } from '@fuse';

import JobData from './JobData';
import * as Actions from './store/actions';

import './FileList.css';
import 'fix-date';
// import { first } from 'lodash';

function MyJobsFileList(props) {
    const dispatch = useDispatch();
    const files1 = useSelector(({ myJobsApp }) => myJobsApp.myjobs, shallowEqual);
    var files = Object.values(files1);
    var selectedItem = useSelector(({ myJobsApp }) => myJobsApp.selectedjobid);
    var onloadSpinner = false;
    var path = window.location.pathname;
    var totalRecords;
    
    const [selectedId, setSelectedId] = useState();
    const [dataSpinner, setDataSpinner] = useState(true);
    const [page, setPage] = React.useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [userSelectedPage, setUserSelectedPage] = useState(1);
    const [sortById, setsortById] = useState(false);
    const [sortByjobdef, setsortByjobdef] = useState(false);
    const [sortByOutputName, setSortByOutputName] = useState(false)
    const [sortIdFlag, setSortIdFlag] = useState(false);
    const [sortByjobdefFlag, setSortByjobdefFlag] = useState(false);
    const [sortByOutputNameFlag,setSortByOutputNameFlag] = useState(false);
    const [sortBystateFlag, setSortBystateFlag] = useState(false);
    const [sortByCreationDdateFlag, setSortByCreationDdateFlag] = useState(true);
    const [sortByCreationDdate, setsortByCreationDdate] = useState(false)
    const [sortBystate, setsortBystate] = useState(false);
    const [rowsPerPage] = useState(10);
    const [spinnerFlag, setSpinnerFlag] = useState(true);
    const [selectedFlag, setSelectedFlag] = useState(true);
    const [sortCount, setSortCount] = useState(false);
    // const [showRange, setShowRange] = useState(false);
    const [firstFileId, setFirstFileId] = useState("");
    const [wrongPageSelectedFlag, setWrongPageSelectedFlag] = useState(false);
    const [goToButtonDisabled, setGoToButtonDisabled] = useState(false);
    var type;
    // var rowLength = 10;

    // For mobile-devices
    const matches = useMediaQuery("(min-width:600px)");

    if (dataSpinner === true) {
        setTimeout(() => {
            setDataSpinner(false)
        }, 3000);
    }

    else if (files.length !== 0) {
        if (files[2]['content-range'] !== undefined) {
            totalRecords = Number(files[2]['content-range'].split('/')[1])
        }
        files = files[1]
        onloadSpinner = true;
        if (selectedId === undefined && files.length > 0 && path.endsWith('my-jobs/') === true && props.changeState === 0) {
            dispatch(Actions.setSelectedItem(files[0].id));
        }

        if (files.length > 0) {
            var i;
            for (i = 0; i < files.length; i++) {
                var t = new Date(files[i].creation_date)
                var date = ('0' + t.getDate()).slice(-2);
                var month = ('0' + (t.getMonth() + 1)).slice(-2);
                var year = t.getFullYear();
                var hours = ('0' + t.getHours()).slice(-2);
                var minutes = ('0' + t.getMinutes()).slice(-2);
                var seconds = ('0' + t.getSeconds()).slice(-2);
                var tempDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
                files[i].creation_date = tempDate
            }
        }

    }

    const infoIcon = {
        right: '0',
        backgroundColor: 'whitesmoke',
        position: 'sticky',
        width: '100px'
    }

    const selectButtonStyle = {
        backgroundColor: "#122230",
        fontSize: "12.5px",
        marginLeft: "5px",
      };
      
    const selectButtonStyleMob = {
        backgroundColor: "#122230",
        fontSize: '11.5px',
        minWidth: '38px'
      };

    useEffect(() => {
        if (files.length > 0 && sortCount === false) {
          if (document.getElementsByClassName("jobRows").length > 0)
            document.getElementsByClassName("jobRows")[0].click();
        }
      }, [files.length, page, sortCount]);
    
      // To make the 1st row element selected and show its meta-data
      useEffect(() => {
        if (Array.isArray(files) && files.length > 0) setFirstFileId(files[0].id);
      }, [files]);
    
      useEffect(() => {
          console.log(firstFileId);
        if (document.getElementsByClassName("jobRows").length > 0) {
            document.getElementsByClassName("jobBody")[0].scrollIntoView();
            document.getElementsByClassName("jobRows")[0].click();
        }
      }, [firstFileId]);

    useEffect(() => {
        setSpinnerFlag(false)
        if (JSON.parse(sessionStorage.getItem("resetPage"))) {
            setPage(1);
            setCurrentPage(1);
            setUserSelectedPage(1);
            setWrongPageSelectedFlag(false);
        }

        if (files.length > 0 && selectedFlag) {
            setSelectedId(files[0].id)
        }

        if (files.length > 0) {
            var i, changeState = false, cancelledState = false;
            var cancelledJob = localStorage.getItem("cancelledJob")
            for (i = 0; i < files.length; i++) {
                if (files[i].state !== 'Completed' && files[i].state !== 'Failed' && files[i].state !== 'Cancelled') {
                    changeState = true;
                }
            }
            if (cancelledJob === null)
                cancelledState = true;
            else {
                for (i = 0; i < files.length; i++) {
                    if (files[i].id === cancelledJob) {
                        cancelledState = true;
                        if (files[i].state === 'Completed' || files[i].state === 'Failed' || files[i].state === 'Cancelled')
                            localStorage.removeItem("cancelledJob")
                        break;
                    }
                }
            }
            const timer_selectedItem = setInterval(() => {
                selectedItem && selectedItem.state !== 'Completed' && selectedItem.state !== 'Failed' && selectedItem.state !== 'Cancelled' && dispatch(Actions.setSelectedItem(selectedId));
            }, 8000);

            const timer_jobList = setInterval(() => {
                if (changeState || !cancelledState) {
                    props.setChangeState(props.changeState + 1);
                    cancelledState && setSortCount(true)
                }
                setTimeout(() => {
                    setSortCount(false);
                }, 2000);
            }, 8000);

            return () => {
                clearInterval(timer_jobList);
                clearInterval(timer_selectedItem);
            }
        }

    },[dispatch, files, props, selectedFlag, selectedId, selectedItem])

    useEffect(() => {
        if (userSelectedPage === "" || Number(userSelectedPage) === currentPage) {
          setGoToButtonDisabled(true);
        } else {
          setGoToButtonDisabled(false);
        }
    }, [currentPage, userSelectedPage]);

    const handleChangePage = (event, value) => {
        setSpinnerFlag(true);
        setPage(value);
        setCurrentPage(value);
        sessionStorage.setItem("resetPage", JSON.stringify(false))    
        fetchNextSetData(value);
        setUserSelectedPage(value);
    };

    const onPageChange = (event) => {
        setWrongPageSelectedFlag(false);
        setUserSelectedPage(event.target.value);
    };

    useEffect(() => {
        setWrongPageSelectedFlag(false);
      }, [currentPage, userSelectedPage]);

    const onKeyDownPageChange = (event) => {
        if (!matches && event.key === "Enter") {
          if (userSelectedPage) {
            handleSelectedPageClick();
          } else {
            setWrongPageSelectedFlag(true);
            setUserSelectedPage(currentPage);
          }
        }
      };
    
      const isNumberValidation = (input) => {
        return /^-?[\d]+(?:e-?\d+)?$/.test(input);
      };
    
      const handleSelectedPageClick = () => {
        if (userSelectedPage) {
          if (
            Number(userSelectedPage) > Math.ceil(totalRecords / rowsPerPage) ||
            Number(userSelectedPage) < 1 ||
            isNumberValidation(userSelectedPage) !== true
          ) {
            setWrongPageSelectedFlag(true);
            setUserSelectedPage(currentPage);
          } else {
            setCurrentPage(Number(userSelectedPage));
            handleChangePage(undefined, Number(userSelectedPage));
          }
        }
      };

    const toggleSorting = (sortType, toggleArrow) => {
        let sortOrder = "";
        setWrongPageSelectedFlag(false);
        if (toggleArrow === 'sortByjobdef') {
            setSortIdFlag(false)
            setSortByjobdefFlag(true)
            setSortByOutputNameFlag(false)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(false)

            setsortByCreationDdate(false)
            setsortById(false)
            setsortBystate(false)
            setSortByOutputName(false)
            setsortByjobdef(!sortByjobdef)
            sortOrder = sortByjobdef
        }
        else if (toggleArrow === 'sortByOutputName') {
            setSortIdFlag(false)
            setSortByjobdefFlag(false)
            setSortByOutputNameFlag(true)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(false)

            setsortByCreationDdate(false)
            setsortById(false)
            setsortBystate(false)
            setSortByOutputName(!sortByOutputName)
            setsortByjobdef(false)
            sortOrder = sortByOutputName
        }
        else if (toggleArrow === 'sortBystate') {
            setSortIdFlag(false)
            setSortByjobdefFlag(false)
            setSortByOutputNameFlag(false)
            setSortBystateFlag(true)
            setSortByCreationDdateFlag(false)

            setsortByjobdef(false)
            setSortByOutputName(false)
            setsortByCreationDdate(false)
            setsortById(false)
            setsortBystate(!sortBystate)
            sortOrder = sortBystate
        }
        else if (toggleArrow === 'sortByCreationDdate') {
            setSortIdFlag(false)
            setSortByjobdefFlag(false)
            setSortByOutputNameFlag(false)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(true)

            setsortByjobdef(false)
            setSortByOutputName(false)
            setsortById(false)
            setsortBystate(false)
            setsortByCreationDdate(!sortByCreationDdate)
            sortOrder = sortByCreationDdate
        }

        else if (toggleArrow === 'sortById') {
            setSortByjobdefFlag(false)
            setSortByOutputNameFlag(false)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(false)
            setSortIdFlag(true)
            setsortByjobdef(false)
            setSortByOutputName(false)
            setsortByCreationDdate(false)
            setsortBystate(false)
            setsortById(!sortById)
            sortOrder = sortById
        }
        setPage(0)
        type = sortType;
        let clearAarry = true;
        dispatch(Actions.getFiles(10, 0, sortOrder, type, clearAarry));
        sessionStorage.setItem("sortOrder", JSON.stringify(sortOrder));
        sessionStorage.setItem("type", JSON.stringify(type));
    }
    const fetchNextSetData = (currPage) => {
        // setShowRange(false)
        let clearAarry = false;
        let sortType = JSON.parse(sessionStorage.getItem("type"));
        let sortOrder = JSON.parse(sessionStorage.getItem("sortOrder"));
        let start = (currPage - 1) * 10;
        dispatch(Actions.getFiles(10, start, sortOrder, sortType, clearAarry));
        props.setInitialPage(false)
    }

    // const fetchPreviousSetData = () => {
    //     setShowRange(true)
    //     let currentPage = page - 1
    //     setPage(currentPage)
    //     if (currentPage === 0)
    //         props.setInitialPage(true)
    // }

    function onRowClick(selectedId) {
        setSelectedFlag(false)
        setSelectedId(selectedId)
        dispatch(Actions.setSelectedItem(selectedId));
    }

    if (spinnerFlag === true)
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>
        );

    if (spinnerFlag === false && dataSpinner === false && files.length > 0) {
      if(path.endsWith('my-jobs/') === true)
        return (
            <>
                {ReactDOM.createPortal(
                <div>
                    {wrongPageSelectedFlag && (
                        <div>
                            {" "}
                            {toast.error(
                                `Please select a page between 1 and ${Math.ceil(
                                totalRecords / rowsPerPage
                                )}.`
                            )}
                        </div>
                    )}
                </div>,
                document.getElementById("portal")
                )}
                
                <div>
                    <FuseAnimate animation="transition.slideUpIn" delay={100}>
                        <TableContainer className='overflowContentJob' component={Paper}>
                            <Table stickyHeader className='webkitSticky' aria-label="a dense table">

                                <TableHead>
                                    <TableRow style={{ whiteSpace: 'nowrap' }}>

                                        <TableCell>Job Id {(sortById) ?

                                            <Tooltip title="Sort by job id" placement="bottom">
                                                <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('id', 'sortById')}>
                                                    <Icon >arrow_upward</Icon>
                                                </IconButton>
                                            </Tooltip>

                                            :
                                            <Tooltip title="Sort by job id" placement="bottom">
                                                <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('id', 'sortById')}>
                                                    <Icon className={sortIdFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                            </Tooltip>
                                        }</TableCell>
                                        <TableCell >Job Type{(sortByjobdef) ?
                                            <Tooltip title="Sort by job type" placement="bottom">
                                                <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('job_definition', 'sortByjobdef')}> <Icon>arrow_upward</Icon></IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Sort by job type" placement="bottom">
                                                <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('job_definition', 'sortByjobdef')}> <Icon className={sortByjobdefFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                            </Tooltip>
                                        }</TableCell>
                                        <TableCell >Output {(sortByOutputName) ?
                                            <Tooltip title="Sort by output name" placement="bottom">
                                                <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('output_name', 'sortByOutputName')}> <Icon>arrow_upward</Icon></IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Sort by output name" placement="bottom">
                                                <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('output_name', 'sortByOutputName')}> <Icon className={sortByOutputNameFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                            </Tooltip>
                                        }</TableCell>
                                        <TableCell  >Status {(sortBystate) ?
                                            <Tooltip title="Sort by status" placement="bottom">
                                                <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('state', 'sortBystate')}> <Icon>arrow_upward</Icon></IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Sort by status" placement="bottom">
                                                <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('state', 'sortBystate')}> <Icon className={sortBystateFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                            </Tooltip>
                                        }</TableCell>
                                        <TableCell > Creation Date{(sortByCreationDdate) ?
                                            <Tooltip title="Sort by creation date" placement="bottom">
                                                <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('creation_date', 'sortByCreationDdate')}> <Icon>arrow_upward</Icon></IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Sort by creation date" placement="bottom">
                                                <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('creation_date', 'sortByCreationDdate')}> <Icon className={sortByCreationDdateFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                            </Tooltip>
                                        }</TableCell>

                                    </TableRow>
                                </TableHead>
                                {files.length > 0 ?
                                    <TableBody>
                                        {files.map((row, ind, arr) => {
                                            // rowLength = arr.length;
                                            return ((
                                                <TableRow key={row.id}
                                                    className="cursor-pointer jobRows"
                                                    selected={row.id === selectedId}
                                                    onClick={() => onRowClick(row.id)}
                                                >
                                                    <TableCell>
                                                        {<Link style={{color: "#1565C0"}} to={row.id}>{row.id}</Link>}
                                                    </TableCell >
                                                    <TableCell className="" >
                                                    {(()=>{
                                                            var parts = row.job_definition.split("@")
                                                            const full_jd = parts[0]
                                                            const version = parts[1]
                                                            var nameparts = full_jd.split("/")
                                                            const jd = nameparts.pop();
                                                            const namespace = nameparts.map(encodeURIComponent).join("/")  
                                                            return (
                                                                <React.Fragment>

                                                                    <div className="text-xs">
                                                                        <span>{namespace}</span><span className="ml-4">v{version}</span>
                                                                    </div>
                                                                    <div className="text-base font-semibold" >
                                                                        {/* {jd.replace(/([^[\p{L}\d]+|(?<=[\p{Ll}\d])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}[\p{Ll}\d])|(?<=[\p{L}\d])(?=\p{Lu}[\p{Ll}\d]))/gu, ' ')} */}
                                                                        {jd.replace(/_/gu,' ')}
                                                                    </div>
                                                                </React.Fragment>
                                                                
                                                            )
                                                        })()}
                                                    </TableCell>
                                                    <TableCell style={{lineBreak:'anywhere'}}>
                                                        {row.output_name || <b>-</b>} 
                                                    </TableCell>
                                                    <TableCell  >
                                                        {row.state}
                                                    </TableCell>

                                                    <TableCell  >
                                                        {row.creation_date.replace(/T|Z/g, '  ').split(".")[0]}
                                                    </TableCell>
                                                    {/* <TableCell  >
                                                        {row.update_date}
                                                    </TableCell> */}
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
                                            ))

                                        }

                                        )}

                                    </TableBody> : <LinearProgress className="w-xs" color="secondary" />
                                }

                                <TableFooter>

                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </FuseAnimate>
                    {/* {files.length > 0 ?
                        <div >
                            <Button disabled={page * rowsPerPage + 1 === 1}
                                className={'next-button'} color="primary"
                                variant="contained" onClick={fetchPreviousSetData}>Previous</Button>
                            <span className={'count-info'}>Items  {page * rowsPerPage + 1}-{page * rowsPerPage + rowLength} /{totalRecords}</span>
                            <Button
                                disabled={page * rowsPerPage + rowLength === totalRecords}
                                color="primary" className={'next-button'} variant="contained"
                                onClick={handleChangePage}>Next</Button>
                            <span className={'count-info'}>Page - {page + 1}</span>
                        </div> : null
                    } */}

                    <div className="pagination-footer">
                        {matches ? (
                            <Pagination
                            className="pagination-bar"
                            color="primary"
                            count={Math.ceil(totalRecords / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            />
                        ) : (
                        <Pagination
                            className="pagination-bar"
                            color="primary"
                            defaultPage={1}
                            siblingCount={0}
                            size="small"
                            count={Math.ceil(totalRecords / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                        />
                    )}
                    <span className="goToPage_span">
                        <label>Go to page:</label>
                        <TextField
                            className={
                                matches ? "goToPagination" : "goToPaginationForMobile"
                            }
                            id="GoToPagination"
                            variant="outlined"
                            type="number"
                            value={userSelectedPage}
                            onChange={onPageChange}
                            InputProps={{
                                inputProps: {
                                min: 1,
                                max: Math.ceil(totalRecords / rowsPerPage),
                                },
                            }}
                            onKeyDown={onKeyDownPageChange}
                        />
                        {
                        matches ? (
                            <Button
                                className="goToPaginationButton"
                                variant="contained"
                                style={selectButtonStyle}
                                onClick={handleSelectedPageClick}
                                disabled={goToButtonDisabled}
                            >
                            Go
                            </Button>
                        ) : (
                            <Button
                                className="goToPaginationButton"
                                variant="contained"
                                style={selectButtonStyleMob}
                                onClick={handleSelectedPageClick}
                                disabled={goToButtonDisabled}
                            >
                            Go
                            </Button>
                        )
                        }
                    </span>
                </div>
            </div>
        </>
        );
        else {
            return <JobData></JobData>;
        }
    }
    else if (files.length === 0 && onloadSpinner) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Typography className="text-20 mt-16" color="textPrimary">No records exists.</Typography>
            </div>
        )
    }
    else if (Object.values(files1).length === 0)
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>
        )

    else
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>
        )
}



export default MyJobsFileList;
