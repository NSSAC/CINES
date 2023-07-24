import React, { useEffect, useState, useRef  } from 'react';
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
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

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
    if(typeof window.expList === 'undefined'){
        window.expList = []
    }
    const tableRef = useRef(null);

    var type;
    localStorage.removeItem("verDrop")
    //Static Form Parameter
    window.restoreDynamicProps = undefined
    window.restoreStatic = undefined
    window.restoreSubmodelArray = undefined
    window.restoreInputFields = undefined
    window.restoreStatesArray = undefined
    window.restoreRules = undefined
    window.formVersion = undefined
    window.formEdited = false
    window.restoreOutputName = undefined
    window.restoreOutputPath = undefined
    window.restoreDynamicForm = undefined

    //Static Ploting form
    window.restorePlotData = undefined

    //Dynamic Form Parameter
    window.restoreD_FEArray = undefined
    window.restoreDynamicFData = undefined

    //Check for correct format of file
    window.checkInputFiles = undefined

    if(window.expCheckedList === undefined){
        window.expCheckedList = {}
        window.currentId = undefined
    }
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
            if(!props.selectedJobDef){
                props.setSelectedJobDef(true)
            dispatch(Actions.setSelectedItem(files[0].id));
            }
            // dispatch(Actions.setSelectedItem(files[0].id));
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
        dispatch(Actions.clearData());
        setSpinnerFlag(true)
    },[props.expCheck])

    useEffect(() => {
        if (files.length > 0 && sortCount === false) {
          if (document.getElementsByClassName("jobRows").length > 0){
            if(!props.selectedJobDef){
                props.setSelectedJobDef(true)
                document.getElementsByClassName("jobRows")[0].click();
            }
          }
            // document.getElementsByClassName("jobRows")[0].click();
        }
      }, [files.length, page, sortCount]);

      // To make the 1st row element selected and show its meta-data
      useEffect(() => {
        if (Array.isArray(files) && files.length > 0) setFirstFileId(files[0].id);
      }, [files]);

      useEffect(() => {
        if (document.getElementsByClassName("jobRows").length > 0) {
            document.getElementsByClassName("jobBody")[0].scrollIntoView();
            if(!props.selectedJobDef){
                props.setSelectedJobDef(true)
                document.getElementsByClassName("jobRows")[0].click();
            }
            // document.getElementsByClassName("jobRows")[0].click();
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
            let id = ""
            let notComp_state = []
            for (i = 0; i < files.length; i++) {
                if (files[i].state !== 'Completed' && files[i].state !== 'Failed' && files[i].state !== 'Cancelled') {
                    changeState = true;
                    id = files[i].id
                    notComp_state.push(id)
                }
            }

            if (cancelledJob === null)
                cancelledState = true;
            else {
                for (i = 0; i < files.length; i++) {
                    if (files[i].id === cancelledJob) {
                        cancelledState = true;
                        if (files[0].state === 'Completed' || files[i].state === 'Failed' || files[i].state === 'Cancelled')
                            localStorage.removeItem("cancelledJob")
                        break;
                    }
                }
            }
            const timer_selectedItem = setInterval(() => {
                selectedItem && selectedItem.state !== 'Completed' && selectedItem.state !== 'Failed' && selectedItem.state !== 'Cancelled' && dispatch(Actions.setSelectedItem(selectedId));
            }, 8000);

            // const timer_jobList = setInterval(() => {
            //     if (changeState || !cancelledState) {
            //         props.setChangeState(props.changeState + 1);
            //         // Below logic is used to call api after every 8000ms. this logic calls job definiton api that are expanded and are in running state. 
            //         //notComp_state is array that has JD id which are in running state. if any id found in window.expCheckedList that matches the item in notComp_state, api gets called to fetch its updated state. Further if for the same window.expCheckedList[ele] has expanded child and its status is running api will get called to update its state

            //         notComp_state.forEach((ele) => {  
            //                 if(Object.keys(window.expCheckedList).length > 0 && window.expCheckedList.hasOwnProperty(ele)){
            //                         dispatch(Actions.getChildJobs(ele));

            //                         if(window.expCheckedList[ele].child_expanded.length > 0){
            //                             window.expCheckedList[ele].child_expanded.forEach((child) => {
            //                             const index = window.expList.findIndex(obj => obj.id === ele);
            //                             if (index !== -1) {
            //                                 const child_state = window.expList[index].value.filter(el => el.id === child)[0].state
            //                                 let jd_state = ['Completed','Failed','Cancelled']
            //                                 if(!jd_state.includes(child_state)){
            //                                     setTimeout(() => {
            //                                         dispatch(Actions.getChildJobs(child));
            //                                         window.checkForUpdates = true
            //                                         window.newText = "Childd"
    
            //                                     }, 2000);
            //                                     // dispatch(Actions.getChildJobs(child));
            //                                 }
            //                             }
            //                             })
            //                         }
            //                         window.checkForUpdates = true
            //                         window.newText = "Parentt"
            //                 }
            //             })
            //         cancelledState && setSortCount(true)
            //     }else {
                
            //         if(window.expList.length > 0){
            //             window.expList.forEach((ele) => {
            //                 let pendingStatus = false;
            //                 let jd_state = ['Completed','Failed','Cancelled']
            //                 for (i = 0; i < ele.value.length; i++) {
            //                     if(!jd_state.includes(ele.value[i].state)){
            //                         pendingStatus = true;
            //                         break;
            //                     }
            //                 }
            //                 if(pendingStatus){
            //                     props.setChangeState(props.changeState + 1);
            //                     dispatch(Actions.getChildJobs(ele.id));
            //                     window.checkForUpdates = true
            //                 }
            //             })
            //         }
            //     }
            //     setTimeout(() => {
            //         setSortCount(false);
            //     }, 2000);
            // }, 8000);


            const timer_jobList = setInterval(async () => {
                if (changeState || !cancelledState) {
                    props.setChangeState(props.changeState + 1);
                    if (Object.keys(window.expCheckedList).length > 0) {
                        for (const ele of notComp_state) {
                            if (window.expCheckedList.hasOwnProperty(ele)) {
                                dispatch(Actions.getChildJobs(ele));
                                if (window.expCheckedList[ele].child_expanded.length > 0) {
                                    for (const child of window.expCheckedList[ele].child_expanded) {
                                        const index = window.expList.findIndex(obj => obj.id === ele);
                                        if (index !== -1) {
                                            const child_state = window.expList[index].value.find(el => el.id === child)?.state;
                                            const jd_state = ['Completed', 'Failed', 'Cancelled'];
                                            if (child_state && !jd_state.includes(child_state)) {
                                                await new Promise(resolve => setTimeout(resolve, 2000));
                                                dispatch(Actions.getChildJobs(child));
                                                window.checkForUpdates = true;
                                                window.newText = "Childd";
                                            }
                                        }
                                    }
                                }
                                window.checkForUpdates = true;
                                window.newText = "Parentt";
                            }
                        }
                    }
                    cancelledState && setSortCount(true);
                } else {
                    if (window.expList.length > 0) {
                        for (const ele of window.expList) {
                            let pendingStatus = false;
                            const jd_state = ['Completed', 'Failed', 'Cancelled'];
                            for (const value of ele.value) {
                                if (value.state && !jd_state.includes(value.state)) {
                                    pendingStatus = true;
                                    break;
                                }
                            }
                            if (pendingStatus) {
                                props.setChangeState(props.changeState + 1);
                                dispatch(Actions.getChildJobs(ele.id));
                                window.checkForUpdates = true;
                            }
                        }
                    }
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

        if( (page !== value)){
            setSpinnerFlag(true);
            setPage(value);
            setCurrentPage(value);
            sessionStorage.setItem("resetPage", JSON.stringify(false))    
            window.expList = []
            window.expCheckedList = {}
            fetchNextSetData(value);
            setUserSelectedPage(value);
        }
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
        dispatch(Actions.getFiles(10, 0, sortOrder, type, clearAarry, props.expCheck));
        sessionStorage.setItem("sortOrder", JSON.stringify(sortOrder));
        sessionStorage.setItem("type", JSON.stringify(type));
    }
    const fetchNextSetData = (currPage) => {
        // setShowRange(false)
        let clearAarry = false;
        let sortType = JSON.parse(sessionStorage.getItem("type"));
        let sortOrder = JSON.parse(sessionStorage.getItem("sortOrder"));
        let start = (currPage - 1) * 10;
        dispatch(Actions.getFiles(10, start, sortOrder, sortType, clearAarry, props.expCheck));
        props.setInitialPage(false)
    }

    // const fetchPreviousSetData = () => {
    //     setShowRange(true)
    //     let currentPage = page - 1
    //     setPage(currentPage)
    //     if (currentPage === 0)
    //         props.setInitialPage(true)
    // }

    const scrollTableToTop = () => {
        if (tableRef.current) {
          const tableBodyElement = document.getElementById('scroll_tabletop');
          tableBodyElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      };

    function onRowClick(e, selId) {
        e.stopPropagation()
        if(selId !== selectedId){
            setSelectedFlag(false)
            setSelectedId(selId)
            dispatch(Actions.setSelectedItem(selId));
        }
    }

    function Row(pops) {
        const { row } = pops;
        const setClass = pops.setClass
        const [isExpanded, setIsExpanded] = React.useState(false);
        const expandedList1 = useSelector(({ myJobsApp }) => myJobsApp.childJob);
        let expandedList;

        if(window.expCheckedList.hasOwnProperty(row.id)){
            if(isExpanded === false){
                setIsExpanded(true)
            }
        }
        else{
            if(isExpanded === true){
                setIsExpanded(false)
            }
        }


        // List of variable used :
            // 1. window.expCheckedList : Object that contains the expanded id with their value being the number of px that needs to be shifted on left side 
            // 2. window.expList : Array that contains two keys (id && value). id store the value of id that is being expanded. value is an array that store the child jobs under the id
            // 3. window.currentId : Stores the value of currently expanded id 
            // 4. window.dynStyle : Used for styling and shifting the list to left side 
            // 5. window.checkForUpdates : Used to allow the code to update the value of  window.expList. Once updated it is marked to false


        if(expandedList1 && expandedList1.length !== 0){
            expandedList = Object.values(expandedList1);

            if (expandedList.length !== 0) {
                expandedList = expandedList[1]

                if (expandedList.length > 0) {
                    let i;
                    for (i = 0; i < expandedList.length; i++) {
                        let t = new Date(expandedList[i].creation_date)
                        let date = ('0' + t.getDate()).slice(-2);
                        let month = ('0' + (t.getMonth() + 1)).slice(-2);
                        let year = t.getFullYear();
                        let hours = ('0' + t.getHours()).slice(-2);
                        let minutes = ('0' + t.getMinutes()).slice(-2);
                        let seconds = ('0' + t.getSeconds()).slice(-2);
                        let tempDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
                        expandedList[i].creation_date = tempDate
                    }
                }
                // Below if condition is to update the variable window.expList so that is get updated time to time to re`nder the STATUS of that job defintion
                if (window.checkForUpdates) {
                    console.log(window.newText)
                    console.log(expandedList[0].parent_id)
                    console.log(expandedList)


                    if (expandedList.length > 0) {
                        let updatingId = expandedList[0].parent_id
                        const index = window.expList.findIndex(obj => obj.id === updatingId);
                        if (index !== -1) {
                            window.expList[index].value = expandedList
                        }
                    }
                    window.checkForUpdates = false
                }

                if(Object.keys(window.expCheckedList).length > 0 && window.currentId !== undefined){
                    if(window.expList && window.expList.length > 0 && window.expList.every((v) => v.id !== window.currentId)){
                        let obj = {}
                        obj['id'] = window.currentId
                        obj['value'] = expandedList
                        window.expList.push(obj)

                    }else if(window.expList && window.expList.length === 0){
                        let obj = {}
                        obj['id'] = window.currentId
                        obj['value'] = expandedList
                        window.expList.push(obj)

                    }

                }
            }
        }

        const expand = (e, id, expandCheck, state) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
            if(expandCheck){

                window.currentId = id
                let idPresent = false;
                let parent_elementId;

                // This below logic which returns value for "idPresent" is to check if the expanded id is a child under any parent or not. 
                if(window.expList.length > 0){
                    window.expList.forEach(v => {
                        v.value.forEach((e) => {
                            if(idPresent){
                                return
                            }
                            if(e.id === id){
                                idPresent = true;
                                parent_elementId = e.parent_id
                                return
                            }
                        })
                    })
                }

                if(idPresent){
                    let obj = {}

                    window.expCheckedList[parent_elementId]['child_expanded'].push(id)
                    obj[id] = {
                        "shifter": window.expCheckedList[parent_elementId]['shifter'] + 9,
                        "child_expanded": [],
                        "parent_Id" : parent_elementId
                    }
                    window.expCheckedList = {...window.expCheckedList, ...obj}
                }else{

                     let obj = {}
                     obj[id] = {
                         "shifter": 10,
                         "child_expanded": []
                     }
                     window.expCheckedList = {...window.expCheckedList, ...obj}
                }

                if(expandedList && expandedList.length > 0 && expandedList[0].parent_id !== id){
                    dispatch(Actions.clearChildData());
                }
                dispatch(Actions.getChildJobs(id));
            }else{

                window.currentId = undefined
                if(window.expCheckedList.hasOwnProperty(row.id)){
                    // Below if condition will  remove the child id frm array in window.expCheckedList[parent_Id]['child_expanded']. Property child_expanded is an array that holds the ids which are expanded and are child to the parent.
                    if(window.expCheckedList.hasOwnProperty(id) && window.expCheckedList[id]['parent_Id']){
                        let parent_id = window.expCheckedList[id]['parent_Id'] 
                        let expandedChildArr = window.expCheckedList[parent_id]['child_expanded']

                        const index = expandedChildArr.findIndex(obj => obj === id);
                        if (index !== -1) {
                            expandedChildArr.splice(index, 1);
                        }

                        window.expCheckedList[parent_id]['child_expanded'] = expandedChildArr
                        
                    }

                    // Below conditions will remove the child obj from window.expCheckedList && window.expList. This will only work if any id is expanded and its child id is expanded. && if we close the parent id , here both will get collapsed (parent as well as its child). So to remove the child from window.expCheckedList && window.expList below codeis used.
                    let deleteChild_Obj = window.expCheckedList[id]['child_expanded'] 
                    if(deleteChild_Obj.length > 0) {
                        deleteChild_Obj.forEach((child_id) => {
                            if(window.expCheckedList.hasOwnProperty(child_id)){
                                    delete window.expCheckedList[child_id]
                                    const index = window.expList.findIndex(obj => obj.id === child_id);
                                    if (index !== -1) {
                                        window.expList.splice(index, 1);
                                    }
                            }
                            
                        })
                    }

                    //Below code collapses the selected row
                    delete window.expCheckedList[id]
                    const index = window.expList.findIndex(obj => obj.id === id);
                    if (index !== -1) {
                        window.expList.splice(index, 1);
                    }
                    scrollTableToTop()
                }
            }
        }

        const getStyle = (setClass, id) => {
            // This funcition adds a property to shift the TableCell to left if expanded row is a child. No. of pixels to be added in incremental manner.   
            if(setClass){
                if(window.expCheckedList.hasOwnProperty(id)){
                    let a = {
                        left : `${window.expCheckedList[id]['shifter']}px`
                    }
                    return a
                }
            }
        }
      
        return (
          <React.Fragment>
            <TableRow key={row.id}
            className="cursor-pointer jobRows"
            selected={row.id === selectedId}
            onClick={(e) => onRowClick(e, row.id)}
            >
                {props.expandableList === true && 
                    <TableCell style={getStyle(setClass, row.parent_id)} className={`expander ${setClass ? "expandShifter" : ""}`}>
                        {row['has_children'] && 
                        <IconButton  onClick={(e) => expand(e, row.id, !isExpanded, row.state)}   style={{padding: 0}}>
                        {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                      </IconButton>}
                    </TableCell>}
                    <TableCell style={getStyle(setClass, row.parent_id)} className={`${setClass ? "expandShifter" : ""}`} >
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
                    <TableCell style={{width: '12%'}} >
                        {row.creation_date.replace(/T|Z/g, '  ').split(".")[0]}
                    </TableCell>
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
            {isExpanded && 
                <>  
                    {window.expList && window.expList.filter((item) => item.id === row.id).length === 0 ?
                        <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                <div className="flex flex-1 flex-col items-center justify-center mb-16">
                                    <Typography className="text-sm mt-16" color="textPrimary">Loading</Typography>
                                    <LinearProgress className="w-xs" color="secondary" />
                                </div>
                            </TableCell>
                        </TableRow> :

                        (window.expList && window.expList.length > 0 &&
                            window.expList
                              .filter((item) => item.id === row.id)
                              .map((_row) =>
                                _row.value.map((r) => (
                                  <Row setClass={true} key={r.id} row={r} />
                                ))
                              ))
                    }
                </>    
                    
            }
          </React.Fragment>
        );
      }

    if (spinnerFlag === true)
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading1</Typography>
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
                                        {props.expandableList === true && 
                                        <TableCell className="expander" >
                                        </TableCell>}

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
                                    <TableBody ref={tableRef} id="scroll_tabletop">
                                        {files.map((row, ind, arr) => {
                                            // rowLength = arr.length;
                                            return ((
                                                <Row key={row.id} row={row} />

                                               
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


