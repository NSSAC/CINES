import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom';

function CancelJob(props) {
    var token = localStorage.getItem('id_token')
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cancelId, setCancelId] = useState("");
    const [errorMsg, setErrorMsg] = useState();
    var axios = require('axios')

    var config = {
        method: 'post',
        url: `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance`,
        headers: {
            'Content-type': 'application/jsonrequest',
            'Authorization': token
        },
        data: { "jsonrpc": "2.0", "id": 1, "method": "cancelJob", "params": [props.id] }
    }
    useEffect(() => {
        CancelData()
        // eslint-disable-next-line
    }, [])

    function CancelData() {
        setCancelId(props.id)
        var request = axios(config)
        request.then(response => {
            setSuccess(true)
            localStorage.setItem("cancelledJob", props.id)
            setTimeout(() => {
                props.setCancelJob(false)
            }, 3000)
        })
            .catch(error => {
                setError(true)
                if (error.response)
                setErrorMsg(`${error.response.status}-${error.response.statusText} error occured. Please try again`)
              else
                setErrorMsg("An internal error occured. Please try again")
                setTimeout(() => {
                    props.setCancelJob(false)
                }, 3000);
            });
    }

    return (
        ReactDOM.createPortal(<div>
            {error === true && cancelId === props.id && <div> {toast.error(errorMsg)}</div>}

            {success === true && cancelId === props.id && <div> {toast.success(`Job Id '${props.id}' cancelled successfully`)}</div>}
            <ToastContainer limit={1} bodyStyle={{ fontSize: "14px" }} position="top-right" />
        </div>, document.getElementById("portal"))
    )
}

export default CancelJob;