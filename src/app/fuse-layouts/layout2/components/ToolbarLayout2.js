import { AppBar, Hidden, Toolbar } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  IconButton,
  Icon,
  SvgIcon,
  TextField,
  Tooltip,
} from "@material-ui/core";

import Logo from "app/fuse-layouts/shared-components/Logo";
// import {FuseSearch, FuseShortcuts} from '@fuse';
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
// import QuickPanelToggleButton from 'app/fuse-layouts/shared-components/quickPanel/QuickPanelToggleButton';
// import ChatPanelToggleButton from 'app/fuse-layouts/shared-components/chatPanel/ChatPanelToggleButton';
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import { Redirect } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const userServiceURL = `${process.env.REACT_APP_SCIDUCT_USER_SERVICE}`;
const logoutURL = `${process.env.REACT_APP_LOGOUT_URL}`;
const registrationURL =
  userServiceURL + "/register?redirect=" + encodeURIComponent(logoutURL);
const sciductID = `${process.env.REACT_APP_SCIDUCT_APP_ID}`;
var loginURL = userServiceURL + "/authenticate/" + sciductID;

const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider,
  },
  underline: {
    "&&&:before": {
      borderBottom: "1px solid white",
      borderRadius:"none !important",
      outline:"none !important"
    },
    "&&&:after": {
      borderBottom: "none",
    },
  },
  input: {
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #1E2125 inset",
      WebkitTextFillColor: "white",
      WebkitCaretColor: "white",
    },
  },
}));

function ToolbarLayout2(props) {
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const user = useSelector(({ auth }) => auth.user);
  const classes = useStyles(props);

  ///Search Functionality for mobile(Responsive)
  const [outerSearchFlag, setOuterSearchFlag] = useState(false);
  const [cancelFlag, setCancelFlag] = useState(false);
  const [innerSearchClick, setInnerSearchClick] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showLogo, setShowLogo] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOuterSearch = (event) => {
    event.preventDefault();
    setCancelFlag(false);
    setOuterSearchFlag(true);
    setShowLogo(false);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setCancelFlag(true);
    setOuterSearchFlag(false);
    setInnerSearchClick(false);
    setShowLogo(true);
  };

  const handleSearchTextChange = (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
    setInnerSearchClick(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setInnerSearchClick(true);
  };
  ///

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className="flex relative z-10"
        color="default"
        style={{ backgroundColor: toolbarTheme.palette.background.default }}
      >
        <Hidden mdUp>
          <Toolbar className="  container  p-0 ">
            {config.navbar.display && (
              <Hidden mdUp>
                <NavbarMobileToggleButton className="w-64 h-64 p-0" />
                <div className={classes.separator} />
              </Hidden>
            )}

            <div className="flex flex-1 flex-col items-center text-center">
              <div className="flex flex-shrink-0 items-center pl-8 pr-16 m-auto">
                {showLogo && <Logo />}
              </div>
            </div>
            {outerSearchFlag && (
              <TextField
                id="outlined-search"
                label="Search field"
                type="search"
                InputProps={{ classes }}
                variant="standard"
                style={{ width: "inherit", caretColor: "white" , flexGrow:"3"}}
                onChange={handleSearchTextChange}
                onKeyPress={handleKeyPress}
                autoFocus
                autoComplete="off"
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

                  <Tooltip title="Advanced Search" placement="bottom" >
                    <IconButton aria-label="AdvancedSearch" disabled >
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
                            fill="#525c69"
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
                  {/* {!user.role || user.role.length === 0 ? (
                    <></>
                  ) : ( */}
                    <Tooltip title="Search" placement="bottom">
                      <IconButton
                        id="outerSearch"
                        aria-label="Search"
                        onClick={handleOuterSearch}
                        style={{paddingRight: user.role.length !== 0 ? '0' : '12'}}
                      >
                        <Icon>search</Icon>
                      </IconButton>
                    </Tooltip>
                  {/* )} */}
                </>
              )}
            </div>

            <div className="flex pr-17">
              {!user.role || user.role.length === 0 ? (
                <React.Fragment>
                  <Tooltip title="Account">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      style={{paddingRight: 17 }}
                    >
                      <Avatar  sx={{ width: 29, height: 29 }}></Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 5,
                          width: 9,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem>
                      <a href={loginURL}>Login</a>
                    </MenuItem>
                    <MenuItem>
                      <a href={registrationURL}>Register</a>
                    </MenuItem>
                  </Menu>
                  
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <UserMenu />
                </React.Fragment>
              )}
            </div>

            {innerSearchClick && searchText && (
              <Redirect to={{ pathname: "/search", search: `${searchText}` }} />
            )}
            {cancelFlag && <Redirect to="/home" />}
          </Toolbar>
        </Hidden>
      </AppBar>
    </ThemeProvider>
  );
}

export default ToolbarLayout2;
