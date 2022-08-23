import {
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from "@material-ui/core";
// import { Hidden } from '@material-ui/core';
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';


import * as authActions from "app/auth/store/actions";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  hideIcon: {
    [theme.breakpoints.down('md')]: {
      display: "none !important"
    },

  }
}));


function UserMenu(props) {
  const [device, setDevice] = useState(false);
  const classes = useStyles(props);

  useEffect(() => {
    if (
      /Android|webOS|iPhone|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(
        navigator.userAgent
      )
    ) {

      setDevice(true);

    } 
  }, []);

  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);

  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };



  return (
    <React.Fragment>
      <Button className="h-40 px-0" onClick={userMenuClick}>
        {/* <Hidden only={['lg', 'md']}>
                {user.data.photoURL ?
                    (
                        <Avatar className="" alt="user photo" src={user.data.photoURL}/>
                    )
                    :
                    (
                        <Avatar className="">
                         
                         {user.data.displayName[0]} {user.data.lastName[0]}
                        </Avatar>
                    )
                }
                 </Hidden> */}
                 
        <div className="flex flex-col  items-start">
          <Typography component="span" className="normal-case font-600 flex">
            {device ? (
              <Avatar style={{ backgroundColor: '#4c4a4a' , width: 29, height: 29, fontSize: '1.5rem', color:'#F7F7F7'}}>
                {user.data.displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
            ) : (
              user.data.displayName
            )}
          </Typography>
        </div>

        <Icon  className={`${classes.hideIcon} text-16 ml-12 hidden sm:flex `} variant="action">
          keyboard_arrow_down
        </Icon>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <React.Fragment>
            <MenuItem component={Link} to="/login">
              <ListItemIcon className="min-w-40">
                <Icon>lock</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Login" />
            </MenuItem>
            {/* <MenuItem component={Link} to="/register">
                            <ListItemIcon className="min-w-40">
                                <Icon>person_add</Icon>
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="Register"/>
                        </MenuItem> */}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MenuItem
              onClick={() => {
                dispatch(authActions.logoutUser());
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Logout" />
            </MenuItem>
          </React.Fragment>
        )}
      </Popover>
    </React.Fragment>
  );
}

export default UserMenu;
