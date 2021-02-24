import React, { useEffect, useState } from 'react';
import { Typography, LinearProgress, TableRow, Table, TableCell, TableHead, TableBody } from '@material-ui/core';
import JSONTree from 'react-json-tree'
import { FuseAnimate } from '@fuse';
import { Vega } from 'react-vega';
import Download from './Download';

function Preview(props) {
  var extentionType = props.type;
  const [data, setData] = useState("");
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const [downloadFlag, setDownloadFlag] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [previewmsg, setPreviewmsg] = useState("");
  var token = localStorage.getItem('id_token')

  function DownloadFile(issue) {
    setDownloadFlag(true)
    setPreviewmsg(issue)
  }

        if(typeof(token) === "string" && (props.type === "pdf" || props.type === "png" || props.type === "jpeg" || props.type === "jpg" || props.type === "excel" || props.type === "mp3" || props.type === "mp4")) {
          var config = {
            method: 'get',
            url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${props.fileId}`,
            headers: { 
              'Accept': '*/*',
              'Authorization': token
            },
            responseType: 'arraybuffer' 
         };
      }

       else if(typeof(token) == "string") {
        var config = {
          method: 'get',
          url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${props.fileId}`,
          headers: { 
            'Accept': '*/*',
            'Authorization': token
          },
       };
    }

    else if(typeof(token) == "object") {
      var config = {
        method: 'get',
        url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${props.fileId}`,
        headers: { 
          'Accept': '*/*'
        }
     };
  }

  else if (typeof (token) == "object") {
    config = {
      method: 'get',
      url: `https://sciduct.bii.virginia.edu/filesvc/file/${props.fileId}`,
      headers: {
        'Accept': '*/*'
      }
    };
  }

  function HandleError() {
    setError(true)
    setErrormsg("The file might be corrupted and can't be previewed.")
  }

  useEffect(() => {
    var axios = require('axios');

    setTimeout(() => {
      async function insertData() {
        var request = axios(config)
        await request.then((response) => {
          setData(response.data)
          setLoad(true)
        }).catch(err => {
          setError(true)
          setLoad(true)
          if (err.response.status === 403) {
            setErrormsg('You do not have permissions to preview this file.')
          }
          else if (err.response.status === 404) {
            setErrormsg('File not found.')
          }
          else
            setErrormsg('An error occurred while loading file preview. Please click on file again to reload.')
        });
      }
      if (props.size <= 3200000 && props.perm === "true")
        insertData()
      else {
        setLoad(true)
      }
    }, 2000);

    return () => {
      localStorage.removeItem('nodeId')
      localStorage.removeItem('nodeName')
      localStorage.removeItem('nodeSize')
      localStorage.removeItem('nodeType')

    };
  }, []);

  if (load === false)
    return (
      <div className="flex flex-1 flex-col items-center justify-center mt-40">
        <Typography className="text-20 mt-16" color="textPrimary">Loading </Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    );

  if (props.perm === "false")
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Typography className="text-20 mt-16" color="textPrimary">You do not have enough permissions to preview this file.</Typography>
      </div>
    );

  if (downloadFlag) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        {previewmsg === 'unable' ?
          <Typography className="text-20 mt-16" color="textPrimary">Unable to preview files of this type. Click <a href={() => false}className='cursor-pointer' onClick={() => DownloadFile()}>here</a> to download.</Typography>
          :
          <Typography className="text-20 mt-16" color="textPrimary">The file size is too large and is not available for preview.  Click <a href={() => false}className='cursor-pointer' onClick={() => DownloadFile('large')}>here</a> to download.</Typography>}
        <Download setDownloadFlag={(p) => setDownloadFlag(p)} name={props.name} size={props.size} fileId={props.fileId} type={props.type}></Download>
      </div>
    )
  }

  else if (error === true)
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Typography className="text-20 mt-16" color="textPrimary">{errormsg}</Typography>
      </div>
    );

  else if (props.size > 3200000)
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Typography className="text-20 mt-16" color="textPrimary">The file size is too large and is not available for preview.  Click <a href={() => false}className='cursor-pointer' onClick={() => DownloadFile('large')}>here</a> to download.</Typography>
      </div>
    );

  else if ((extentionType === 'text' || extentionType === 'txt'))
    return (<iframe title='extentionType' width="100%" height="400" src={`data:text/plain;,${data}`}>  </iframe>
    );
  else if ((extentionType === 'pdf')) {
    var pdfData = Buffer.from(data, 'binary').toString('base64')
    return (<iframe title='extentionType' width="100%" height="400" src={`data:application/pdf;base64,${pdfData}`}>  </iframe>
    );
  }

  else if ((extentionType === 'population+text' || extentionType === 'population_network+text')) {
    var allTextLines = data.split(/\r\n|\n/);
    var headers = allTextLines[1].split(',');
    var lines = [];

    for (var i = 2; i < allTextLines.length; i++) {
      var dataCsv = allTextLines[i].split(',');
      if (dataCsv.length === headers.length) {

        var tarr = [];
        for (var j = 0; j < headers.length; j++) {
          tarr.push(dataCsv[j]);
        }
        lines.push(tarr);
      }
      var outputData = lines;
    }
    return (
      <div style={{ overflow: 'auto' }}>
        <JSONTree data={JSON.parse(allTextLines[0])} hideRoot={true} theme={{
          tree: {
            backgroundColor: '#F7F7F7'
          },
          label: {
            color: 'black',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        }} />
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((el, i) => (<TableCell key={i} >{el}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {outputData.map((e1, k) => {
                return (
                  <TableRow key={k}>
                    {e1.map((e2, j) => <TableCell key={j}>{e2}</TableCell>)}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </FuseAnimate>
      </div>
    );
  }

  else if ((extentionType === 'csv')) {
    allTextLines = data.split(/\r\n|\n/);
    headers = allTextLines[0].split(',');
    lines = [];

    for (i = 1; i < allTextLines.length; i++) {
      dataCsv = allTextLines[i].split(',');
      if (dataCsv.length === headers.length) {

        tarr = [];
        for (j = 0; j < headers.length; j++) {
          tarr.push(dataCsv[j]);
        }
        lines.push(tarr);
      }
      outputData = lines;
    }
    return (
      <div style={{ overflow: 'auto' }}>
        <FuseAnimate>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((el, i) => (<TableCell key={i}>{el}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {outputData.map((e1, k) => {
                return (
                  <TableRow key={k}>
                    {e1.map((e2, j) => (<TableCell key={j}>{e2}</TableCell>))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </FuseAnimate>
      </div>
    );
  }

  else if ((extentionType === 'json' || extentionType === 'geographical_region' || extentionType === 'epihiperDiseaseModel' || extentionType === 'epihiperInitialization' || extentionType === 'epihiperIntervention' || extentionType === 'epihiperTraits')) {
    if (typeof (data) === "object")
      return (
        <JSONTree data={data} hideRoot={true} theme={{
          tree: {
            backgroundColor: '#F7F7F7'
          },
          label: {
            color: 'black',
            fontSize: '14px',
            fontWeight: 'bold'
          },
        }} />
      )
    else {
      return (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Typography className="text-20 mt-16" color="textPrimary">The file might be corrupted and can't be previewed.</Typography>
        </div>
      )
    }
  }

  else if (extentionType === 'vegalite+json') {
    const style = {
      margin: "auto",
      marginTop: "20px",
      width: "max-content",
      display: "block",
      overflow: 'auto'
    }
    if (typeof (data) === "object")
      return (
        <div style={{ overflow: 'auto' }}>
          <div style={style}>
            <Vega spec={data} data={data.datasets} />
          </div>
        </div>
      );
    else {
      return (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Typography className="text-20 mt-16" color="textPrimary">The file might be corrupted and can't be previewed</Typography>
        </div>
      )
    }
  }

  else if ((extentionType === 'png' || extentionType === 'jpg' || extentionType === 'jpeg')) {
    const styles = {
      margin: "auto",
      marginTop: "20px"
    }
    var imgData = Buffer.from(data, 'binary').toString('base64')
    if (window.innerWidth < 768)
      return (
        <img alt='img' onError={() => HandleError()} src={`data:image/png;base64,${imgData}`} width="100%" style={styles} />
      );
    else
      return (
        <img alt='img' onError={() => HandleError()} src={`data:image/png;base64,${imgData}`} width="50%" display="block" style={styles} />
      );
  }

  else if ((extentionType === 'mp4')) {
    const styles = {
      margin: "auto",
      marginTop: "20px"
    }
    var videoData = Buffer.from(data, 'binary').toString('base64');
    if (window.innerWidth < 768)
      return (
        <video width="100%" style={styles} controls>
          <source onError={() => HandleError()} src={`data:video/mp4;base64,${videoData}`}></source>
        </video>
      );
    else
      return (
        <video width="50%" style={styles} controls>
          <source onError={() => HandleError()} src={`data:video/mp4;base64,${videoData}`}></source>
        </video>
      );
  }

  else if ((extentionType === 'mp3')) {
    const styles = {
      margin: "auto",
      marginTop: "70px"
    }
    var audioData = "Buffer.from(data, 'binary').toString('base64')"
    return (
      <audio width="50%" display="block" style={styles} controls>
        <source onError={() => HandleError()} src={`data:audio/mp3;base64,${audioData}`}></source>
      </audio>
    );
  }

  else
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Typography className="text-20 mt-16" color="textPrimary">Unable to preview files of this type. Click <a href={() => false}className='cursor-pointer' onClick={() => DownloadFile("unable")}>here</a> to download.</Typography>
      </div>
    );
}

export default Preview;
