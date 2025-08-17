
import { 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Stack
  } from "@mui/material";
  import ActivityForm from "./ActivityForm";
  import ActivityList from "./ActivityList";

// Activities Page Component
export const ActivitiesPage = () => {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 1
            }}
          >
            Activity Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage and track your fitness activities
          </Typography>
        </Box>
        
        <Stack spacing={4}>
          {/* Activity Form Section */}
          <Paper 
            elevation={2}
            sx={{ 
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'semibold',
                color: 'primary.main',
                mb: 2
              }}
            >
              Add New Activity
            </Typography>
            <ActivityForm onActivitiesAdded={() => window.location.reload()} />
          </Paper>
          
          {/* Activity List Section */}
          <Paper 
            elevation={2}
            sx={{ 
              p: 3,
              borderRadius: 3,
              minHeight: 400
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'semibold',
                color: 'primary.main',
                mb: 2
              }}
            >
              Your Activities
            </Typography>
            <ActivityList />
          </Paper>
        </Stack>
      </Container>
    );
  };