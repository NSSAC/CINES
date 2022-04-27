import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

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

    const url = `${process.env.REACT_APP_SCIDUCT_DIGITAL_LIBRARIAN_SERVICE}/`;
    const token = localStorage.getItem('id_token');
    const digitalLibrarianServiceInstance = new DigitalLibrarianService(url, token);
    // console.log("digitalLibrarianServiceInstance", digitalLibrarianServiceInstance);

    const [searchText, setSearchText] = useState("");
    const [errorMsg, setErrorMsg] = useState();
    const [searchedData, setSearchedData] = useState([]);

    const classes = useStyles();

    // if(props.location.state.searchText) {
    //     setSearchText(props.location.state.searchText);    
    // }

    useEffect(() => {
        console.log("SearchText -> ", props.location.state.searchText);
        digitalLibrarianServiceInstance.search(props.location.state.searchText)
            .then((res) => {
                console.log("SearchText Response", res);
                setSearchedData(res.docs);
            })
            .catch((error) => {
                if (error.response)
                    setErrorMsg(`${error.response.status}-${error.response.statusText} error occured. Please try again`)
                 else
                    setErrorMsg("An internal error occured. Please try again")
            })
    },[])
    
    const handleMetadataClick = () => {}

    return (
        <div className={classes.root}>
            <Grid item xs={3} sm={2} container spacing={2} style={{ paddingTop: "78px", paddingLeft: "70px", alignSelf: "flex-start" }}>
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
            
            <Grid item xs={9} sm={10} container spacing={2} style={{ paddingTop: "70px", paddingLeft: "70px" }}>
                <Grid className='headerStyle'> File Manager </Grid>
                {searchedData && searchedData.map((item) => {
                    return(
                        <React.Fragment key={item.id}>
                            <Grid style={{ borderBottom: "1px solid lightgrey" }} container spacing={1}>
                                <Grid container item xs={9} sm={10}>

                                    <Grid item xs={4} style={{ padding: "5px" }}>
                                        <Typography>Name</Typography>
                                        <Typography className='typoHeaderStyle'>
                                            {item.metadata.name}
                                        </Typography>
                                        
                                    </Grid>

                                    <Grid item xs={4} style={{ padding: "5px" }}>
                                        <Typography>ID</Typography>
                                        <Typography className='typoContentStyle'>
                                            <Link to={`/files/${item.id}`}>{item.id}</Link>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={4} style={{ padding: "5px" }}>
                                        <Typography>Last Updated</Typography>
                                        <Typography className='typoContentStyle'>
                                            {item.update_date.replace(/T|Z/g, "  ").split(".")[0]}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={4} style={{ padding: "5px" }}>
                                        <Typography>Type</Typography>
                                        <span className='typoContentStyle'>
                                            {item.file_type}
                                        </span>
                                    </Grid>
                                </Grid>

                                <Grid item xs={3} sm={2} style={{ paddingTop: "15px" }}>
                                    <Button variant="contained" className={classes.button} onClick={handleMetadataClick}>
                                        Show Metadata
                                    </Button>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    ) 
                })}
            </Grid>
        </div>
    )
}

export default SearchContent;