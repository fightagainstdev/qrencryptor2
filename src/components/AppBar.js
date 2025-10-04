/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import GitHubIcon from "@material-ui/icons/GitHub";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/Firebase";
import VersionBadge from "./VersionBadge";
import Settings from "./Settings";
import { getTranslations as t } from "../../locales";

const useStyles = makeStyles((theme) => ({

  logo: {
    flexGrow: 1,
    marginTop: 10,
  },
  button: {
    textTransform: "none",
    color: theme.palette.diamondBlack.main,
  },
}));

export default function NavAppBar() {
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log('Auth state changed:', currentUser);
        setUser(currentUser);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    handleClose();
  };

  return (
    <div>
      <AppBar color="transparent" position="static" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" className={classes.logo}>
              <a href="/">
                <img src="/assets/images/logo.png" alt="logo" width="40" />
              </a>
              <VersionBadge />
            </Typography>

            <Button color="inherit" href="/about/" className={classes.button}>
              {t("about")}
            </Button>

            {user ? (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar src={user.photoURL ? `${user.photoURL}?t=${Date.now()}` : undefined} alt={user.displayName}>
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <AccountCircle />}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose} component="a" href="/profile/">Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button color="inherit" href="/login/" className={classes.button}>
                Login
              </Button>
            )}

            <IconButton
              href="https://github.com/fightagainstdev"
              target="_blank"
              rel="noopener"
            >
              <GitHubIcon />
            </IconButton>

            <Settings />
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
