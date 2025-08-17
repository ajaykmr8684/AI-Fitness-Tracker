import { 
    Card, 
    CardContent, 
    Grid, 
    Typography, 
    Box,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    Alert,
    Stack,
    Divider,
    Avatar,
    Paper,
    Skeleton,
    Fade,
    Button,
    InputAdornment,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Tooltip
  } from '@mui/material';
  import {
    DirectionsRun,
    DirectionsWalk,
    DirectionsBike,
    Timer,
    LocalFireDepartment,
    MoreVert,
    Edit,
    Delete,
    Visibility,
    Search,
    FilterList,
    SortByAlpha,
    CalendarToday,
    TrendingUp,
    Assessment
  } from '@mui/icons-material';
  import React, { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router';
  import { getActivities } from '../services/api';
  
  const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [sortBy, setSortBy] = useState('date_desc');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    
    const navigate = useNavigate();
  
    // Activity type configurations
    const activityTypes = {
      RUNNING: { 
        icon: <DirectionsRun />, 
        color: '#FF6B6B', 
        bgColor: '#FF6B6B15',
        label: 'Running'
      },
      WALKING: { 
        icon: <DirectionsWalk />, 
        color: '#4ECDC4', 
        bgColor: '#4ECDC415',
        label: 'Walking'
      },
      CYCLING: { 
        icon: <DirectionsBike />, 
        color: '#45B7D1', 
        bgColor: '#45B7D115',
        label: 'Cycling'
      }
    };
  
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getActivities();
        setActivities(response.data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to load activities. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchActivities();
    }, []);
  
    // Filter and sort activities
    const getFilteredAndSortedActivities = () => {
      let filtered = activities.filter(activity => {
        const matchesSearch = activity.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'ALL' || activity.type === filterType;
        return matchesSearch && matchesFilter;
      });
  
      // Sort activities
      switch (sortBy) {
        case 'date_desc':
          return filtered.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        case 'date_asc':
          return filtered.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
        case 'duration_desc':
          return filtered.sort((a, b) => b.duration - a.duration);
        case 'duration_asc':
          return filtered.sort((a, b) => a.duration - b.duration);
        case 'calories_desc':
          return filtered.sort((a, b) => b.caloriesBurned - a.caloriesBurned);
        case 'calories_asc':
          return filtered.sort((a, b) => a.caloriesBurned - b.caloriesBurned);
        default:
          return filtered;
      }
    };
  
    const handleMenuOpen = (event, activity) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
      setSelectedActivity(activity);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      setSelectedActivity(null);
    };
  
    const formatDuration = (minutes) => {
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };
  
    const formatDate = (dateString) => {
      if (!dateString) return 'Today';
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      return date.toLocaleDateString();
    };
  
    const getActivityStats = () => {
      const stats = activities.reduce((acc, activity) => {
        acc.totalActivities++;
        acc.totalDuration += activity.duration;
        acc.totalCalories += activity.caloriesBurned;
        return acc;
      }, { totalActivities: 0, totalDuration: 0, totalCalories: 0 });
      
      return stats;
    };
  
    const stats = getActivityStats();
    const filteredActivities = getFilteredAndSortedActivities();
  
    // Loading skeleton
    const ActivitySkeleton = () => (
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: 200 }}>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={24} />
              <Skeleton variant="text" height={24} />
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    );
  
    if (loading) {
      return (
        <Box>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <ActivitySkeleton key={item} />
            ))}
          </Grid>
        </Box>
      );
    }
  
    if (error) {
      return (
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchActivities}>
              Retry
            </Button>
          }
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      );
    }
  
    return (
      <Box>
        {/* Stats Overview */}
        {activities.length > 0 && (
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Stack alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
                    <Assessment />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {stats.totalActivities}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Activities
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack alignItems="center">
                  <Avatar sx={{ bgcolor: '#4ECDC4', mb: 1 }}>
                    <Timer />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#4ECDC4' }}>
                    {formatDuration(stats.totalDuration)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Time
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack alignItems="center">
                  <Avatar sx={{ bgcolor: '#FF6B6B', mb: 1 }}>
                    <LocalFireDepartment />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF6B6B' }}>
                    {stats.totalCalories.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Calories
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        )}
  
        {/* Search and Filter Controls */}
        <Paper 
          elevation={1}
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 2,
            background: 'white'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  <MenuItem value="ALL">All Activities</MenuItem>
                  <MenuItem value="RUNNING">Running</MenuItem>
                  <MenuItem value="WALKING">Walking</MenuItem>
                  <MenuItem value="CYCLING">Cycling</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={<SortByAlpha sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  <MenuItem value="date_desc">Newest First</MenuItem>
                  <MenuItem value="date_asc">Oldest First</MenuItem>
                  <MenuItem value="duration_desc">Longest Duration</MenuItem>
                  <MenuItem value="duration_asc">Shortest Duration</MenuItem>
                  <MenuItem value="calories_desc">Most Calories</MenuItem>
                  <MenuItem value="calories_asc">Least Calories</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
  
        {/* Activities Grid */}
        {filteredActivities.length === 0 ? (
          <Paper 
            elevation={1}
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.05) 100%)'
            }}
          >
            <TrendingUp sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm || filterType !== 'ALL' ? 'No matching activities found' : 'No activities yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || filterType !== 'ALL' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first activity!'
              }
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredActivities.map((activity, index) => {
              const activityConfig = activityTypes[activity.type] || activityTypes.RUNNING;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={activity.id || index}>
                  <Fade in timeout={300 + index * 100}>
                    <Card 
                      sx={{
                        cursor: 'pointer',
                        height: 200,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'visible',
                        border: `1px solid ${activityConfig.color}20`,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 25px ${activityConfig.color}30`,
                          '& .activity-icon': {
                            transform: 'scale(1.1)',
                          }
                        }
                      }}
                      onClick={() => navigate(`/activities/${activity.id}`)}
                    >
                      {/* Background Pattern */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: 100,
                          height: 100,
                          background: activityConfig.bgColor,
                          borderRadius: '0 0 0 100px',
                          opacity: 0.3
                        }}
                      />
                      
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar 
                              className="activity-icon"
                              sx={{ 
                                bgcolor: activityConfig.color,
                                width: 40,
                                height: 40,
                                transition: 'transform 0.3s ease'
                              }}
                            >
                              {activityConfig.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {activityConfig.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarToday sx={{ fontSize: 12 }} />
                                {formatDate(activity.createdAt || activity.date)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Tooltip title="More options">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, activity)}
                              sx={{ 
                                opacity: 0.7,
                                '&:hover': { opacity: 1 }
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Tooltip>
                        </Box>
  
                        {/* Metrics */}
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                            <Box>
                              <Typography variant="h5" fontWeight="bold" sx={{ color: activityConfig.color }}>
                                {formatDuration(activity.duration)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Duration
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="h5" fontWeight="bold" sx={{ color: '#FF6B6B' }}>
                                {activity.caloriesBurned}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Calories
                              </Typography>
                            </Box>
                          </Stack>
                          
                          {/* Intensity Indicator */}
                          <Box>
                            <Chip
                              size="small"
                              label={activity.caloriesBurned > 400 ? 'High Intensity' : activity.caloriesBurned > 200 ? 'Medium Intensity' : 'Light Activity'}
                              sx={{
                                bgcolor: activity.caloriesBurned > 400 ? '#FF6B6B20' : activity.caloriesBurned > 200 ? '#FFA50020' : '#4ECDC420',
                                color: activity.caloriesBurned > 400 ? '#FF6B6B' : activity.caloriesBurned > 200 ? '#FFA500' : '#4ECDC4',
                                fontWeight: 'bold',
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        )}
  
        {/* Activity Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => {
            navigate(`/activities/${selectedActivity?.id}`);
            handleMenuClose();
          }}>
            <Visibility sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Edit sx={{ mr: 1 }} />
            Edit Activity
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Delete Activity
          </MenuItem>
        </Menu>
      </Box>
    );
  };
  
  export default ActivityList;