import React, { useEffect, useRef, useState } from 'react';
import { Icon, IconButton, Typography, Tooltip ,ClickAwayListener,Input} from '@material-ui/core';
import { FuseAnimate, FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import JobDefinitionFileList from './JobDefinitionFileList';
import MainSidebarHeader from './MainSidebarHeader';
import MainSidebarContent from './MainSidebarContent';
import clsx from 'clsx';
import { useHistory } from "react-router-dom";

function JobDefinitionListView(props) {

    const dispatch = useDispatch();
    const pageLayout = useRef(null);
    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");
    const history = useHistory();

    useEffect(() => {
        let start = 0
        let type = 'creation_date';
        let descShort = true;
        sessionStorage.setItem("isFilterApplied", JSON.stringify(false));
        sessionStorage.setItem("count", start);
        sessionStorage.setItem("shortOrder", JSON.stringify(descShort));
        dispatch(Actions.getJobDefinitionFiles(10, 1, descShort, type, false, false));
        sessionStorage.removeItem("selectedTypeArray")
        sessionStorage.removeItem("preStateValue")
        sessionStorage.removeItem("preJobTypeValue")
    }, [dispatch]);

    useEffect(()=>{
        return () => dispatch(Actions.clearData());
       /* eslint-disable-next-line */
    },[props.history])

    function showSearch() {
        setSearchbool(true);
        document.addEventListener("keydown", escFunction, false);
    }

    function hideSearch() {
        setSearchbool(false);
        setSearch("");
        document.removeEventListener("keydown", escFunction, false);
    }
    
    function handleClickAway() {
        search === '' && setSearchbool(false);
        document.removeEventListener("keydown", escFunction, false);
    }

    function escFunction(event) {
        if (event.keyCode === 27) {
            hideSearch();
        }
    }

    function navigateHome() {
        history.push('/home/')
    }

    return (
        <FusePageSimple
            classes={{
                root: "bg-red",
                header: "h-128 min-h-128",
                sidebarHeader: "h-128 min-h-128",
                // content: "contentStyle",
                // sidebarHeader: "h-96 min-h-96 sidebarHeader1",
                // sidebarContent: "sidebarWrapper",
                rightSidebar: "w-320",
                contentWrapper: "jobBody"
            }}
            header={
                <div className="flex flex-col flex-1 p-8 sm:p-12 relative">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col" style={{ flexGrow: "1" }}>
                            <div className="flex items-center mb-16">
                                <Icon className="text-18" className="cursor-pointer" color="action" onClick={navigateHome}>home</Icon>
                                <Icon className="text-17" color="action">chevron_right</Icon>
                                <Typography className="w-max" color="textSecondary">Job Definition</Typography>
                            </div>
                        </div>

                        {(
                            <FuseAnimate animation="transition.expandIn" delay={200}>
                                <span>
                                    <div className={clsx("flex", props.className)}>
                                        <Tooltip title="Click to search" placement="bottom">
                                            <div onClick={showSearch}>
                                                <IconButton className="w-64 h-64"><Icon>search</Icon></IconButton>    </div>
                                        </Tooltip>
                                        {searchbool && (
                                            <ClickAwayListener onClickAway={handleClickAway}>
                                                <div>
                                                    <div className="flex items-end ">
                                                        <Input
                                                            placeholder="&nbsp;Search"
                                                            className="flex flex-1 mb-8"
                                                            value={search}
                                                            inputProps={{
                                                                'aria-label': 'Search'
                                                            }}
                                                            onChange={(event) => setSearch(event.target.value)}
                                                            autoFocus
                                                        />
                                                        <Tooltip title="Click to clear and hide the search box" placement="bottom">
                                                            <IconButton onClick={hideSearch} className="mx-8 mt-8" >
                                                                <Icon>close</Icon>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </ClickAwayListener>
                                        )}
                                    </div>
                                </span>
                            </FuseAnimate>
                        )}

                    </div>
                </div>
            }
            content={
                <JobDefinitionFileList pageLayout={pageLayout} search={search} {...props} />
            }
            leftSidebarVariant="temporary"

            leftSidebarHeader={
                <MainSidebarHeader />
            }
            leftSidebarContent={
                <MainSidebarContent />
            }
            
            ref={pageLayout}
            innerScroll
        />
    )
}

export default withReducer('JobDefinitionApp', reducer)(JobDefinitionListView);
