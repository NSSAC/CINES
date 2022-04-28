import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { DigitalLibrarianService } from "node-sciduct";

import { Grid, Typography, Button } from "@material-ui/core";
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

    const classes = useStyles();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchText])
    
    const handleMetadataClick = () => {}

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

                    <Grid className='legendContentStyle' container spacing={2}>

                        <Grid item xs={9} sm={10} style={{ paddingTop: "25px" }}>
                            <Typography className='typoContentStyle'>File Manager</Typography>
                        </Grid>
                            
                        <Grid item xs={3} sm={2} style={{ paddingTop: "25px" }}>
                            <Typography className='legendDataStyle'>{searchedData.length}</Typography>
                        </Grid>
                    </Grid>

                    <Grid className='legendContentStyle' container spacing={2}>

                        <Grid item xs={9} sm={10} style={{ paddingTop: "25px" }}>
                            <Typography className='typoContentStyle'>My Jobs</Typography>
                        </Grid>
                            
                        <Grid item xs={3} sm={2} style={{ paddingTop: "25px" }}>
                            <Typography className='legendDataStyle'>0</Typography>
                        </Grid>
                    </Grid>

                    <Grid className='legendContentStyle' container spacing={2}>
                        <Grid item xs={9} sm={10} style={{ paddingTop: "25px" }}>
                            <Typography className='typoContentStyle'>Job Definition</Typography>
                        </Grid>
                            
                        <Grid item xs={3} sm={2} style={{ paddingTop: "25px" }}>
                            <Typography className='legendDataStyle'>0</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid className="contentGrid" item xs={9} sm={12} container spacing={2}>
                        <Grid item xs={9} sm={11} container spacing={2} style={{ paddingTop: "30px" }}>
                            <Grid className="headerStyle"> File Manager </Grid>
                            <div className={searchedData.length > 0 && "gridContainer"}>
                            {searchedData.length > 0 ? searchedData.map((item) => {
                                return(
                                    <React.Fragment key={item.id}>
                                        <Grid style={{ borderBottom: "1px solid lightgrey", paddingLeft:"1%" }} container item xs={9} sm={12} spacing={1}>
                                            <Grid container item xs={9} sm={10}>
                                                <Grid item xs={5} style={{ padding: "5px" }}>
                                                    <Typography>Name</Typography>
                                                    <Typography className='typoContentStyle'>
                                                        {item.metadata.name}
                                                    </Typography>
                                                    
                                                </Grid>

                                                <Grid item xs={5} style={{ padding: "5px" }}>
                                                    <Typography>ID</Typography>
                                                    <Typography className='typoContentStyle'>
                                                        <Link to={`/files/${item.id}`}>{item.id}</Link>
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={5} style={{ padding: "5px" }}>
                                                    <Typography>Type</Typography>
                                                    <Typography className='typoContentStyle'>
                                                        {item.file_type}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={5} style={{ padding: "5px" }}>
                                                    <Typography>Last Updated</Typography>
                                                    <Typography className='typoContentStyle'>
                                                        {item.update_date.replace(/T|Z/g, "  ").split(".")[0]}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={3} sm={2} style={{ paddingTop: "15px" }}>
                                                <Button variant="contained" onClick={handleMetadataClick}>
                                                    Show Metadata
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </React.Fragment>
                                ) 
                            }):<Typography className='typoContentStyle'>No record found.</Typography>}
                            </div>
                        </Grid>

                        <Grid item xs={9} sm={11} container spacing={2} style={{ paddingTop: "30px" }}>
                            <Grid className='headerStyle'> My Jobs </Grid>
                            <Typography className='typoContentStyle'>No record found.</Typography>
                        </Grid>

                        <Grid item xs={9} sm={11} container spacing={2} style={{ paddingTop: "30px" }}>
                            <Grid className='headerStyle'> Job Definition </Grid>
                            <Typography className='typoContentStyle'>No record found.</Typography>
                        </Grid>
                    
                </Grid>
            </div>
        </>
    )
}

export default SearchContent;