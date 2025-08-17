import { 
  Box, 
  Button, 
  Typography, 
  AppBar, 
  Toolbar, 
  Container, 
  Paper, 
  Avatar, 
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Stack
} from "@mui/material";
import { 
  FitnessCenter, 
  Person, 
  ExitToApp, 
  Dashboard,
  DirectionsRun 
} from "@mui/icons-material";
import { useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router";


export const NavigationHeader = ({ user, onLogout }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    
    const handleProfileClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    const handleLogout = () => {
      handleClose();
      onLogout();
    };
  
    return (
      <AppBar 
        position="sticky" 
        elevation={2}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          mb: 3
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <FitnessCenter sx={{ mr: 2, fontSize: 28 }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/activities')}
            >
              AI FitTracker Pro
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Welcome back, {user?.name || 'User'}
            </Typography>
            
            <IconButton
              onClick={handleProfileClick}
              sx={{ 
                p: 0,
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                <Person />
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  boxShadow: 3
                }
              }}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/activities'); }}>
                <Dashboard sx={{ mr: 2 }} />
                Dashboard
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    );
  };