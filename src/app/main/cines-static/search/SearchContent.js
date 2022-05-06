/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { DigitalLibrarianService } from "node-sciduct";

import { Grid, LinearProgress, Typography } from "@material-ui/core";
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

const SearchContent = () => {

    const searchText = useLocation().search;
    const url = `${process.env.REACT_APP_SCIDUCT_DIGITAL_LIBRARIAN_SERVICE}/`;
    const token = localStorage.getItem('id_token');
    const digitalLibrarianServiceInstance = new DigitalLibrarianService(url, token);

    const [,setErrorMsg] = useState();
    const [loading, setLoading] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [searchMapData, setSearchMapData] = useState(new Map());
    const [outerSearchClicked, setOuterSearchClicked] = useState(false);

    const searchMap = new Map();
    const classes = useStyles();

    // Start Focusing on change of the searchText from URL
    useEffect(() => {
        if(document.getElementById("outerSearch") !== null) {
            document.getElementById("outerSearch").click();
            setOuterSearchClicked(true);
        }
    },[searchedData])

    useEffect(() => {
        if(outerSearchClicked) {
            document.getElementById("outlined-search").value = searchText.slice(1);
            document.getElementById("outlined-search").blur();
        }
    },[outerSearchClicked])
    // End

    // Start API call to get response
    useEffect(() => {
        digitalLibrarianServiceInstance.search(searchText.slice(1))
            .then((res) => {
                setSearchedData(res.docs);
                setLoading(true);
            })
            .catch((error) => {
                setSearchedData([]);
                setLoading(true);
                if (error.response)
                    setErrorMsg(`${error.response.status}-${error.response.statusText} error occured. Please try again`)
                 else
                    setErrorMsg("An internal error occured. Please try again")
            })
    },[searchText])
    //End

    //Start Differentiate data between each types
    useEffect(() => {
        if(searchedData.length > 0) {
            searchedData.map(item => {
                if(searchMap.has(item.type)) {
                    searchMap.get(item.type).push(item);
                } else {
                    searchMap.set(item.type,[item]);
                }
                return null;
            })
            setSearchMapData(searchMap);
        } else {
            setSearchMapData(new Map());
        }
    },[searchedData]);
    //End
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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

                    {[...searchMapData.keys()].map( mapItem => 
                        <Grid className='legendContentStyle' container spacing={2} key={mapItem}>
                            <Grid item xs={9} sm={10} style={{ paddingTop: "25px" }}>
                                <Typography className='typoContentStyle'>{capitalizeFirstLetter(mapItem)}</Typography>
                            </Grid>
                                
                            <Grid item xs={3} sm={2} style={{ paddingTop: "25px" }}>
                                <Typography className='legendDataStyle'>{searchMapData.get(mapItem).length}</Typography>
                            </Grid>
                        </Grid> 
                    )}
                    </Grid>

                <Grid className="contentGrid" item xs={9} sm={12} container spacing={2}>
                    {[...searchMapData.keys()].map( mapItem => {
                        return (
                          <Grid item xs={9} sm={12} container spacing={2} style={{ paddingTop: "30px" }} key={mapItem}>
                            <Grid className="headerStyle">
                              {capitalizeFirstLetter(mapItem)}
                            </Grid>
                            <div className={searchedData.length > 0 && searchMapData.get(mapItem).length > 6 ? "gridContainer" : "gridContainerWithoutHeight" }>
                              {searchMapData.get(mapItem).length > 0 &&
                                searchMapData.get(mapItem)
                                  .sort((a, b) =>
                                    a.metadata.name.split(" ").length >
                                    b.metadata.name.split(" ").length
                                      ? 1
                                      : a.metadata.name.split(" ").length ===
                                        b.metadata.name.split(" ").length
                                      ? a.metadata.name > b.metadata.name
                                        ? 1
                                        : -1
                                      : -1
                                  )
                                  .map((item) => {
                                    return (
                                      <React.Fragment key={item.id}>
                                        <Grid style={{ borderBottom: "1px solid lightgrey", paddingLeft: "1%" }} container item xs={9} sm={12}>
                                          <Grid container item xs={9} sm={12}>
                                            <Grid item xs={4} style={{ padding: "5px" }}>
                                              <Typography>Name</Typography>
                                              <Typography className="typoContentStyle">
                                                {item.metadata.name}
                                              </Typography>
                                            </Grid>

                                            <Grid item xs={4} style={{ padding: "5px" }}>
                                              <Typography>ID</Typography>
                                              <Typography className="typoContentStyle">
                                                <Link to={`/files/${item.id}`}>
                                                  {item.id}
                                                </Link>
                                              </Typography>
                                            </Grid>

                                            <Grid item xs={2} style={{ padding: "5px" }}>
                                              <Typography>Type</Typography>
                                              <Typography className="typoContentStyle">
                                                {item.file_type}
                                              </Typography>
                                            </Grid>

                                            <Grid item xs={2} style={{ padding: "5px" }}>
                                              <Typography>Last Updated</Typography>
                                              <Typography className="typoContentStyle">
                                                {
                                                  item.update_date
                                                    .replace(/T|Z/g, "  ")
                                                    .split(".")[0]
                                                }
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      </React.Fragment>
                                    );
                                  })}
                            </div>
                          </Grid>
                        );
                    })}

                    {loading ? 
                        (searchedData.length === 0 && (
                            <Grid item xs={9} sm={12} container spacing={2} style={{ paddingTop: "30px"}}>
                                <Typography className='typoContentStyle' style={{fontSize: "15px"}}>No record found.</Typography>
                            </Grid>
                        )) : (
                            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                                <LinearProgress className="w-xs" color="secondary" />
                            </div>
                    )}

                </Grid>
            </div>
        </>
    )
}

export default SearchContent;