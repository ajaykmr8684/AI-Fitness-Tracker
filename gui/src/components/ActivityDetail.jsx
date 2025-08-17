import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivityDetail } from '../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  Button,
  IconButton,
  Skeleton,
  Alert,
  Grid,
  LinearProgress,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  Timer,
  LocalFireDepartment,
  CalendarToday,
  ArrowBack,
  Share,
  Edit,
  Delete,
  TrendingUp,
  Psychology,
  Lightbulb,
  Security,
  ExpandMore,
  Speed,
  FitnessCenter,
  Assessment,
  StarRate,
  NavigateNext,
  Timeline
} from '@mui/icons-material';

export const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Activity type configurations
  const activityTypes = {
    RUNNING: {
      icon: <DirectionsRun />,
      color: '#FF6B6B',
      bgColor: '#FF6B6B15',
      label: 'Running',
      bgGradient: 'linear-gradient(135deg, #FF6B6B20 0%, #FF6B6B05 100%)'
    },
    WALKING: {
      icon: <DirectionsWalk />,
      color: '#4ECDC4',
      bgColor: '#4ECDC415',
      label: 'Walking',
      bgGradient: 'linear-gradient(135deg, #4ECDC420 0%, #4ECDC405 100%)'
    },
    CYCLING: {
      icon: <DirectionsBike />,
      color: '#45B7D1',
      bgColor: '#45B7D115',
      label: 'Cycling',
      bgGradient: 'linear-gradient(135deg, #45B7D120 0%, #45B7D105 100%)'
    }
  };

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getActivityDetail(id);
        setActivity(response.data);
      } catch (error) {
        console.error('Error fetching activity detail:', error);
        setError('Failed to load activity details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivityDetail();
    }
  }, [id]);

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getIntensityLevel = (calories, duration) => {
    const caloriesPerMinute = calories / duration;
    if (caloriesPerMinute > 10) return { level: 'High', color: '#FF6B6B', score: 90 };
    if (caloriesPerMinute > 6) return { level: 'Moderate', color: '#FFA500', score: 65 };
    return { level: 'Light', color: '#4ECDC4', score: 35 };
  };

  const getEfficiencyScore = (calories, duration) => {
    // Simple efficiency calculation (calories per minute * 10)
    const efficiency = Math.min((calories / duration) * 10, 100);
    return Math.round(efficiency);
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert 
          severity="error"
          action={
            <Stack direction="row" spacing={1}>
              <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                Retry
              </Button>
              <Button color="inherit" size="small" onClick={() => navigate('/activities')}>
                Back to Activities
              </Button>
            </Stack>
          }
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Activity not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/activities')}
          sx={{ mt: 2 }}
        >
          Back to Activities
        </Button>
      </Box>
    );
  }

  const activityConfig = activityTypes[activity.type] || activityTypes.RUNNING;
  const dateInfo = formatDate(activity.createdAt);
  const intensity = getIntensityLevel(activity.caloriesBurned, activity.duration);
  const efficiency = getEfficiencyScore(activity.caloriesBurned, activity.duration);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          color="inherit" 
          href="#" 
          onClick={(e) => { e.preventDefault(); navigate('/activities'); }}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <FitnessCenter sx={{ mr: 0.5, fontSize: 16 }} />
          Activities
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <NavigateNext sx={{ mr: 0.5, fontSize: 16 }} />
          {activityConfig.label} Details
        </Typography>
      </Breadcrumbs>

      {/* Header Card */}
      <Paper
        elevation={3}
        sx={{
          background: activityConfig.bgGradient,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          mb: 4
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `${activityConfig.color}10`,
            opacity: 0.5
          }}
        />
        
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: activityConfig.color,
                  width: 64,
                  height: 64,
                  boxShadow: `0 8px 32px ${activityConfig.color}40`
                }}
              >
                {React.cloneElement(activityConfig.icon, { sx: { fontSize: 32 } })}
              </Avatar>
              
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {activityConfig.label} Session
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    icon={<CalendarToday />}
                    label={dateInfo.full}
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                  />
                  <Chip
                    label={dateInfo.time}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                  />
                </Stack>
              </Box>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Share Activity">
                <IconButton size="large">
                  <Share />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Activity">
                <IconButton size="large">
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Activity">
                <IconButton size="large" sx={{ color: 'error.main' }}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Key Metrics */}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              <Stack alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: activityConfig.color, mb: 1 }}>
                  <Timer />
                </Avatar>
                <Typography variant="h3" fontWeight="bold" color={activityConfig.color}>
                  {formatDuration(activity.duration)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Stack alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: '#FF6B6B', mb: 1 }}>
                  <LocalFireDepartment />
                </Avatar>
                <Typography variant="h3" fontWeight="bold" color="#FF6B6B">
                  {activity.caloriesBurned}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calories Burned
                </Typography>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Stack alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: intensity.color, mb: 1 }}>
                  <Speed />
                </Avatar>
                <Typography variant="h3" fontWeight="bold" color={intensity.color}>
                  {intensity.level}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Intensity
                </Typography>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Stack alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
                  <Assessment />
                </Avatar>
                <Typography variant="h3" fontWeight="bold" color="primary.main">
                  {efficiency}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Efficiency Score
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Performance Analysis */}
          <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Timeline />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Performance Analysis
                </Typography>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Calories per Minute
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color={activityConfig.color}>
                      {(activity.caloriesBurned / activity.duration).toFixed(1)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Intensity Score
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LinearProgress 
                        variant="determinate" 
                        value={intensity.score} 
                        sx={{ 
                          flexGrow: 1, 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: `${intensity.color}20`,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: intensity.color
                          }
                        }} 
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {intensity.score}/100
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          {activity.recommendation && (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Psychology />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    AI-Powered Insights
                  </Typography>
                  <Chip 
                    label="Beta" 
                    size="small" 
                    color="secondary" 
                    sx={{ fontWeight: 'bold' }}
                  />
                </Stack>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    {activity.recommendation}
                  </Typography>
                </Box>

                {/* Expandable Sections */}
                <Stack spacing={2}>
                  {activity.improvements && activity.improvements.length > 0 && (
                    <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <TrendingUp sx={{ color: 'primary.main' }} />
                          <Typography variant="h6" fontWeight="medium">
                            Improvement Suggestions ({activity.improvements.length})
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {activity.improvements.map((improvement, index) => (
                            <ListItem key={index} sx={{ pl: 0 }}>
                              <ListItemIcon>
                                <StarRate sx={{ color: 'warning.main' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={improvement}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {activity.suggestions && activity.suggestions.length > 0 && (
                    <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Lightbulb sx={{ color: 'info.main' }} />
                          <Typography variant="h6" fontWeight="medium">
                            Training Suggestions ({activity.suggestions.length})
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {activity.suggestions.map((suggestion, index) => (
                            <ListItem key={index} sx={{ pl: 0 }}>
                              <ListItemIcon>
                                <Lightbulb sx={{ color: 'info.main' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={suggestion}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {activity.safety && activity.safety.length > 0 && (
                    <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Security sx={{ color: 'error.main' }} />
                          <Typography variant="h6" fontWeight="medium">
                            Safety Guidelines ({activity.safety.length})
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {activity.safety.map((guideline, index) => (
                            <ListItem key={index} sx={{ pl: 0 }}>
                              <ListItemIcon>
                                <Security sx={{ color: 'error.main' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={guideline}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quick Stats */}
          <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Stats
              </Typography>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Session Rating
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarRate
                        key={star}
                        sx={{
                          color: star <= Math.floor(efficiency / 20) ? 'warning.main' : 'grey.300',
                          fontSize: 20
                        }}
                      />
                    ))}
                    <Typography variant="body2" color="text.secondary">
                      ({Math.floor(efficiency / 20)}/5)
                    </Typography>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Activity Type
                  </Typography>
                  <Chip
                    icon={activityConfig.icon}
                    label={activityConfig.label}
                    sx={{
                      bgcolor: activityConfig.bgColor,
                      color: activityConfig.color,
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Workout Duration
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDuration(activity.duration)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Energy Expenditure
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {activity.caloriesBurned} calories
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Stack spacing={2}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Edit />}
              sx={{ borderRadius: 2 }}
            >
              Edit Activity
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<Share />}
              sx={{ borderRadius: 2 }}
            >
              Share Results
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Back to Activities FAB */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          boxShadow: 4
        }}
        onClick={() => navigate('/activities')}
      >
        <ArrowBack />
      </Fab>
    </Box>
  );
};

export default ActivityDetail;