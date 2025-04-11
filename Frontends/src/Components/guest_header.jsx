import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar,
  Divider,
  ListItemIcon,
  makeStyles 
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useNavigate } from 'react-router-dom';
import {
  AccountCircle,
  ExitToApp,
  Settings,
  Person,
  Edit
} from '@material-ui/icons';
import './guest_header.css';

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    minWidth: 220,
    borderRadius: 8,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    marginTop: theme.spacing(1),
    '& .MuiListItemIcon-root': {
      minWidth: 36,
      color: theme.palette.text.secondary
    },
    '& .MuiMenuItem-root': {
      padding: theme.spacing(1.5, 2),
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        '& .MuiListItemIcon-root': {
          color: theme.palette.primary.main
        }
      }
    }
  },
  menuHeader: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1)
  },
  avatarLarge: {
    width: 60,
    height: 60,
    marginBottom: theme.spacing(1)
  },
  usernameText: {
    fontWeight: 600,
    color: theme.palette.text.primary
  },
  emailText: {
    color: theme.palette.text.secondary,
    fontSize: '0.8rem'
  },
  logoutItem: {
    color: theme.palette.error.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.error.main
    }
  }
}));

const Header = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loginType, setLoginType] = useState('');
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleLoginUpdate = (event) => {
      const { username: newUsername, email, profilePicture } = event.detail;
      
      if (email === 'admin@gmail.com') {
        setUsername('Admin');
        setUserEmail(email);
        setProfilePicture(null);
        setLoginType('admin');
      } 
      else if (newUsername) {
        setUsername(newUsername);
        setUserEmail(email || '');
        setProfilePicture(profilePicture || null);
        setLoginType('user');
      } 
      else {
        setUsername('User');
        setUserEmail('');
        setProfilePicture(null);
        setLoginType('');
      }
    };

    window.addEventListener('loginUpdate', handleLoginUpdate);

    const storedEmail = localStorage.getItem('userEmail');
    const storedUsername = localStorage.getItem('username');
    const storedProfilePicture = localStorage.getItem('profilePicture');

    if (storedEmail === 'admin@gmail.com') {
      setUsername('Admin');
      setUserEmail(storedEmail);
      setProfilePicture(null);
      setLoginType('admin');
    } else if (storedUsername) {
      setUsername(storedUsername);
      setUserEmail(storedEmail || '');
      setProfilePicture(storedProfilePicture || null);
      setLoginType('user');
    }

    return () => {
      window.removeEventListener('loginUpdate', handleLoginUpdate);
    };
  }, []);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePicture');
    
    // Force state update before closing menu
    setUsername('User');
    setUserEmail('');
    setProfilePicture(null);
    setLoginType('');
    
    window.dispatchEvent(new CustomEvent('loginUpdate', {
      detail: { username: 'User', email: '' }
    }));
    
    handleClose();
    navigate('/login');
  };

  return (
    <Box className="header-container">
      <Box className="guest_header">
        <Box className="contact-section">
          <Typography variant="body1">
            Call Now: <br />
            0717901354 / 0703399599
          </Typography>
        </Box>

        <Box className="logo-section">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              src="https://intercambioeviagem.com.br/wp-content/uploads/2016/08/TravelMate-Logo.png"
              alt="Logo"
              className="logo"
            />
          </Link>
        </Box>

        <Box className="icon-section">
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>

          <Typography variant="body1" style={{ marginLeft: '8px', color: '#fff' }}>
            Hi, {username}
          </Typography>
          <IconButton color="inherit" onClick={handleProfileClick}>
            <Avatar
              src={profilePicture || "https://www.w3schools.com/howto/img_avatar.png"}
              alt="User Avatar"
              style={{ width: 40, height: 40 }}
            />
          </IconButton>

          {isMenuOpen && (
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              getContentAnchorEl={null}
              PaperProps={{
                className: classes.menuPaper
              }}
              elevation={3}
            >
              <Box className={classes.menuHeader}>
                <Avatar 
                  src={profilePicture || "https://www.w3schools.com/howto/img_avatar.png"} 
                  className={classes.avatarLarge}
                />
                <Typography variant="subtitle1" className={classes.usernameText}>
                  {username}
                </Typography>
                {userEmail && (
                  <Typography variant="body2" className={classes.emailText}>
                    {userEmail}
                  </Typography>
                )}
              </Box>

              {loginType === 'admin' && (
                <>
                  <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Admin Dashboard
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} className={classes.logoutItem}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    Logout Admin
                  </MenuItem>
                </>
              )}

              {loginType === 'user' && (
                <>
                  <MenuItem onClick={() => { navigate('/view-packages'); handleClose(); }}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    View Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/edit-profile'); handleClose(); }}>
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    Edit Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} className={classes.logoutItem}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </>
              )}

              {loginType === '' && (
                <MenuItem onClick={() => { navigate('/login'); handleClose(); }}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                    Login
                  </MenuItem>
                )}
              </Menu>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

export default Header;