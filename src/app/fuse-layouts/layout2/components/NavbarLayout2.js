import React, { useState } from "react";
import { useSelector } from "react-redux";
import  { Redirect } from 'react-router-dom'

import {IconButton, Icon, SvgIcon, TextField, Tooltip} from "@material-ui/core";

// import { FuseScrollbars } from '@fuse';
import Logo from "app/fuse-layouts/shared-components/Logo";
import Navigation from "app/fuse-layouts/shared-components/Navigation";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
// import UploadStatus from 'app/main/file-manager/UploadStatus';

function NavbarLayout2() {
  const user = useSelector(({ auth }) => auth.user);
  const [outerSearchFlag, setOuterSearchFlag] = useState(false);
  const [cancelFlag, setCancelFlag] = useState(false);
  const [innerSearchClick, setInnerSearchClick] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleOuterSearch = (event) => {
    event.preventDefault();
    setCancelFlag(false);
    setOuterSearchFlag(true);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setCancelFlag(true);
    setOuterSearchFlag(false);
    setInnerSearchClick(false);
  };

  const handleSearchTextChange = (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
    setInnerSearchClick(false);
  }

  const handleSearch = (event) => {
    event.preventDefault();
    setInnerSearchClick(true);
  }


  return (
    <div className="flex flex-auto justify-between items-center w-full h-full container p-0 lg:px-24">
      <div className="flex flex-shrink-0 items-center pl-8 pr-16">
        <Logo />
      </div>
      {outerSearchFlag && (
        <TextField
          id="outlined-search"
          label="Search field"
          type="search"
          variant="standard"
          style={{ width: "inherit" }}
          onChange={handleSearchTextChange}
          autoFocus
        />
      )}

      <div className="flex h-full items-center">
        {outerSearchFlag ? (
          <>
            <Tooltip title="Search" placement="bottom">
              <IconButton aria-label="Search" onClick={handleSearch}>
                <Icon>search</Icon>
              </IconButton>
            </Tooltip>

            <Tooltip title="Advanced Search" placement="bottom">
              <IconButton aria-label="AdvancedSearch">
                <SvgIcon>
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17.000000pt"
                    height="17.000000pt"
                    viewBox="0 0 24.000000 24.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)"
                      fill="white"
                      stroke="none"
                    >
                      <path
                        d="M87 200 c-10 -12 -22 -18 -28 -14 -18 11 -38 -27 -25 -48 8 -13 8
                                -23 0 -36 -13 -21 7 -59 25 -48 6 4 18 -2 28 -14 10 -11 20 -20 23 -20 12 0
                                -2 59 -16 71 -28 23 -10 69 27 69 9 0 22 -7 29 -15 28 -33 80 -6 55 29 -8 10
                                -18 15 -24 12 -6 -4 -18 2 -28 14 -10 11 -24 20 -33 20 -9 0 -23 -9 -33 -20z"
                      />
                      <path
                        d="M146 94 c-32 -32 -6 -88 38 -82 11 1 26 -1 33 -5 6 -4 14 -3 17 2 4
                                5 2 12 -2 15 -5 3 -7 16 -5 29 9 46 -48 75 -81 41z m59 -34 c0 -18 -6 -26 -23
                                -28 -24 -4 -38 18 -28 44 3 9 15 14 28 12 17 -2 23 -10 23 -28z"
                      />
                    </g>
                  </svg>
                </SvgIcon>
              </IconButton>
            </Tooltip>

            <Tooltip title="Cancel" placement="bottom">
              <IconButton aria-label="Cancel" onClick={handleCancel}>
                <Icon>cancel</Icon>
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            {user.role && user.role.length > 0 && (
                <Tooltip title="Search" placement="bottom">
                  <IconButton aria-label="Search" onClick={handleOuterSearch}>
                    <Icon>search</Icon>
                  </IconButton>
                </Tooltip>
              )}
            <Navigation className="w-full " layout="horizontal" />
            {/* <UploadStatus /> */}
            {!user.role || user.role.length === 0 ? (
              <></>
            ) : (
              <>
                <UserMenu />
              </>
            )}
          </>
        )}
      </div>

      {innerSearchClick && searchText && (
        <Redirect
          to={{ pathname: "/search", state: { searchText: searchText } }}
        />
      )}
      {cancelFlag && <Redirect to="/home" />}
    </div>
  );
}

export default NavbarLayout2;
