// import { Icon, MenuItem } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import React from 'react';
import { useRef, useState } from 'react';
import * as Actions from 'app/main/file-manager/store/actions';
import reducer from "app/main/file-manager/store/reducers";
import withReducer from "app/store/withReducer";
import FILEUPLOAD_CONFIG from "../../FileManagerAppConfig";
// import MenuTableCell from "./MenuTableCell";
import { useDispatch, useSelector } from "react-redux";
// import filesize from 'filesize';

import './FileUpload.css'
// import { toast } from 'material-react-toastify';

// import Typography from '@material-ui/core/Typography';

// //Start of import custom elements
import '../../../CustomWebComponents/cwe-fileUploader'
// //End of custom elements


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
  input: {
    padding: 10,
    display: "none",
  },
  typeIcon: {
    '&.clear:before': {
      content: "'clear'",
      color: 'white'
    },
    '&:before': {
      content: "'clear'",
      color: '#1565C0'
    }
  }

});

// const ellipsis = {
//   textOverflow: 'ellipsis',
//   whiteSpace: 'nowrap',
//   overflow: 'hidden',
//   maxWidth: '170px',
//   cursor: 'default'
// }

// const breadcrumb_wrap = {
//   width: '100%',
//   flexWrap: 'wrap'
// }

// const BorderLinearProgress = withStyles((theme) => ({
//   root: {
//     height: 10,
//     borderRadius: 5,
//   },
//   bar: {
//     borderRadius: 5,
//     backgroundColor: '#1a90ff',
//   },
// }))(LinearProgress);

