import React, {useState, useEffect} from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

function Download(props){
  const [error, setError] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  var token=localStorage.getItem('id_token')

        var axios = require('axios')

        if(typeof(token) === "string") {
        var config = {
          method: 'get',
          url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${props.fileId}`,
          headers: { 
            'Accept': 'application/octet-stream',
            'Authorization': token
          },
          responseType: 'blob' 

       };
    }

    else if(typeof(token) === "object") {
       config = {
        method: 'get',
        url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${props.fileId}`,
        headers: { 
          'Accept': 'application/octet-stream'
        },
        responseType: 'blob' 
     }

  }

  useEffect(() => {
    InsertData() 
    setTimeout(() => {
      if (props.setDownloadFlag)
        props.setDownloadFlag(false)
      else
        props.setDownload(false)
    }, 5500);
            // eslint-disable-next-line
  },[]) 

 function InsertData() {
      var request = axios(config)
     if (props.size > 5324860){
       setTimeout(() => {
          setIsLarge(true)
       }, 1000);
     }
       request.then((response) => {
      var ResponseData = response.data 
      DownloadData(ResponseData);
   }).catch(err => {
      setError(true)
      if (err.response.status === 403) {
        setErrormsg('403-You dont have permission to download this file.')
      }
      else if (err.response.status === 404) {
        setErrormsg('404-File not found.')
      }
      else
        setErrormsg('An error occurred while downloading the file. Please try again.')
   });
 } 
 
  function DownLoadFile(dataX, type){
      var blob = new Blob([dataX], {type: type});
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      document.body.appendChild(downloadLink);
      downloadLink.setAttribute('download', props.name);
      downloadLink.click();
   }

  function DownloadData(data) {
    if (props.type === 'txt' || props.type === 'text'|| props.type === 'population+text' || props.type === 'population_network+text' || props.type === 'epihiper_db+tgz' || props.type === 'tgz' || props.type === 'tar.gz') {
      DownLoadFile(data, 'application/octet-stream');
    }
    else if (props.type === 'pdf') {
      DownLoadFile(data, 'application/pdf');
    }
    else if (props.type === 'excel' || props.type === 'xls' || props.type === 'xlsx') {
      DownLoadFile(data, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }
    else if (props.type === 'csv') {
      DownLoadFile(data, 'text/csv');
    }
    else if (props.type === 'png') {
      DownLoadFile(data, 'image/png');
    }
    else if (props.type === 'jpeg' || props.type === 'jpg') {
      DownLoadFile(data, 'image/jpeg');
    }
    else if (props.type === 'gif') {
      DownLoadFile(data, 'image/gif');
    }
    else if (props.type === 'mp4') {
      DownLoadFile(data, 'video/mp4');
    }
    else if (props.type === 'mp3') {
      DownLoadFile(data, 'audio/mpeg');
    }
    else {
      DownLoadFile(data, 'text/json');
    }
  }

  if(error === true)
  return(
    <Modal center={true} open={true} showCloseIcon={false} closeOnOverlayClick={false} classNames styles>
      <p>{errormsg}</p>
    </Modal>
    )

  else if(isLarge)
    return(
      <Modal center={true} open={true} showCloseIcon={false} closeOnOverlayClick={false} classNames styles >
        <p>Please wait... Downloading will start in few minutes.</p>
      </Modal>
    )

  else 
    return (null)
}

export default Download;