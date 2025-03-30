import React, { useState } from 'react';
import { 
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Grid,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  TextField,
  Select,
  MenuItem,
  Badge,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  Divider,
  Paper,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { 
  Place, 
  AccessTime, 
  Image as ImageIcon,
  Close as CloseIcon,
  LocalActivity,
  Favorite,
  Nature,
  LocalHospital,
  NavigateNext,
  NavigateBefore,
  PersonOutline
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  packageCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: theme.shadows[8]
    }
  },
  cardMedia: {
    height: 200,
    paddingTop: '56.25%', // 16:9 aspect ratio
  },
  cardContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  icon: {
    marginRight: theme.spacing(0.5),
    fontSize: '1rem',
  },
  description: {
    marginBottom: theme.spacing(2),
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius,
    maxWidth: 900,
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    padding: 0
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  modalBody: {
    padding: theme.spacing(3, 4),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: theme.palette.grey[500],
  },
  formGroup: {
    marginBottom: theme.spacing(3),
  },
  formSection: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& svg': {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main
    }
  },
  recommendationItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(2),
    alignItems: 'flex-start',
    borderRadius: 4,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    padding: theme.spacing(2),
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    }
  },
  recommendationImage: {
    width: 90,
    height: 90,
    borderRadius: 4,
    objectFit: 'cover',
    marginRight: theme.spacing(2),
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  },
  scoreBadge: {
    marginLeft: theme.spacing(2),
    alignSelf: 'center',
  },
  recommendationContent: {
    flex: 1,
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
  checkboxItem: {
    width: '33%',
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  tabs: {
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[100],
  },
  tabContent: {
    padding: theme.spacing(2, 0),
  },
  chip: {
    margin: theme.spacing(0.5),
    cursor: 'pointer',
    '&.selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 2),
    backgroundColor: 'transparent',
  },
  stepperButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  recommendationsContainer: {
    marginTop: theme.spacing(2),
  },
  recommendationHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& svg': {
      marginRight: theme.spacing(1),
      color: theme.palette.success.main
    }
  },
  badge: {
    height: 24,
    minWidth: 24,
    borderRadius: 12,
    padding: '0 8px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalFooter: {
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  climateOption: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    width: 90,
    height: 90,
    backgroundColor: theme.palette.background.paper,
    '&.selected': {
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover
    }
  },
  climateIcon: {
    fontSize: 32,
    marginBottom: theme.spacing(1)
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2)
  },
  chip: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s ease',
    '&.selected': {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover
    }
  },
  scoreBar: {
    display: 'inline-block',
    height: 16,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 8,
    minWidth: 30
  },
  scoreContainer: {
    width: 120,
    display: 'flex',
    alignItems: 'center',
    '& .score': {
      marginLeft: theme.spacing(1),
      fontWeight: 'bold'
    }
  },
  preview: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
  },
  previewTitle: {
    fontSize: 14,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  selectionItem: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.light,
    borderRadius: 16,
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.5),
    fontSize: 14,
  }
}));

