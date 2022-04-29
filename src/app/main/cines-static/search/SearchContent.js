/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { DigitalLibrarianService } from "node-sciduct";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import "./SearchContent.css"

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "row",
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  }));

const SearchContent = (props) => {

    const searchText = useLocation().search;
    const url = `${process.env.REACT_APP_SCIDUCT_DIGITAL_LIBRARIAN_SERVICE}/`;
    const token = localStorage.getItem('id_token');
    const digitalLibrarianServiceInstance = new DigitalLibrarianService(url, token);
    // console.log("digitalLibrarianServiceInstance", digitalLibrarianServiceInstance);

    const [,setErrorMsg] = useState();
    const [searchedData, setSearchedData] = useState([]);
    const [fileManagerSearchedData, setFileManagerSearchedData] = useState([]);
    const [myJobsSearchedData, seMyJobsSearchedData] = useState([]);
    const [jobDefinitionSearchedData, setJobDefinitionSearchedData] = useState([]);
    const [outerSearchClicked, setOuterSearchClicked] = useState(false);

    const fileManagerData = [];
    const myJobsData = [];
    const jobDefinitionData =[];

    const classes = useStyles();

    // Start Focusing on change of the searchText from URL
    useEffect(() => {
        if(document.getElementById("outerSearch") !== null) {
            document.getElementById("outerSearch").click();
            setOuterSearchClicked(true);
        }
    },[])

    useEffect(() => {
        if(outerSearchClicked) {
            document.getElementById("outlined-search").value = searchText.slice(1);
            document.getElementById("outlined-search").blur();
        }
    },[outerSearchClicked])
    // End

    // Start API call to get response
    useEffect(() => {
        console.log("SearchText -> ", searchText.slice(1));
        digitalLibrarianServiceInstance.search(searchText.slice(1))
            .then((res) => {
                console.log("SearchText Response", res);
                setSearchedData(res.docs);
            })
            .catch((error) => {
                setSearchedData([]);
                if (error.response)
                    setErrorMsg(`${error.response.status}-${error.response.statusText} error occured. Please try again`)
                 else
                    setErrorMsg("An internal error occured. Please try again")
            })
    },[searchText])
    //End

    //Sart Differentiate data between each types
    useEffect(() => {
        if(searchedData.length > 0) {
            searchedData.map(item => {
                if(item.type === "file") {
                    fileManagerData.push(item);
                } else if(item.type === "myJobs") {
                    myJobsData.push(item);
                } else if(item.type === "jobDefinition") {
                    jobDefinitionData.push(item);
                }
                return null;
            })
        }
        setFileManagerSearchedData(fileManagerData);
        seMyJobsSearchedData(myJobsData);
        setJobDefinitionSearchedData(jobDefinitionData);
    },[searchedData])

    //End
    return (
        <>  
            <Grid className='titleStyleGrid' item xs={12} sm={12} container spacing={2}>
                <Typography className='titleStyle'>Search results for `{searchText.slice(1)}`:</Typography>
            </Grid>
            <div className={classes.root}>
                <Grid className="legendContentGrid" item xs={3} sm={2} container spacing={2}>
                    <Grid style={{ border: "1px solid lightgrey", paddingRight: "10px"}} container spacing={2}>
                        <Grid item xs={9} sm={10} style={{ paddingTop: "15px" }}>
                            <Typography className='typoContentStyle'>All Results</Typography>
                        </Grid>
                            
                        <Grid item xs={3} sm={2} style={{ paddingTop: "15px" }}>
                            <Typography className='legendDataStyle'>{searchedData.length}</Typography>
                        </Grid>
                    </Grid>

                    {fileManagerSearchedData.length > 0 && 
                        <Grid className='legendContentStyle' container spacing={2}>
                            <Grid item xs={9} sm={10} style={{ paddingTop: "25px" }}>
                                <Typography className='typoContentStyle'>Files</Typography>
                            </Grid>
                                
                            <Grid item xs={3} sm={2} style={{ paddingTop: "25px" }}>
                                <Typography className='legendDataStyle'>{fileManagerSearchedData.length}</Typography>
                            </Grid>
                        </Grid>
                    }

                    {myJobsSearchedData.length > 0 && 
                        <Grid className='legendContentStyle' container spacing={2}>
                            <Grid item xs={9} sm={10} style={{ paddingTop: "25px" }}>
                                <Typography className='typoContentStyle'>My Jobs</Typography>
                            </Grid>
                                
                            <Grid item xs={3} sm={2} style={{ paddingTop: "25px" }}>
                                <Typography className='legendDataStyle'>{myJobsSearchedData.length}</Typography>
                            </Grid>
                        </Grid>
                    }   

                    {jobDefinitionSearchedData.length > 0 &&
                        <Grid className='legendContentStyle' container spacing={2}>
                            <Grid item xs={9} sm={10} style={{ paddingTop: "25px" }}>
                                <Typography className='typoContentStyle'>Job Definition</Typography>
                            </Grid>
                            
                            <Grid item xs={3} sm={2} style={{ paddingTop: "25px" }}>
                                <Typography className='legendDataStyle'>{jobDefinitionSearchedData.length}</Typography>
                            </Grid>
                        </Grid>
                    }
                    </Grid>

                <Grid className="contentGrid" item xs={9} sm={12} container spacing={2}>
                    {fileManagerSearchedData.length > 0 && (
                        <Grid item xs={9} sm={12} container spacing={2} style={{ paddingTop: "30px" }}>
                            <Grid className="headerStyle"> Files </Grid>
                            <div className={searchedData.length > 0 && "gridContainer"}>
                            {fileManagerSearchedData.length > 0 ? fileManagerSearchedData.map((item) => {
                                return(
                                    <React.Fragment key={item.id}>
                                        <Grid style={{ borderBottom: "1px solid lightgrey", paddingLeft:"1%" }} container item xs={9} sm={12}>
                                            <Grid container item xs={9} sm={12}>

                                                <Grid item xs={4} style={{ padding: "5px" }}>
                                                    <Typography>Name</Typography>
                                                    <Typography className='typoContentStyle'>
                                                        {item.metadata.name}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={4} style={{ padding: "5px" }}>
                                                    <Typography>ID</Typography>
                                                    <Typography className='typoContentStyle'>
                                                        <Link to={`/files/${item.id}`}>{item.id}</Link>
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={2} style={{ padding: "5px" }}>
                                                    <Typography>Type</Typography>
                                                    <Typography className='typoContentStyle'>
                                                        {item.file_type}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={2} style={{ padding: "5px" }}>
                                                    <Typography>Last Updated</Typography>
                                                    <Typography className='typoContentStyle'>
                                                        {item.update_date.replace(/T|Z/g, "  ").split(".")[0]}
                                                    </Typography>
                                                </Grid>

                                            </Grid>

                                            {/* <Grid item xs={3} sm={2} style={{ paddingTop: "15px" }}>
                                                <Button variant="contained" onClick={handleMetadataClick}>
                                                    Show Metadata
                                                </Button>
                                            </Grid> */}
                                        </Grid>
                                    </React.Fragment>
                                ) 
                            }):<Typography className='typoContentStyle'>No record found.</Typography>}
                            </div>
                        </Grid>       
                    )}

                    {myJobsSearchedData.length > 0 && (
                        <Grid item xs={9} sm={12} container spacing={2} style={{ paddingTop: "30px" }}>
                                <Grid className='headerStyle'> My Jobs </Grid>
                                <Typography className='typoContentStyle'>No record found.</Typography>
                        </Grid>
                    )}

                    {jobDefinitionSearchedData.length > 0 && (
                        <Grid item xs={9} sm={12} container spacing={2} style={{ paddingTop: "30px" }}>
                            <Grid className='headerStyle'> Job Definition </Grid>
                            <Typography className='typoContentStyle'>No record found.</Typography>
                        </Grid>
                    )}    

                    {searchedData.length === 0 && (
                        <Grid item xs={9} sm={12} container spacing={2} style={{ paddingTop: "30px"}}>
                            <Typography className='typoContentStyle' style={{fontSize: "15px"}}>No record found.</Typography>
                        </Grid>
                    )}

                </Grid>
            </div>
        </>
    )
}

export default SearchContent;