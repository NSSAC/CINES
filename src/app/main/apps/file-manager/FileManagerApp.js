import React, {useEffect, useRef} from 'react';
import {Fab,Typography, Icon, IconButton} from '@material-ui/core';
import {FuseAnimate, FusePageSimple} from '@fuse';
import {useDispatch, useSelector} from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import FileList from './FileList';
import DetailSidebarHeader from './DetailSidebarHeader';
import DetailSidebarContent from './DetailSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import MainSidebarContent from './MainSidebarContent';
import Breadcrumb from './Breadcrumb';

function FileManagerApp(props)
{
    const dispatch = useDispatch();
    const files = useSelector(({fileManagerApp}) => fileManagerApp.files);
    const selectedItem = useSelector(({fileManagerApp}) => files[fileManagerApp.selectedItemId]);

    const pageLayout = useRef(null);
    var targetPath = props.location.pathname.replace("/apps/files","")

    useEffect(() => {
        //FIXME: Figure out how to get the routes base path.
        dispatch(Actions.getFiles(targetPath));
    }, [dispatch,props,props.location]);

    return (
        <FusePageSimple
        
            classes={{
                root         : "bg-red",
                header       : "h-96 min-h-96 sm:h-160 sm:min-h-160",
                sidebarHeader: "h-96 min-h-96 sm:h-160 sm:min-h-160",
                rightSidebar : "w-320"
            }}
            header={  
                 <div className="flex flex-col flex-1 p-8 sm:p-12 relative">
                    <div className="flex items-center justify-between">
                        <IconButton
                            onClick={(ev) => {
                            pageLayout.current.toggleLeftSidebar();}}
                            aria-label="open left sidebar">
                            <div className="flex flex-1 items-center justify-between pl-24">
                              <div className="flex flex-col">
                                <div className="flex items-center mb-16">
                                   <Icon className="text-18" color="action">home</Icon>
                                   <Icon className="text-16" color="action">chevron_right</Icon>
                                   <Typography color="textSecondary">File Manager</Typography>
                                </div>
                               <Typography variant="h6">File Manager</Typography>
                              </div>
                            </div>
                            {/* <Icon>menu</Icon> */}
                        </IconButton>
                        <FuseAnimate animation="transition.expandIn" delay={200}>
                            <IconButton aria-label="search">
                                <Icon>search</Icon>
                            </IconButton>
                        </FuseAnimate>
                    </div>
                  
                    <div className="flex flex-1 items-end">
                        {/* <FuseAnimate animation="transition.expandIn" delay={600}>
                            <Fab color="secondary" aria-label="add" className="absolute bottom-0 left-0 ml-16 -mb-28 z-999">
                                <Icon>add</Icon>
                            </Fab>
                        </FuseAnimate> */}
                        <FuseAnimate delay={200}>
                            <div>
                                { (
                                    <Breadcrumb props={props} path={targetPath} className="flex flex-1 pl-2 text-16 sm:text-16"/>
                                )}
                            </div>
                        </FuseAnimate>
                    </div>
                </div>
            }
            content={
                <FileList pageLayout={pageLayout}/>
            }
            leftSidebarVariant="temporary"
            leftSidebarHeader={
                <MainSidebarHeader/>
            }
            leftSidebarContent={
                <MainSidebarContent/>
            }
            rightSidebarHeader={
                <DetailSidebarHeader/>
            }
            rightSidebarContent={
                <DetailSidebarContent/>
            }
            ref={pageLayout}
            innerScroll
        />
    )
}

export default withReducer('fileManagerApp', reducer)(FileManagerApp);