const PackageCard = ({ packageData }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    age: 25,
    gender: 'male',
    placeType: [],
    hobby: [],
    climate: '',
    diseases: [],
    physicalDisorders: []
  });

  const placeTypes = ['Beach', 'Mountains', 'Waterfalls', 'Religious', 'Historical', 'Urban', 'Wildlife', 'Nature', 'Adventure', 'Educational', 'Museum', 'Scenic'];
  const hobbies = ['Hiking', 'Surfing', 'Camping', 'Sightseeing', 'Adventure', 'Photography', 'Shopping', 'Relaxation', 'Learning', 'Bird Watching', 'Tea Tasting', 'Cultural Exploration', 'Boating', 'Walking'];
  const climates = ['Tropical', 'Temperate', 'Arid', 'Cold'];
  const healthIssues = ['Asthma', 'Back Pain', 'Knee Pain', 'Heart Condition'];

  const steps = [
    'Personal Information',
    'Place Preferences',
    'Activities & Climate',
    'Health Considerations'
  ];

  const handleCheckboxChange = (field, value) => {
    const updated = [...formData[field]];
    const index = updated.indexOf(value);
    
    if (index === -1) {
      updated.push(value);
    } else {
      updated.splice(index, 1);
    }
    
    setFormData({
      ...formData,
      [field]: updated
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/packages/${packageData._id}/customize-v2`,
        formData
      );
      
      const filteredRecs = response.data.recommendations.filter(
        rec => parseFloat(rec.mlScore) > 10
      );
      
      setRecommendations(filteredRecs);
      setActiveStep(4); // Move to results step
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRecommendations([]);
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const getClimateIcon = (climate) => {
    switch(climate) {
      case 'Tropical': return '🌴';
      case 'Temperate': return '🌿';
      case 'Arid': return '🏜️';
      case 'Cold': return '❄️';
      default: return '🌍';
    }
  };

  // Add this validation function
const isStepValid = (step) => {
  switch(step) {
    case 0: // Personal Information
      return formData.age > 0 && formData.gender;
    case 1: // Place Preferences
      return formData.placeType.length > 0;
    case 2: // Activities & Climate
      return formData.hobby.length > 0 && formData.climate;
    case 3: // Health Considerations (always valid as it's optional)
      return true;
    default:
      return true;
  }
};

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className={classes.formSection}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <PersonOutline />
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth className={classes.formGroup}>
                  <FormLabel component="legend">Age</FormLabel>
                  <TextField
                    type="number"
                    inputProps={{ min: 1, max: 100 }}
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} style={{marginTop:'17px'}}>
                <FormControl component="fieldset" fullWidth className={classes.formGroup}>
                  <FormLabel component="legend">Gender</FormLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        );
      case 1:
        return (
          <div className={classes.formSection}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <Place />
              Place Preferences
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">
                What types of places would you like to visit?
              </FormLabel>
              
              <div className={classes.chipContainer}>
                {placeTypes.map(type => (
                  <div 
                    key={type} 
                    className={`${classes.chip} ${formData.placeType.includes(type) ? 'selected' : ''}`}
                    onClick={() => handleCheckboxChange('placeType', type)}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </FormControl>

            {formData.placeType.length > 0 && (
              <div className={classes.preview}>
                <Typography className={classes.previewTitle}>
                  Selected place types:
                </Typography>
                <div>
                  {formData.placeType.map(type => (
                    <span key={type} className={classes.selectionItem}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <>
            <div className={classes.formSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                <LocalActivity />
                Activities & Interests
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">
                  What activities are you interested in?
                </FormLabel>
                
                <div className={classes.chipContainer}>
                  {hobbies.map(hobby => (
                    <div 
                      key={hobby} 
                      className={`${classes.chip} ${formData.hobby.includes(hobby) ? 'selected' : ''}`}
                      onClick={() => handleCheckboxChange('hobby', hobby)}
                    >
                      {hobby}
                    </div>
                  ))}
                </div>
              </FormControl>

              {formData.hobby.length > 0 && (
                <div className={classes.preview}>
                  <Typography className={classes.previewTitle}>
                    Selected activities:
                  </Typography>
                  <div>
                    {formData.hobby.map(hobby => (
                      <span key={hobby} className={classes.selectionItem}>
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={classes.formSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                <Nature />
                Preferred Climate
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">
                  What climate do you prefer?
                </FormLabel>
                
                <Box display="flex" flexWrap="wrap" mt={2}>
                  {climates.map(climate => (
                    <div 
                      key={climate} 
                      className={`${classes.climateOption} ${formData.climate === climate ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, climate: climate})}
                    >
                      <span className={classes.climateIcon}>{getClimateIcon(climate)}</span>
                      <Typography variant="body2">{climate}</Typography>
                    </div>
                  ))}
                </Box>
              </FormControl>
            </div>
          </>
        );
      case 3:
        return (
          <div className={classes.formSection}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <LocalHospital />
              Health Considerations
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">
                Do you have any health considerations we should be aware of?
              </FormLabel>
              
              <div className={classes.chipContainer}>
                {healthIssues.map(issue => (
                  <div 
                    key={issue} 
                    className={`${classes.chip} ${formData.physicalDisorders.includes(issue) ? 'selected' : ''}`}
                    onClick={() => handleCheckboxChange('physicalDisorders', issue)}
                  >
                    {issue}
                  </div>
                ))}
              </div>
            </FormControl>

            {formData.physicalDisorders.length > 0 && (
              <div className={classes.preview}>
                <Typography className={classes.previewTitle}>
                  Selected health considerations:
                </Typography>
                <div>
                  {formData.physicalDisorders.map(issue => (
                    <span key={issue} className={classes.selectionItem}>
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <>
            {loading ? (
              <div className={classes.loadingContainer}>
                <CircularProgress color="primary" size={60} />
                <Typography variant="h6" style={{ marginTop: 16 }}>
                  Generating your personalized recommendations...
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                  This may take a moment as we find the perfect places for you.
                </Typography>
              </div>
            ) : (
              <div className={classes.recommendationsContainer}>
                <Typography variant="h6" className={classes.recommendationHeader}>
                  <Favorite />
                  Recommended Places 
                  <span className={classes.badge}>{recommendations.length}</span>
                </Typography>
                
                {recommendations.length > 0 ? (
                  <List>
                    {recommendations.map((place, index) => (
                      <ListItem key={index} className={classes.recommendationItem}>
                        {place.images && place.images.length > 0 ? (
                          <img 
                            src={place.images[0]} 
                            alt={place.name}
                            className={classes.recommendationImage}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/90x90?text=No+Image';
                            }}
                          />
                        ) : (
                          <Avatar className={classes.recommendationImage}>
                            <ImageIcon />
                          </Avatar>
                        )}
                        <div className={classes.recommendationContent}>
                          <Box display="flex" alignItems="center" mb={0.5}>
                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                              {place.name}
                            </Typography>
                            <div className={classes.scoreContainer} style={{ marginLeft: 'auto' }}>
                              <div 
                                className={classes.scoreBar} 
                                style={{ width: `${Math.min(100, parseFloat(place.mlScore))}%` }}
                              />
                              <span className="score">{parseFloat(place.mlScore).toFixed(0)}%</span>
                            </div>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            {place.whyRecommended}
                          </Typography>
                          <Box mt={1}>
                            <Typography variant="caption" color="textSecondary">
                              {place.placeType?.join(', ')}
                            </Typography>
                          </Box>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Paper className={classes.formSection} style={{ textAlign: 'center' }}>
                    <Typography variant="body1">
                      No recommendations found based on your preferences.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                      Try adjusting your criteria to get better matches.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setActiveStep(0)}
                      style={{ marginTop: 16 }}
                    >
                      Modify Preferences
                    </Button>
                  </Paper>
                )}
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className={classes.packageCard}>
        <CardMedia
          className={classes.cardMedia}
          image={packageData.packageImage || 'https://via.placeholder.com/300x200'}
          title={packageData.name}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant="h6" className={classes.title}>
            {packageData.name}
          </Typography>
          <Typography variant="body2" className={classes.subtitle}>
            <Place className={classes.icon} fontSize="small" />
            {packageData.district}
            <AccessTime className={classes.icon} style={{ marginLeft: 8 }} />
            {packageData.duration} days
          </Typography>
          <Typography variant="body2" color="textSecondary" className={classes.description}>
            {packageData.description || 'No description available'}
          </Typography>
          <div className={classes.footer}>
            <Typography variant="caption" color="textSecondary">
              {packageData.places?.length || 0} places included
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              onClick={handleOpen}
            >
              Customize
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        className={classes.modal}
      >
        <div className={classes.modalContent}>
          <div className={classes.modalHeader}>
            <Typography variant="h6">
              Customize {packageData.name}
            </Typography>
            <IconButton className={classes.closeButton} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          
          <div className={classes.modalBody}>
            <Stepper activeStep={activeStep} className={classes.stepper} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {renderStepContent(activeStep)}
          </div>
          
          <div className={classes.modalFooter}>
  {activeStep === 4 ? (
    <Button 
      variant="outlined" 
      color="primary" 
      onClick={handleClose}
    >
      Close
    </Button>
  ) : (
    <div style={{ width: '100%' }}>
      <div className={classes.stepperButtons}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          startIcon={<NavigateBefore />}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={loading || !isStepValid(activeStep)} // Add validation here too
            endIcon={<NavigateNext />}
          >
            Get Recommendations
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            endIcon={<NavigateNext />}
            disabled={!isStepValid(activeStep)} // This freezes the button
            style={{
              opacity: isStepValid(activeStep) ? 1 : 0.6,
              pointerEvents: isStepValid(activeStep) ? 'auto' : 'none'
            }}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )}
</div>
        </div>
      </Modal>
    </>
  );
};

export default PackageCard;