function FileUpload({ fileTypes, path, showModal, handleClose, breadcrumbArr, dropped, setSelected, uploadButtonClicked, dialogCloseFlag, test }) {
  const dispatch = useDispatch();
  const file_types = useSelector(({ fileManagerApp }) => fileManagerApp.file_types);
  const uploader = useSelector(({ fileManagerApp }) => fileManagerApp.uploader);

  // const [isDrag, setDrag] = useState(false);
  const [uploadFiles, setUploadFiles] = useState(dropped || []);
  // const [disableButton, setDisableButton] = useState(true);

  // const classes = useStyles();
  const fileInput = useRef();

  var uploadableTypes = fileTypes || FILEUPLOAD_CONFIG.fileTypes

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');


  React.useEffect(() => {
    if (!file_types) {
      dispatch(Actions.getFileTypes())
    }else{
      setTimeout(() => {
        let cwe_fwiz = document.querySelector("cwe-fwiz")
        let temp_fileType = Object.values(file_types)
        if(cwe_fwiz){
          cwe_fwiz.setAttribute('file_types', JSON.stringify(temp_fileType))
        }
      },1000)

    }
    console.log(file_types)
  }, [dispatch, file_types])

  React.useEffect(() => {
    window.addEventListener('cancel-wizard', onCancelll )
    window.addEventListener('end-upload', onUploadd)
    return () => {
    window.removeEventListener('cancel-wizard', onCancelll )
    }
  },[])


  React.useEffect(() => {
    dispatch(Actions.validateFiles(uploadFiles))
  }, [dispatch, uploadFiles])

  // React.useEffect(() => {
  //   if (!uploader || !uploader.validated) {
  //     setDisableButton(true)
  //     return
  //   }
  //   if (uploader.validated.some((f) => !f.valid)) {
  //     setDisableButton(true)
  //   } else {
  //     setDisableButton(false)
  //   }

  //   if (uploader && uploader.recentItem) {
  //     if (setSelected) {
  //       let s = {}
  //       s[uploader.recentItem.id] = true;
  //       setSelected(s)
  //     }
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [uploader, uploader.validated])

  // const onChangeHandler = (event) => {
  //   const fileData = Object.keys(event.target.files).map((fk) => {
  //     var f = event.target.files[fk]
  //     var fobj = {}
  //     if (uploadableTypes.length === 1) {
  //       fobj.type = uploadableTypes[0]
  //     } else {
  //       fobj.type = uploadableTypes.indexOf(f.name.split('.').pop()) !== -1 && f.name.split('.').pop();
  //     }
  //     fobj.fileName = f.name;
  //     fobj.size = f.size;
  //     fobj['contents'] = f;
  //     return fobj
  //   })
  //   setUploadFiles(uploadFiles.concat(fileData));
  //   // setDisableButton(false);
  // }

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation()
  //   const draggedFiles = [];
  //   var mapped = {}
  //   uploadFiles.forEach((f) => {
  //     mapped[f.fileName] = true
  //   })
  //   if (e.dataTransfer.items) {
  //     Array.from(e.dataTransfer.items).forEach((item, i) => {
  //       if (item.kind === "file") {
  //         let file = item.getAsFile();
  //         let tempObj = {};
  //         if (uploadableTypes.length === 1) {
  //           tempObj.type = uploadableTypes[0]
  //         } else {
  //           tempObj.type = uploadableTypes.indexOf(file.name.split('.').pop()) !== -1 && file.name.split('.').pop();
  //         }
  //         tempObj.fileName = file.name;
  //         tempObj['contents'] = file;
  //         if (!mapped[tempObj.fileName]) {
  //           draggedFiles.push(tempObj);
  //         } else {
  //           toast.error(`${tempObj.fileName} already exists in the upload list.`)
  //         }
  //       }
  //     });

  //     setUploadFiles(uploadFiles.concat(draggedFiles));
  //     // setDisableButton(false);
  //   }
  //   setDrag(false);
  // };

  const onCancelll = (e) => {
    handleClose()
  }

  // const onCancel = () => {
  //   setUploadFiles([]);
  //   handleClose()
  // }

  const onUploadd = (event) => {
    const up_files = event.detail
    if(up_files.hasOwnProperty('uploadData')){

      const mapped = up_files['uploadData'].map((f) => {
        f['path'] = path
        return f
      })
      dispatch(Actions.addToUploadQueue(mapped))
    }
  }


  // const onUpload = () => {
  //   if(uploadButtonClicked) {
  //     uploadButtonClicked(true);
  //   }
  //   setDisableButton(true);
  //   const mapped = uploadFiles.map((f) => {
  //     f.path = path
  //     return f
  //   })
  //   console.log(mapped)
  //   dispatch(Actions.addToUploadQueue(mapped))
  //   setUploadFiles([])
  // }

  // const removeFile = (index => {
  //   console.log(uploadFiles)
  //   uploadFiles.splice(index, 1);
  //   setUploadFiles([...uploadFiles]);
  // })

  // const handleChangeUploadType = (f) => (e) => {
  //   f.type = e.target.value;
  //   setUploadFiles([...uploadFiles]);
  // }

  // const openFileDialog = () => {
  //   fileInput.current.value = ''
  //   fileInput.current.click();
  // };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation()
    // setDrag(true);
  };

  // const handleDragLeave = e => {
  //   e.preventDefault();
  //   e.stopPropagation()
  //   setDrag(false);
  // };


  // const handleDragStart = e => {
  //   e.preventDefault();
  //   e.stopPropagation()
  //   setDrag(true);
  // };

  function onEntered() {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    }
  }

  function onExiting() {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'relative';
    }
  }

  return (
    <Dialog
      open={showModal}
      TransitionComponent={Transition}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      onEntered={onEntered}
      onExiting={onExiting}
      // onDragEnter={handleDragStart}
      // onDrop={handleDrop}
      onDragOver={handleDragOver}
      // onDragLeave={handleDragLeave}
      // onClose={handleClose}
    >
      <DialogContent style={{backgroundColor: "#ffffff"}}>

        <cwe-fwiz path={JSON.stringify(path)} uploadableTypes={JSON.stringify(uploadableTypes)} ></cwe-fwiz>

      </DialogContent>  
      <hr></hr>
      {/* <DialogTitle id="alert-dialog-slide-title" divider="true">
        Upload Files
        <DialogContentText className='mb-0' id="alert-dialog-slide-description">
          {breadcrumbArr ? <span className="flex text-16 sm:text-16" style={breadcrumb_wrap}>
            {breadcrumbArr.map((path, i) => (
              <span key={i} className="flex items-center" >
                <span title={path} style={ellipsis} >{path} </span>
                {breadcrumbArr.length - 1 !== i && (
                  <Icon>chevron_right</Icon>
                )}
              </span>))}
          </span> : null}
        </DialogContentText>
      </DialogTitle>

      <DialogContent divider="true">
        <div className={`${isDrag ? "drag" : ""}`}>
          <input className={classes.input} ref={fileInput} type="file" multiple onChange={onChangeHandler} />
          <div className="w-full text-center items-center"><Button className={`rounded`} color="primary" variant="contained" onClick={openFileDialog} type="button" >Choose or Drop File</Button></div>

          {uploader && uploader.validated && (uploader.validated.length > 0) && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell className="table-cell">Type</TableCell>
                  <TableCell className="table-cell">Size</TableCell>
                  {(uploadFiles.length !== 0) && (<TableCell className=" p-0 text-center"></TableCell>)}
                </TableRow>
              </TableHead>

              <TableBody className="p-0 text-center">
                {((uploader.validated.length < 1) && (!uploader || (uploader.queue && uploader.queue.length === 0))) && (
                  <TableRow className="cursor-pointer">
                    <TableCell className="table-cell text-center" colSpan={4}>No file selected</TableCell>
                  </TableRow>
                )}

                {uploader.validated.map((node, index) => {
                  return (
                    <TableRow
                      key={index}
                      className="cursor-pointer" >

                      <TableCell style={{ wordBreak: 'break-all' }} className="p-0 table-cell">{node.fileName}</TableCell>
                      {uploadableTypes.length > 0 ?
                        <MenuTableCell
                          value={node.type ? node.type : ""}
                          onChange={handleChangeUploadType(node)}
                        >
                          <MenuItem value="" disabled >
                            Select File Type
                          </MenuItem>
                          {uploadableTypes.map((item, index) => {
                            return (
                              <MenuItem key={index} value={item}>{item}</MenuItem>
                            )
                          })}
                        </MenuTableCell> :
                        <TableCell className="table-cell">{uploadableTypes[0]}</TableCell>}
                      <TableCell className="table-cell">{filesize(node.contents.size)}</TableCell>
                      <TableCell className="table-cell">
                        <RemoveCircleOutlineIcon onClick={() => { removeFile(index) }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {uploader && uploader.queue && (uploader.queue.length > 0) && (
            <Table className="mt-4 w-full b-0">
              <TableHead>
                <TableRow className="hidden"><TableCell></TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Active Uploads</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploader.queue.map((node, index) => {
                  return (
                    <TableRow
                      key={index}
                      className="cursor-pointer" >
                      <TableCell style={{ wordBreak: 'break-all' }} className="p-0 table-cell">{node.fileName}</TableCell>
                      <TableCell className="table-cell">
                        {(() => {
                          function _fs(loaded, total) {
                            var lval;
                            const t = filesize(total || 0, { output: "object", pad: true, round: 2 })
                            const l = filesize(loaded || 0, { output: "object", pad: true, round: 2 })
                            lval = `${l.value} ${l.symbol}`
                            if (t.symbol === l.symbol) {
                              lval = l.value
                            } else {
                              lval = `${l.value} ${l.symbol}`
                            }

                            return `${lval}/${t.value} ${t.symbol}`
                          }
                          return _fs(node.loaded, node.total)
                        })()}
                      </TableCell>
                      <TableCell className="table-cell nowrap" ><BorderLinearProgress style={{ width: "150px" }} variant="determinate" value={node.percentage || 0} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onUpload} variant="contained"
          color="default"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          disabled={uploadFiles.length === 0 || disableButton} >
          Upload
        </Button>

        <Button onClick={onCancel}>
          Close
        </Button>

      </DialogActions> */}
    </Dialog>

  );
}

export default withReducer("fileManagerApp", reducer)(FileUpload);