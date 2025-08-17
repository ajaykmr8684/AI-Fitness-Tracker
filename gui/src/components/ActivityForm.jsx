import { 
    Box, 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField,
    Alert,
    Snackbar,
    Stack,
    InputAdornment,
    Chip,
    Typography,
    CircularProgress,
    Paper,
    Fade,
    Grid
  } from '@mui/material';
  import {
    DirectionsRun,
    DirectionsWalk,
    DirectionsBike,
    Timer,
    LocalFireDepartment,
    Add,
    CheckCircle
  } from '@mui/icons-material';
  import React, { useState } from 'react';
  import { addActivity } from '../services/api';
  
  export const ActivityForm = ({ onActivityAdded }) => {
    const [activity, setActivity] = useState({
      type: "RUNNING", 
      duration: '', 
      caloriesBurned: '',
      additionalMetrics: {}
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
  
    // Activity type configurations
    const activityTypes = [
      { 
        value: "RUNNING", 
        label: "Running", 
        icon: <DirectionsRun />,
        color: '#FF6B6B',
        avgCaloriesPerMin: 12
      },
      { 
        value: "WALKING", 
        label: "Walking", 
        icon: <DirectionsWalk />,
        color: '#4ECDC4',
        avgCaloriesPerMin: 4
      },
      { 
        value: "CYCLING", 
        label: "Cycling", 
        icon: <DirectionsBike />,
        color: '#45B7D1',
        avgCaloriesPerMin: 8
      }
    ];
  
    const currentActivityType = activityTypes.find(type => type.value === activity.type);
  
    // Form validation
    const validateForm = () => {
      const newErrors = {};
      
      if (!activity.duration || activity.duration <= 0) {
        newErrors.duration = 'Duration must be greater than 0';
      } else if (activity.duration > 1440) { // 24 hours max
        newErrors.duration = 'Duration cannot exceed 24 hours (1440 minutes)';
      }
      
      if (!activity.caloriesBurned || activity.caloriesBurned <= 0) {
        newErrors.caloriesBurned = 'Calories burned must be greater than 0';
      } else if (activity.caloriesBurned > 10000) {
        newErrors.caloriesBurned = 'Calories burned seems too high (max 10,000)';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    // Estimate calories based on activity type and duration
    const estimateCalories = (type, duration) => {
      const activityType = activityTypes.find(a => a.value === type);
      return Math.round(activityType.avgCaloriesPerMin * duration);
    };
  
    // Auto-estimate calories when duration changes
    const handleDurationChange = (e) => {
      const duration = e.target.value;
      setActivity({
        ...activity, 
        duration,
        caloriesBurned: duration ? estimateCalories(activity.type, duration) : ''
      });
      
      // Clear duration error when user starts typing
      if (errors.duration) {
        setErrors({ ...errors, duration: '' });
      }
    };
  
    const handleCaloriesChange = (e) => {
      setActivity({...activity, caloriesBurned: e.target.value});
      
      // Clear calories error when user starts typing
      if (errors.caloriesBurned) {
        setErrors({ ...errors, caloriesBurned: '' });
      }
    };
  
    const handleTypeChange = (e) => {
      const newType = e.target.value;
      const newActivity = { ...activity, type: newType };
      
      // Auto-update calories if duration is set
      if (activity.duration) {
        newActivity.caloriesBurned = estimateCalories(newType, activity.duration);
      }
      
      setActivity(newActivity);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setLoading(true);
      
      try {
        await addActivity({
          ...activity,
          duration: parseFloat(activity.duration),
          caloriesBurned: parseFloat(activity.caloriesBurned),
          userId: localStorage.getItem('userId')
        });
        
        // Success state
        setSuccess(true);
        setShowSuccess(true);
        
        // Reset form after a brief delay
        setTimeout(() => {
          setActivity({ 
            type: "RUNNING", 
            duration: '', 
            caloriesBurned: '', 
            additionalMetrics: {}
          });
          setSuccess(false);
          onActivityAdded();
        }, 1500);
        
      } catch (error) {
        console.error('Error adding activity:', error);
        // You might want to show an error message here
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 0,
          background: 'transparent'
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Activity Type Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 1 }}>
                Select Activity Type
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                {activityTypes.map((type) => (
                  <Chip
                    key={type.value}
                    icon={type.icon}
                    label={type.label}
                    clickable
                    variant={activity.type === type.value ? "filled" : "outlined"}
                    onClick={() => handleTypeChange({ target: { value: type.value } })}
                    sx={{
                      py: 2,
                      px: 1,
                      fontSize: '0.9rem',
                      fontWeight: activity.type === type.value ? 'bold' : 'normal',
                      bgcolor: activity.type === type.value ? `${type.color}20` : 'transparent',
                      borderColor: activity.type === type.value ? type.color : 'divider',
                      color: activity.type === type.value ? type.color : 'text.primary',
                      '&:hover': {
                        bgcolor: `${type.color}10`,
                        borderColor: type.color,
                      },
                      '& .MuiChip-icon': {
                        color: activity.type === type.value ? type.color : 'text.secondary'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Grid>
  
            {/* Duration Input */}
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth
                label="Duration"
                type="number"
                value={activity.duration}
                onChange={handleDurationChange}
                error={!!errors.duration}
                helperText={errors.duration || `Average: ${currentActivityType.avgCaloriesPerMin} cal/min`}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          min
                        </Typography>
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: currentActivityType.color,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: currentActivityType.color,
                    },
                  },
                }}
              />
            </Grid>
  
            {/* Calories Input */}
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth
                label="Calories Burned"
                type="number"
                value={activity.caloriesBurned}
                onChange={handleCaloriesChange}
                error={!!errors.caloriesBurned}
                helperText={errors.caloriesBurned || 'Estimated based on activity type'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalFireDepartment sx={{ color: '#FF6B6B', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          cal
                        </Typography>
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#FF6B6B',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B6B',
                    },
                  },
                }}
              />
            </Grid>
  
            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ position: 'relative', mt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained"
                  fullWidth
                  disabled={loading || success}
                  startIcon={success ? <CheckCircle /> : <Add />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    background: success 
                      ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                      : `linear-gradient(135deg, ${currentActivityType.color} 0%, ${currentActivityType.color}dd 100%)`,
                    boxShadow: success 
                      ? '0 4px 20px rgba(76, 175, 80, 0.4)'
                      : `0 4px 20px ${currentActivityType.color}40`,
                    '&:hover': {
                      transform: loading || success ? 'none' : 'translateY(-2px)',
                      boxShadow: success 
                        ? '0 6px 25px rgba(76, 175, 80, 0.5)'
                        : `0 6px 25px ${currentActivityType.color}60`,
                    },
                    '&:disabled': {
                      background: success 
                        ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                        : 'rgba(0, 0, 0, 0.12)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {success ? 'Activity Added!' : loading ? 'Adding...' : 'Add Activity'}
                </Button>
                
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                      color: currentActivityType.color,
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
  
        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowSuccess(false)} 
            severity="success" 
            variant="filled"
            sx={{ 
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            Activity added successfully! 🎉
          </Alert>
        </Snackbar>
      </Paper>
    );
  };
  
  export default ActivityForm;