import React, { useEffect, useState } from 'react';
import { DigitalLibrarianService } from "node-sciduct";

const SearchContent = (props) => {

    const url = `${process.env.REACT_APP_SCIDUCT_DIGITAL_LIBRARIAN_SERVICE}/`
    const token = localStorage.getItem('id_token');
    const digitalLibrarianServiceInstance = new DigitalLibrarianService(url, token);
    // console.log("digitalLibrarianServiceInstance", digitalLibrarianServiceInstance);

    const [searchText, setSearchText] = useState("");
    const [errorMsg, setErrorMsg] = useState();

    // if(props.location.state.searchText) {
    //     setSearchText(props.location.state.searchText);    
    // }

    useEffect(() => {
        console.log("SearchText -> ", props.location.state.searchText);
        digitalLibrarianServiceInstance.search(props.location.state.searchText)
            .then((res) => {
                console.log("SearchText Response", res);
            })
            .catch((error) => {
                if (error.response)
                    setErrorMsg(`${error.response.status}-${error.response.statusText} error occured. Please try again`)
                 else
                    setErrorMsg("An internal error occured. Please try again")
            })
    },[])
    

    return <>Searching...</>
}

export default SearchContent;