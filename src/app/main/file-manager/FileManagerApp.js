import { Icon, LinearProgress, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

import withReducer from "app/store/withReducer";

import Breadcrumb from "./Breadcrumb";
import FileList from "./FileList/";
import { file_viewers_map } from "./FileManagerAppConfig";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";

import './FileManager.css'

const useStyles = makeStyles(theme => ({
  root                     : {
    backgroundColor: theme.palette.background.default,
  },
  header                     :{
    background     : 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.dark + ' 100%)',
    color          : theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark
  }
}));


function FileManagerApp(props) {
  const dispatch=useDispatch()
  const classes = useStyles(props);

  // const [editContent,setEditContent] = useState(false)
  // const [prompt,setPrompt] = useState(false)
  // const [search,setSearch] = useState("")
  const [fileActions,setFileActions] = useState()
  const file_meta = useSelector(({ fileManagerApp }) => fileManagerApp.file_meta);
  const file_path = "/" + ((props.match.params && props.match.params.path)?props.match.params.path:"")
  const history =  useHistory()

  React.useEffect(()=>{
    dispatch(Actions.getFileMeta(file_path))
  },[dispatch,file_path])

  React.useEffect(()=>{
    if (file_meta && !file_meta.isContainer){
      setFileActions()
    }

    if (file_meta && file_meta.isContainer && history.location.pathname.charAt(history.location.pathname.length-1)!=="/"){
        history.replace(`${history.location.pathname}/`)
    }

  },[file_meta, history,history.location.pathname]);

  if (!file_meta){
    return (
      <div className="flex flex-1 flex-col items-center justify-center mt-40">
        <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    )
  }
  
  function navigateHome(evt){
    evt.preventDefault()
    props.history.push("/home")
  }

  return (
      <div className={`${clsx(classes.root)} flex flex-col w-full h-full`}>
        <div className={`w-full items-center flex flex-row  min-h-72 justify-between ${clsx(classes.header)}`}>
          <div className="flex-initial text-baseline mt-18 mr-8">
                <Icon
                  className="ml-8 text-18 cursor-pointer inline align-top"
                  onClick={navigateHome}
                >
                  home
                </Icon>
                <Icon className="text-18" >
                  chevron_right
                </Icon>
                <Breadcrumb
                  props={props}
                  path={file_path}
                  className="text-white"
                />
          </div>
          <div className="flex-grow text-right flex-row text-lg m-0">
            {fileActions}
          </div>

        </div>
        <div className="flex-grow  m-0 p-0 overflow-hidden flex flex-col">
          {((file_meta,file_path)=>{
            if (file_meta && file_meta.error){
              return (<div>Oops, there was a problem retrieving this file: {file_meta.error}</div>)
            }
            if (!file_meta || !file_meta.id){
              return (
                <div className="flex flex-1 flex-col items-center justify-center mt-40">
                  <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                  <LinearProgress className="w-xs" color="secondary" />
                </div>
              )
            }

            if (file_viewers_map[file_meta.type]){
              const Comp = file_viewers_map[file_meta.type]
              return <Comp  {...props} meta={file_meta} path={file_path} setFileActions={setFileActions} />
            }

            if (file_meta.isContainer){
              return <FileList
                meta={file_meta}
                path={file_path}
                enableCheckBoxes={true}
                setFileActions={setFileActions}
              />
            }

            return (
              <div>
                <p>No viewer available for files of this type.</p> 
              </div>
            )
          })(file_meta,file_path)}
        </div>
      </div>
  )
}

export default withReducer("fileManagerApp", reducer)(FileManagerApp);
