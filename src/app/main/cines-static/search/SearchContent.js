/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import { DigitalLibrarianService } from "node-sciduct";

import { Grid, LinearProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import "./SearchContent.css";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from '@mui/material/Popover';
import Info from '@material-ui/icons/Info.js';


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
  hideId:{
    [theme.breakpoints.down('md')]: {
      display: "none !important"
    },
  },
  hideInfoIcon:{
    [theme.breakpoints.up('xs')]: {
      display: "none !important"
    },
  },
  resultBoxHeight:{
    [theme.breakpoints.up('xs')]: {
      height: "65vh"
    },
    [theme.breakpoints.up('sm')]: {
      height: "80vh"
    },
    [theme.breakpoints.up('md')]: {
      height: "63vh"
    },
  }
  
}));



const SearchContent = () => {
  const searchText = decodeURIComponent(useLocation().search);
  const url = `${process.env.REACT_APP_SCIDUCT_DIGITAL_LIBRARIAN_SERVICE}/`;
  const token = localStorage.getItem("id_token");
  const digitalLibrarianServiceInstance = new DigitalLibrarianService(
    url,
    token
  );

  const [, setErrorMsg] = useState();
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [searchMapData, setSearchMapData] = useState(new Map());
  const [outerSearchClicked, setOuterSearchClicked] = useState(false);
  const [device, setDevice] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [itemId, setItemId] = useState('')

  const searchMap = new Map();
  const classes = useStyles();
 

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setItemId(id)
  };

  const handleClose = () => {
    setAnchorEl(null);
    setItemId('')

  };
  const open = Boolean(anchorEl);
  const popOverId = open ? 'simple-popover' : undefined;


  useEffect(() => {
    if (
      /Android|webOS|iPhone|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(
        navigator.userAgent
      )
    ) {
      setDevice(true);
    }
  }, []);

  // Start Focusing on change of the searchText from URL
  useEffect(() => {
    if (document.getElementById("outerSearch") !== null) {
      document.getElementById("outerSearch").click();
      setOuterSearchClicked(true);
    }
  }, [searchedData]);

  useEffect(() => {
    if (outerSearchClicked) {
      document.getElementById("outlined-search").value = searchText.slice(1);
      document.getElementById("outlined-search").blur();
    }
  }, [outerSearchClicked]);
  // End

  // Start API call to get response
  useEffect(() => {
    digitalLibrarianServiceInstance
      .search(searchText.slice(1))
      .then((res) => {
        setSearchedData(res.docs);
        setLoading(true);
      })
      .catch((error) => {
        setSearchedData([]);
        setLoading(true);
        if (error.response)
          setErrorMsg(
            `${error.response.status}-${error.response.statusText} error occured. Please try again`
          );
        else setErrorMsg("An internal error occured. Please try again");
      });
  }, [searchText]);
  //End

  //Start Differentiate data between each types
  useEffect(() => {
    if (searchedData.length > 0) {
      searchedData.map((item) => {
        if (searchMap.has(item.type)) {
          searchMap.get(item.type).push(item);
        } else {
          searchMap.set(item.type, [item]);
        }
        return null;
      });
      setSearchMapData(searchMap);
    } else {
      setSearchMapData(new Map());
    }
  }, [searchedData]);
  //End

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <Box>
        <Grid container >
          <Grid item xs={12} md={12} sm={12}>
          <Typography className="titleStyle">
            Search results for `{searchText.slice(1)}`:
          </Typography>
          </Grid>
          
        </Grid>
      </Box>
      <Box>


        <Grid container  >


          <Grid item xs={12} sm={2} md={2} >
            <Stack
              direction={{ xs: "row", sm: "column", md: "column" }}
              style={{
                paddingTop:24
              }}
              spacing={0.5}
              ml={{sm: 2}}
            > 
              <Chip key={"All Results"}
                sx={{ fontWeight: "bolder", justifyContent: "flex-start" ,fontSize:{xs:9,sm:11,md:11}}}
                avatar={
                  <Avatar
                    style={{ color: "white", fontSize: 10 }}
                    sx={{ bgcolor: "#122230" }}
                  >
                    {searchedData.length}
                  </Avatar>
                }
                label="All Results"
                variant="outlined"
              />

              {[...searchMapData.keys()].map((mapItem) => (
                <Chip key={capitalizeFirstLetter(mapItem)}
                  sx={{ fontWeight: "bolder", justifyContent: "flex-start" ,fontSize:{xs:9,sm:11,md:11}}}
                  avatar={
                    <Avatar
                      style={{ color: "white", fontSize: 10 }}
                      sx={{ bgcolor: "#122230" }}
                    >
                      {searchMapData.get(mapItem).length}
                    </Avatar>
                  }
                  label={capitalizeFirstLetter(mapItem)}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Grid>


          <Grid
            item
            container
            xs={12}
            sm={10}
            md={10}
            style={{
              display: 'flex',
              justifyContent: 'center',}}
          >
            {[...searchMapData.keys()].map((mapItem) => {
              return (
                <Grid item container xs={12} sm={11} md={11}  key={mapItem}  
                style={{
                  paddingTop:24,
                 
                }}
                >
                  <Grid  item className="headerStyle">
                    {capitalizeFirstLetter(mapItem)}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} 
                  className={classes.resultBoxHeight}
                  style={{ 
                  overflowY: 'scroll', overflowX:'hidden'}}
                  >
                    {searchMapData.get(mapItem).length > 0 &&
                      searchMapData
                        .get(mapItem)
                        .sort((a, b) => {
                        // new Date(b.update_date) - new Date(a.update_date)
                        return  (a.metadata.name.length - b.metadata.name.length || a.metadata.name.split(" ").length - b.metadata.name.split(" ").length) || new Date(b.update_date) - new Date(a.update_date)
                      //  return a.metadata.name.split(" ").length > b.metadata.name.split(" ").length 
                      //       ?  1
                      //     : a.metadata.name.split(" ").length === b.metadata.name.split(" ").length 
                      //       ? new Date(b.update_date) - new Date(a.update_date) 
                      //     : a.metadata.name > b.metadata.name 
                      //       ? 1
                      //     : -1
                        })
                        
                        .map((item) => {
                          return (
                            <React.Fragment key={item.id}>
                              <Grid
                                style={{
                                  borderBottom: "1px solid lightgrey",
                                  // paddingLeft: "1%",
                                }}
                                container
                                item
                                xs={12}
                                sm={12}
                              >
                                <Grid container item xs={12} sm={12}>
                                  <Grid item xs={12} sm={6} md={device ? 6 : 4} style={{ padding: "5px" }}>
                                    <Typography>
                                        Name
                                        {device && 
                                          <Info fontSize="small" style={{marginLeft: 10}} color="primary" id={item.id} onClick={($event) => handleClick( $event,item.id)}/>
                                        }
                                        
                                          {/* <Info className={classes.hideInfoIcon} fontSize="small" style={{marginLeft: 10}} color="primary" id={item.id} onClick={($event) => handleClick( $event,item.id)}/> */}
                                        
                                        <Popover
                                          open={open}
                                          anchorEl={anchorEl}
                                          onClose={handleClose}
                                          anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                          }}
                                          transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                          }}
                                          sx={{boxShadow: "none !important",
                                         transition:"none !important" }}
                                      >
                                       
                                        <Typography style={{backgroundColor:"#122230",    boxShadow: "none !important",
                                          color: "white",padding: "2px 5px",transition:"none !important" }} >
                                        ID : {itemId}
                                        </Typography>
                                      </Popover>
                                        
                                    </Typography>
                                    <Typography className="typoContentStyle">
                                       {device ? <Link to={`/files/${item.id}`}>
                                    {item.metadata.name}
                                      </Link> : item.metadata.name}
                                    </Typography>
                                  </Grid>

                                  <Grid className={classes.hideId} item  md={4} style={{ padding: "5px" }}>
                                    <Typography>ID</Typography>
                                    <Typography className="typoContentStyle">
                                      <Link to={`/files/${item.id}`}>
                                        {item.id}
                                      </Link>
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} sm={3} md={device ? 3 : 2} style={{ padding: "5px" }}>
                                    <Typography>Type</Typography>
                                    <Typography className="typoContentStyle">
                                      {item.file_type}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} sm={3} md={device ? 3 : 2}  style={{ padding: "5px" }}>
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
                  </Grid>
                </Grid>
                ////////
              );
            })}
          </Grid>
        </Grid>
      </Box>
 
      <div className={classes.root}>
 
        <Grid className="contentGrid" item xs={12} sm={12} container >


          {loading ? (
            searchedData.length === 0 && (
              <Grid  item xs={12}
                sm={12}
                
                style={{
                  display: 'flex',
                  justifyContent: 'center',alignContent: 'center'}}
              >
                <Typography
                  className="typoContentStyle"
                  style={{ fontSize: "15px" }}
                >
                No record found.
                </Typography>
              </Grid> 


            )
          ) : (
            <Grid   item
              container
              xs={12}
              sm={12}
              md={12}
              style={{
                display: 'flex',
                justifyContent: 'center',alignContent: 'center'}}>
                  <Grid item xs={12} sm={12}  style={{
                display: 'flex',
                justifyContent: 'center',alignContent: 'center'}}>
                  <Typography className="text-20" color="textPrimary">
                Loading
              </Typography>
                  </Grid>
                  <Grid>
              <LinearProgress className="w-xs" color="secondary" /> 
                  </Grid>
                
                </Grid>

          )}
        </Grid>
      </div>
    </>
  );
};

export default SearchContent;