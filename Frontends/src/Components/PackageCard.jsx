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
  ListItemAvatar,
  Avatar,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Place, AccessTime, Image as ImageIcon } from '@material-ui/icons';

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
    padding: theme.spacing(4),
    maxWidth: 800,
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  formGroup: {
    marginBottom: theme.spacing(3),
  },
  recommendationItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(1),
    alignItems: 'flex-start',
  },
  recommendationImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    objectFit: 'cover',
    marginRight: theme.spacing(2),
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
}));

const PackageCard = ({ packageData }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
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
          <Typography variant="h5" gutterBottom>
            Customize {packageData.name}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" fullWidth className={classes.formGroup}>
                <TextField
                  label="Age"
                  type="number"
                  inputProps={{ min: 1, max: 100 }}
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" fullWidth className={classes.formGroup}>
                <FormLabel component="legend">Gender</FormLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControl component="fieldset" fullWidth className={classes.formGroup}>
            <FormLabel component="legend">Preferred Place Types</FormLabel>
            <div className={classes.checkboxGroup}>
              {placeTypes.map(type => (
                <div key={type} className={classes.checkboxItem}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.placeType.includes(type)}
                        onChange={() => handleCheckboxChange('placeType', type)}
                        color="primary"
                      />
                    }
                    label={type}
                  />
                </div>
              ))}
            </div>
          </FormControl>

          <FormControl component="fieldset" fullWidth className={classes.formGroup}>
            <FormLabel component="legend">Hobbies/Interests</FormLabel>
            <div className={classes.checkboxGroup}>
              {hobbies.map(hobby => (
                <div key={hobby} className={classes.checkboxItem}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.hobby.includes(hobby)}
                        onChange={() => handleCheckboxChange('hobby', hobby)}
                        color="primary"
                      />
                    }
                    label={hobby}
                  />
                </div>
              ))}
            </div>
          </FormControl>

          <FormControl component="fieldset" fullWidth className={classes.formGroup}>
            <FormLabel component="legend">Preferred Climate</FormLabel>
            <RadioGroup
              value={formData.climate}
              onChange={(e) => setFormData({...formData, climate: e.target.value})}
              row
            >
              <div className={classes.checkboxGroup}>
                {climates.map(climate => (
                  <div key={climate} className={classes.checkboxItem}>
                    <FormControlLabel
                      value={climate}
                      control={<Radio color="primary" />}
                      label={climate}
                    />
                  </div>
                ))}
              </div>
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" fullWidth className={classes.formGroup}>
            <FormLabel component="legend">Health Considerations</FormLabel>
            <div className={classes.checkboxGroup}>
              {healthIssues.map(issue => (
                <div key={issue} className={classes.checkboxItem}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.physicalDisorders.includes(issue)}
                        onChange={() => handleCheckboxChange('physicalDisorders', issue)}
                        color="primary"
                      />
                    }
                    label={issue}
                  />
                </div>
              ))}
            </div>
          </FormControl>

          {loading && (
            <Box display="flex" justifyContent="center" my={3}>
              <Box textAlign="center">
                <CircularProgress color="primary" />
                <Typography variant="body1" style={{ marginTop: 16 }}>
                  Generating recommendations...
                </Typography>
              </Box>
            </Box>
          )}

          {recommendations.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Recommended Places
              </Typography>
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
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    ) : (
                      <Avatar className={classes.recommendationImage}>
                        <ImageIcon />
                      </Avatar>
                    )}
                    <div className={classes.recommendationContent}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                        {place.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {place.whyRecommended}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Type: {place.placeType?.join(', ')}
                      </Typography>
                    </div>
                    <Badge
                      color={parseFloat(place.mlScore) > 10 ? "primary" : "secondary"}
                      badgeContent={`${place.mlScore}%`}
                      className={classes.scoreBadge}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleClose}
              style={{ marginRight: 16 }}
            >
              Close
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Get Recommendations'}
            </Button>
          </Box>
        </div>
      </Modal>
    </>
  );
};

export default PackageCard;