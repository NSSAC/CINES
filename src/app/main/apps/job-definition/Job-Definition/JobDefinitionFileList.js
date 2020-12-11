import React, { useState, useEffect } from 'react';
import { Typography, LinearProgress, Hidden, Button, Icon, TableFooter, Fragment, Tooltip, IconButton, TablePagination, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import * as Actions from './store/actions';
import './JobDefinitionFileList.css'
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));
const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

function JobDefinitionFileList(props) {
    const [page, setPage] = React.useState(0);
    const [searchPage, setSearchPage] = React.useState(0);
    const [searchRowperPage, setSearchRowperPage] = React.useState(10);
    const [filterFlag, setFilterFlag] = useState(true);
    const [shortById, setshortById] = useState(false);
    const [shortByjobdef, setshortByjobdef] = useState(false);
    const [shortIdFlag, setShortIdFlag] = useState(false);
    const [shortByjobdefFlag, setShortByjobdefFlag] = useState(false);
    const [shortBystateFlag, setShortBystateFlag] = useState(false);
    const [shortByCreationDdateFlag, setShortByCreationDdateFlag] = useState(true);
    const [shortByCreationDdate, setshortByCreationDdate] = useState(false)
    const [shortBystate, setshortBystate] = useState(false);
    const [shortByCompletedDdate, setshortByCompletedDdate] = useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [spinnerFlag, setSpinnerFlag] = useState(true);
    const [selectedFlag, setSelectedFlag] = useState(true);
    const [searchString, setPreviousString] = useState("");
    const [rowLength, setrowLength] = useState()
    var type;
    var lengthOfRow;
    // var jobDefinitionList;
    const dispatch = useDispatch();
    const jobDefinitionData = useSelector(({ JobDefinitionApp }) => JobDefinitionApp.jobdefinition);
    const selectedItem = useSelector(({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid);

    var jobDefinitionList = Object.values(jobDefinitionData);
    var totalRecords = "";
    var contentRange = "";
    var lastResult = ""
    const [selectedId, setSelectedId] = useState();
    if (jobDefinitionList.length !== 0) {
        contentRange = jobDefinitionList[2]['content-range']
        totalRecords = jobDefinitionList[2]['content-range'].split('/')[1]
        //setSelectedId(jobDefinitionList[0].id)
        lastResult = jobDefinitionList[2]['content-range'].split('/')[0].split('-')[1]
        jobDefinitionList = jobDefinitionList[1]

        var searchResult = jobDefinitionList.filter((data) => {

            if (data.id !== "" && (props.search === "" || (data.id.toLowerCase().includes(props.search.toLowerCase()))))

                return data
        })
        if (Object.keys(selectedItem).length === 0) {
            dispatch(Actions.setSelectedItem(searchResult[0].id));

        }
    }
    const classes = useStyles();

    const tableClasses = useStyles2();
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, jobDefinitionList.length - page * rowsPerPage);
    useEffect(() => {
        setPreviousString(props.search)
        if (props.search != searchString) {

            setSearchPage(0);
            setSearchRowperPage(10)
        }
        setSpinnerFlag(false)
        if (jobDefinitionList.length !== 0) {
        }
        if (JSON.parse(sessionStorage.getItem("resetPage"))) {
            let currentPage = 0
            setPage(currentPage)
        }
        if (jobDefinitionList.length > 0 && selectedFlag) {
            var selectedId = jobDefinitionList[0].id
           //console.log("form data "+JSON.parse(jobDefinitionList[0].input_schema))
            setSelectedId(selectedId)
        }
    })
    const handleChangePage = (event, newPage) => {
        setSpinnerFlag(true)
        sessionStorage.setItem("resetPage", JSON.stringify(false))

        let currentPage = page + 1
        setPage(currentPage);
        // fetchNextSetData()
    };
    const searchHandleChangePage = (event, newPage) => {

        let currentPage = searchPage + 1
        setSearchPage(currentPage);
        // fetchNextSetData()
    };

    const arrLength = (rowLength) => {
        setrowLength(rowLength)
    };


    const searchFetchPreviousSetData = () => {
        let currentPage = searchPage - 1
        setSearchPage(currentPage)
    }
    const fetchPreviousSetData = () => {
        let currentPage = page - 1
        setPage(currentPage)
    }
    const pageCount = (Math.round(jobDefinitionList.length / 10) * 10) / 10;


    const toggleShorting = (shortType, toggleArrow) => {
        let shortOrder = ""
        if (toggleArrow === 'shortByjobdef') {
            setShortIdFlag(false)
            setShortByjobdefFlag(true)
            setShortBystateFlag(false)
            setShortByCreationDdateFlag(false)

            setshortByCreationDdate(false)
            setshortById(false)
            setshortBystate(false)
            setshortByjobdef(!shortByjobdef)
            shortOrder = shortByjobdef

        }
        else if (toggleArrow === 'shortBystate') {
            setShortIdFlag(false)
            setShortByjobdefFlag(false)
            setShortBystateFlag(true)
            setShortByCreationDdateFlag(false)

            setshortByjobdef(false)
            setshortByCreationDdate(false)
            setshortById(false)
            setshortBystate(!shortBystate)
            shortOrder = shortBystate
        }
        else if (toggleArrow === 'shortByCreationDdate') {
            setShortIdFlag(false)
            setShortByjobdefFlag(false)
            setShortBystateFlag(false)
            setShortByCreationDdateFlag(true)

            setshortByjobdef(false)
            setshortById(false)
            setshortBystate(false)
            setshortByCreationDdate(!shortByCreationDdate)
            shortOrder = shortByCreationDdate
        }

        else if (toggleArrow === 'shortById') {
            setShortByjobdefFlag(false)
            setShortBystateFlag(false)
            setShortByCreationDdateFlag(false)
            setShortIdFlag(true)
            setshortByjobdef(false)
            setshortByCreationDdate(false)
            setshortBystate(false)
            setshortById(!shortById)
            shortOrder = shortById
        }
        let start = 1
        setPage(0)
        type = shortType;
        let clearAarry = true;
        dispatch(Actions.getJobDefinitionFiles(10, 1, shortOrder, type, clearAarry));
        sessionStorage.setItem("shortOrder", JSON.stringify(shortOrder));
        sessionStorage.setItem("type", JSON.stringify(type));
        sessionStorage.setItem("count", start);

    }




    function onRowClick(selectedId) {
        setSelectedFlag(false)
        setSelectedId(selectedId)
        selectedId = selectedId;
        dispatch(Actions.setSelectedItem(selectedId));

    }


    if (spinnerFlag === true)
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>
        );

    if (spinnerFlag === false) {
        return (
            <div>

                <FuseAnimate animation="transition.slideUpIn" delay={300}>

                    {jobDefinitionList.length > 0 ?
                        <React.Fragment>
                            {(rowsPerPage > 0 && props.search == ""
                                ? searchResult.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : searchResult.slice(searchPage * searchRowperPage, searchPage * searchRowperPage + searchRowperPage)
                            ).map((row, ind, arr) => {
                                lengthOfRow = arr.length
                                {
                                    if(true){

                                    }
                                }
                                return ((
                                    <React.Fragment>
                                        <div className={classes.root}>
                                            <Grid className= {row.id === selectedId ? "selceted-row" : ""}  onClick={() => onRowClick(row.id)} style={{ borderBottom: "1px solid lightgrey" }} container spacing={1}>
                                                <Grid item xs={3} style={{paddingLeft :"15px"}}>
                                                    <Typography  >
                                                        Name
         </Typography >
                                                    <Typography variant="h7" style={{fontWeight:"700"}} >
                                                        {row.id}
                                                    </Typography >
                                                </Grid>
                                                <Grid item xs={4} style={{paddingLeft :"15px"}}>
                                                    <Typography >
                                                        Created By
         </Typography >
                                                    <Typography style={{fontWeight:"700"}}>
                                                        {row.created_by}
                                                    </Typography >
                                                </Grid>
                                                <Grid item xs={4} style={{paddingLeft :"15px"}}>
                                                    <Typography >
                                                        Last Updated
         </Typography >
                                                    <Typography style={{fontWeight:"700"}}>
                                                        {row.update_date.replace(/T|Z/g,'  ').split(".")[0]}
                                                    </Typography >
                                                </Grid>
                                                <Grid item xs={10} style={{paddingLeft :"15px"}}>
                                                    <Typography >
                                                        Description
         </Typography >
                                                    <Typography style={{fontWeight:"700"}}>
                                                        {row.description}
                                                    </Typography >
                                                </Grid>
                                                <Grid item xs={2} >
                                                <Button
                                                            variant="contained"
                                                            ////size="small"
                                                            //color="primary"
                                                            className={classes.button}
                                                        >
                                                            Select
                                     </Button>
                                                </Grid>
                                               


                                            </Grid>
                                        </div>
                                    </React.Fragment>
                                ))
                            }
                            )}
                        </React.Fragment>
                        : <LinearProgress className="w-xs" color="secondary" />
                    }

                </FuseAnimate>


                {

                    props.search == "" ?
                        <div >
                            <Button disabled={page * rowsPerPage + 1 === 1} className={'next-button'} color="primary" variant="contained" onClick={fetchPreviousSetData}>Previous</Button><span className={'count-info'}>Items {page * rowsPerPage + 1}-{page * rowsPerPage + lengthOfRow} /{totalRecords}</span> <Button disabled={page * rowsPerPage + lengthOfRow === totalRecords} color="primary" className={'next-button'} variant="contained" onClick={handleChangePage}>Next</Button>
                            <span className={'count-info'}>Page - {page + 1}</span>
                        </div> :
                        <div >
                            <Button disabled={searchPage * searchRowperPage + 1 === 1} className={'next-button'} color="primary" variant="contained" onClick={searchFetchPreviousSetData}>Previous</Button><span className={'count-info'}>Items {searchPage * searchRowperPage + 1}-{searchPage * searchRowperPage + lengthOfRow} /{jobDefinitionList.length}</span> <Button disabled={searchPage * searchRowperPage + lengthOfRow === jobDefinitionList.length} color="primary" className={'next-button'} variant="contained" onClick={searchHandleChangePage}>Next</Button>
                            <span className={'count-info'}>Page - {searchPage + 1}</span>
                        </div>
                }


                {/* 
 */}
                {/* <div className="">
                    <IconButton disabled={page * rowsPerPage + 1 === 1} className={'next-button'} color="primary" variant="contained" onClick={fetchPreviousSetData}> <Icon >chevron_left</Icon></IconButton><span className={'count-info'}>Total records  {page * rowsPerPage + 1}-{page * rowsPerPage + rowsPerPage} of {totalRecords}</span>  <IconButton disabled={page * rowsPerPage + rowsPerPage === totalRecords} color="primary" className={'next-button'} variant="contained" onClick={handleChangePage}> <Icon >chevron_right</Icon></IconButton> 
                <span className={'count-info'}>Page - {page + 1}</span>
                    </div> */}

                {/* <Button disabled={page * rowsPerPage + 1 === 1} className={'next-button'} color="primary" variant="contained" onClick={fetchPreviousSetData}>Previous</Button><span className={'count-info'}>{contentRange} </span> <Button disabled={lastResult === totalRecords} color="primary" className={'next-button'} variant="contained" onClick={handleChangePage}>Next</Button>
                <span className={'count-info'}>Page - {page + 1}</span> */}
            </div>
        );
    }
}

export default JobDefinitionFileList;
