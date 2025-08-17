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

export const LoginPage = ({ onLogin }) => {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: "center",
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box sx={{ mb: 4 }}>
              <FitnessCenter 
                sx={{ 
                  fontSize: 80, 
                  color: 'primary.main',
                  mb: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }} 
              />
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                AI FitTracker Pro
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 1
                }}
              >
                Your Personal Fitness Journey
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                Track your workouts, monitor your progress, and achieve your fitness goals with our comprehensive activity tracker and analyse your each workout with AI. Isn't it fun?
              </Typography>
            </Box>
            
            <Stack spacing={2} alignItems="center">
              <Button 
                variant="contained" 
                size="large"
                onClick={() => onLogin()}
                startIcon={<DirectionsRun />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started
              </Button>
              
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2 }}>
                Secure OAuth2 Authentication
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  };