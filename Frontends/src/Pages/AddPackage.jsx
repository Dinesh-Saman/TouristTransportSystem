import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, 
  FormHelperText, Grid, Divider, IconButton, Card, CardContent, Chip, Checkbox,
  FormControlLabel
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Delete, AddPhotoAlternate, Remove } from '@material-ui/icons';
import Sidebar from '../Components/sidebar';
import Header from '../Components/guest_header'; 
import axios from 'axios';
import swal from 'sweetalert';

const AddTourPackage = () => {
  // Main package details
  const [packageId, setPackageId] = useState('');
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [district, setDistrict] = useState('');
  const [packageImage, setPackageImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(true);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Place details
  const [places, setPlaces] = useState([]);
  const [currentPlace, setCurrentPlace] = useState({
    name: '',
    description: '',
    images: [],
    placeType: [],
    suitableFor: {
      ageRange: { min: 0, max: 100 },
      hobbies: [],
      climate: ['Temperate'],
      healthConsiderations: {
        notRecommendedFor: [],
        specialFacilities: []
      }
    },
    location: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });
  const [placeImage, setPlaceImage] = useState('');
  const [placeErrors, setPlaceErrors] = useState({});

  // Effect to check if all required fields are filled
  useEffect(() => {
    const requiredFields = {
      packageId,
      packageName,
      description,
      duration,
      district,
    };
    
    const imageValid = useImageUrl ? packageImage !== '' : uploadedImage !== null;
    const valid = Object.values(requiredFields).every(field => field !== '') && imageValid;
    setIsFormValid(valid);
  }, [packageId, packageName, description, duration, district, packageImage, uploadedImage, useImageUrl]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:5000/api/packages/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setUploadedImage(file);
        setPackageImage(response.data.imageUrl);
        setUseImageUrl(false);
      } catch (error) {
        console.error('Error uploading image:', error);
        swal("Error", "Failed to upload image. Please try again.", "error");
      }
    }
  };

  const toggleImageSource = () => {
    setUseImageUrl(!useImageUrl);
    if (useImageUrl) {
      setPackageImage('');
    } else {
      setUploadedImage(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!packageId) newErrors.packageId = "Package ID is required.";
    if (!packageName) newErrors.packageName = "Package Name is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!duration) newErrors.duration = "Duration is required.";
    if (isNaN(duration)) newErrors.duration = "Duration must be a number.";
    if (!district) newErrors.district = "District is required.";
    
    if (useImageUrl && !packageImage) {
      newErrors.packageImage = "Package Image URL is required.";
    } else if (!useImageUrl && !uploadedImage) {
      newErrors.packageImage = "Please upload an image.";
    }
    
    return newErrors;
  };

  const validatePlace = () => {
    const newErrors = {};
    if (!currentPlace.name) newErrors.name = "Place name is required.";
    if (!currentPlace.description) newErrors.description = "Place description is required.";
    if (currentPlace.images.length === 0) newErrors.images = "At least one image is required.";
    if (currentPlace.placeType.length === 0) newErrors.placeType = "At least one place type is required.";
    
    if (!currentPlace.location.coordinates[0] || !currentPlace.location.coordinates[1]) {
      newErrors.location = "Location coordinates are required.";
    }
    
    return newErrors;
  };

  const handleAddPlaceImage = () => {
    if (placeImage.trim()) {
      setCurrentPlace({
        ...currentPlace,
        images: [...currentPlace.images, placeImage.trim()]
      });
      setPlaceImage('');
      if (placeErrors.images) {
        setPlaceErrors(prev => ({ ...prev, images: '' }));
      }
    }
  };

  const handleRemovePlaceImage = (index) => {
    const updatedImages = [...currentPlace.images];
    updatedImages.splice(index, 1);
    setCurrentPlace({
      ...currentPlace,
      images: updatedImages
    });
  };

  const handleAddPlace = () => {
    const validationErrors = validatePlace();
    if (Object.keys(validationErrors).length > 0) {
      setPlaceErrors(validationErrors);
      return;
    }
    
    setPlaces([...places, { ...currentPlace }]);
    
    // Reset the current place form
    setCurrentPlace({
      name: '',
      description: '',
      images: [],
      placeType: [],
      suitableFor: {
        ageRange: { min: 0, max: 100 },
        hobbies: [],
        climate: ['Temperate'],
        healthConsiderations: {
          notRecommendedFor: [],
          specialFacilities: []
        }
      },
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    });
    setPlaceErrors({});
  };

  const handleRemovePlace = (index) => {
    const updatedPlaces = [...places];
    updatedPlaces.splice(index, 1);
    setPlaces(updatedPlaces);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      let imageUrl = packageImage;
      
      if (!useImageUrl && uploadedImage) {
        const formData = new FormData();
        formData.append('image', uploadedImage);
        
        const uploadResponse = await axios.post('http://localhost:5000/api/packages/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        imageUrl = uploadResponse.data.imageUrl;
      }
  
      const newPackage = {
        package_id: packageId,
        name: packageName,
        description,
        duration: Number(duration),
        packageImage: imageUrl,
        district,
        places: places.map(place => ({
          ...place,
          location: {
            type: 'Point',
            coordinates: place.location.coordinates.map(Number)
          }
        }))
      };
  
      const response = await axios.post('http://localhost:5000/api/packages', newPackage);
      console.log('Response:', response.data);
      
      swal("Success", "New tour package added successfully!", "success");
      // Reset form fields
      setPackageId('');
      setPackageName('');
      setDescription('');
      setDuration('');
      setDistrict('');
      setPackageImage('');
      setUploadedImage(null);
      setPlaces([]);
      setErrors({});
    } catch (error) {
      console.error('Error creating package:', error);
      
      if (error.response && error.response.status === 400) {
        swal("Error", error.response.data.message, "error");
        setErrors(prevErrors => ({ 
          ...prevErrors, 
          packageId: "A package with this ID already exists" 
        }));
      } else {
        swal("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  // List of Sri Lankan districts
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  // Place types
  const placeTypes = [
    'Beach', 'Mountains', 'Waterfalls', 'Religious', 'Historical', 
    'Urban', 'Wildlife'
  ];

  // Hobbies
  const hobbies = [
    'Hiking', 'Surfing', 'Camping', 'Sightseeing', 'Adventure', 
    'Photography', 'Shopping', 'Relaxation'
  ];

  // Climate types
  const climateTypes = [
    'Tropical', 'Temperate', 'Arid', 'Cold'
  ];

  // Health considerations
  const healthConditions = [
    'Cough', 'Fever', 'Headache', 'Back Pain', 'Asthma', 
    'Knee Pain', 'Heart Condition'
  ];

  // Special facilities
  const specialFacilities = [
    'Wheelchair Access', 'Elevators', 'Rest Areas', 
    'Medical Support', 'Shuttle Service'
  ];

  return (
    <Box>
      <Box display="flex" style={{ backgroundColor: '#f5f5f5'}}>
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          {/* Title Section */}
          <Box
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'30px', marginBottom:'50px' }}>
              Add New Tour Package
            </Typography>
          </Box>

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Left side - Package Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom style={{ color: '#555' }}>
                  Package Details
                </Typography>
                
                {/* Package Details Form Fields */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Package ID"
                      variant="outlined"
                      value={packageId}
                      onChange={(e) => {
                        setPackageId(e.target.value);
                        if (errors.packageId) {
                          setErrors(prevErrors => ({ ...prevErrors, packageId: '' }));
                        }
                      }}
                      helperText={errors.packageId}
                      error={!!errors.packageId}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Package Name"
                      variant="outlined"
                      value={packageName}
                      onChange={(e) => {
                        setPackageName(e.target.value);
                        if (errors.packageName) {
                          setErrors(prevErrors => ({ ...prevErrors, packageName: '' }));
                        }
                      }}
                      helperText={errors.packageName}
                      error={!!errors.packageName}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) {
                          setErrors(prevErrors => ({ ...prevErrors, description: '' }));
                        }
                      }}
                      helperText={errors.description}
                      error={!!errors.description}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Duration (days)"
                      variant="outlined"
                      type="number"
                      value={duration}
                      onChange={(e) => {
                        setDuration(e.target.value);
                        if (errors.duration) {
                          setErrors(prevErrors => ({ ...prevErrors, duration: '' }));
                        }
                      }}
                      helperText={errors.duration}
                      error={!!errors.duration}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.district} required>
                      <InputLabel>District</InputLabel>
                      <Select
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          if (errors.district) {
                            setErrors(prevErrors => ({ ...prevErrors, district: '' }));
                          }
                        }}
                        label="District"
                      >
                        {districts.map((district) => (
                          <MenuItem key={district} value={district}>
                            {district}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.district}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Box mt={2}>
                  <Typography variant="body1" style={{ textAlign: 'left', marginBottom: '15px', color: '#666' }}>
                    <strong>Note:</strong> After adding the package, you can:
                  </Typography>
                  <Typography variant="body2" style={{ textAlign: 'left', color: '#666' }}>
                    • Add more places to this package from the package details page<br />
                    • Edit package information<br />
                    • Manage recommendations and promotions<br />
                    • View package performance metrics
                  </Typography>
                </Box>
              </Grid>

              {/* Right side - Image Preview and Place Details */}
              <Grid item xs={12} md={6}>
                {/* Package Image Preview Section */}
                <Typography variant="h6" gutterBottom style={{ color: '#555' }}>
                  Package Image
                </Typography>
                
                {/* Package Image Preview */}
                <Box
                  style={{
                    width: '100%',
                    height: '250px',
                    border: '1px dashed #ccc',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    marginBottom: '20px'
                  }}
                >
                  {packageImage ? (
                    <img
                      src={packageImage}
                      alt="Package Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                      }}
                    />
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      {useImageUrl ? 'Enter a valid image URL to see preview' : 'Upload an image to see preview'}
                    </Typography>
                  )}
                </Box>
                
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.packageImage}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={toggleImageSource}
                    style={{ marginBottom: '10px' }}
                  >
                    {useImageUrl ? 'Switch to Image Upload' : 'Switch to Image URL'}
                  </Button>
                  
                  {useImageUrl ? (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Package Image URL"
                      variant="outlined"
                      value={packageImage}
                      onChange={(e) => {
                        setPackageImage(e.target.value);
                        if (errors.packageImage) {
                          setErrors(prevErrors => ({ ...prevErrors, packageImage: '' }));
                        }
                      }}
                      helperText={errors.packageImage}
                      error={!!errors.packageImage}
                      required
                    />
                  ) : (
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          startIcon={<AddPhotoAlternate />}
                          fullWidth
                        >
                          Upload Image
                        </Button>
                      </label>
                      {uploadedImage && (
                        <Typography variant="body2" style={{ marginTop: '8px' }}>
                          File: {uploadedImage.name}
                        </Typography>
                      )}
                      {errors.packageImage && (
                        <FormHelperText error>{errors.packageImage}</FormHelperText>
                      )}
                    </Box>
                  )}
                </FormControl>

                <Divider style={{ margin: '20px 0' }} />

                {/* Place Details Section */}
                <Typography variant="h6" gutterBottom style={{ color: '#555', marginTop: '20px' }}>
                  Add Places to Package
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Place Name"
                      variant="outlined"
                      value={currentPlace.name}
                      onChange={(e) => {
                        setCurrentPlace({ ...currentPlace, name: e.target.value });
                        if (placeErrors.name) {
                          setPlaceErrors(prev => ({ ...prev, name: '' }));
                        }
                      }}
                      error={!!placeErrors.name}
                      helperText={placeErrors.name}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Place Description"
                      variant="outlined"
                      multiline
                      rows={3}
                      value={currentPlace.description}
                      onChange={(e) => {
                        setCurrentPlace({ ...currentPlace, description: e.target.value });
                        if (placeErrors.description) {
                          setPlaceErrors(prev => ({ ...prev, description: '' }));
                        }
                      }}
                      error={!!placeErrors.description}
                      helperText={placeErrors.description}
                      required
                    />
                  </Grid>
                  
                  {/* Place Images */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Place Images</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Add image URL"
                        value={placeImage}
                        onChange={(e) => setPlaceImage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPlaceImage();
                          }
                        }}
                      />
                      <IconButton color="primary" onClick={handleAddPlaceImage}>
                        <Add />
                      </IconButton>
                    </Box>
                    {placeErrors.images && (
                      <FormHelperText error>{placeErrors.images}</FormHelperText>
                    )}
                    <Box display="flex" flexWrap="wrap" mt={2}>
                      {currentPlace.images.map((image, index) => (
                        <Box key={index} style={{ position: 'relative', margin: '4px' }}>
                          <img 
                            src={image} 
                            alt={`Place ${index}`} 
                            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/80x60?text=Invalid+URL";
                            }}
                          />
                          <IconButton 
                            size="small" 
                            style={{ 
                              position: 'absolute', 
                              top: 0, 
                              right: 0, 
                              backgroundColor: 'rgba(255,255,255,0.7)',
                              padding: '2px'
                            }}
                            onClick={() => handleRemovePlaceImage(index)}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                  
                  {/* Place Type */}
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={placeTypes}
                      value={currentPlace.placeType}
                      onChange={(event, newValue) => {
                        setCurrentPlace({ ...currentPlace, placeType: newValue });
                        if (placeErrors.placeType) {
                          setPlaceErrors(prev => ({ ...prev, placeType: '' }));
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Place Type"
                          error={!!placeErrors.placeType}
                          helperText={placeErrors.placeType}
                          required
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* Location Coordinates */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Location Coordinates</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Latitude"
                          variant="outlined"
                          type="number"
                          value={currentPlace.location.coordinates[0]}
                          onChange={(e) => {
                            const newCoords = [...currentPlace.location.coordinates];
                            newCoords[0] = e.target.value;
                            setCurrentPlace({
                              ...currentPlace,
                              location: {
                                ...currentPlace.location,
                                coordinates: newCoords
                              }
                            });
                            if (placeErrors.location) {
                              setPlaceErrors(prev => ({ ...prev, location: '' }));
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Longitude"
                          variant="outlined"
                          type="number"
                          value={currentPlace.location.coordinates[1]}
                          onChange={(e) => {
                            const newCoords = [...currentPlace.location.coordinates];
                            newCoords[1] = e.target.value;
                            setCurrentPlace({
                              ...currentPlace,
                              location: {
                                ...currentPlace.location,
                                coordinates: newCoords
                              }
                            });
                            if (placeErrors.location) {
                              setPlaceErrors(prev => ({ ...prev, location: '' }));
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    {placeErrors.location && (
                      <FormHelperText error>{placeErrors.location}</FormHelperText>
                    )}
                  </Grid>
                  
                  {/* Suitable For Section */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Suitable For</Typography>
                    <Grid container spacing={2}>
                      {/* Age Range */}
                      <Grid item xs={12} sm={6} >
                        <Typography variant="body2" style={{marginBottom:'10px'}}>Age Range</Typography>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={5}>
                            <TextField
                              fullWidth
                              label="Min"
                              type="number"
                              variant='outlined'
                              value={currentPlace.suitableFor.ageRange.min}
                              onChange={(e) => {
                                setCurrentPlace({
                                  ...currentPlace,
                                  suitableFor: {
                                    ...currentPlace.suitableFor,
                                    ageRange: {
                                      ...currentPlace.suitableFor.ageRange,
                                      min: e.target.value
                                    }
                                  }
                                });
                              }}
                            />
                          </Grid>
                          <Grid item xs={2} style={{ textAlign: 'center' }}>
                            <Typography>to</Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <TextField
                              fullWidth
                              label="Max"
                              type="number"
                              variant='outlined'
                              value={currentPlace.suitableFor.ageRange.max}
                              onChange={(e) => {
                                setCurrentPlace({
                                  ...currentPlace,
                                  suitableFor: {
                                    ...currentPlace.suitableFor,
                                    ageRange: {
                                      ...currentPlace.suitableFor.ageRange,
                                      max: e.target.value
                                    }
                                  }
                                });
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      
                      {/* Hobbies */}
                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          options={hobbies}
                          value={currentPlace.suitableFor.hobbies}
                          onChange={(event, newValue) => {
                            setCurrentPlace({
                              ...currentPlace,
                              suitableFor: {
                                ...currentPlace.suitableFor,
                                hobbies: newValue
                              }
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Hobbies"
                            />
                          )}
                        />
                      </Grid>
                      
                      {/* Climate */}
                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          options={climateTypes}
                          value={currentPlace.suitableFor.climate}
                          onChange={(event, newValue) => {
                            setCurrentPlace({
                              ...currentPlace,
                              suitableFor: {
                                ...currentPlace.suitableFor,
                                climate: newValue
                              }
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Climate"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  {/* Health Considerations */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Health Considerations</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          multiple
                          options={healthConditions}
                          value={currentPlace.suitableFor.healthConsiderations.notRecommendedFor}
                          onChange={(event, newValue) => {
                            setCurrentPlace({
                              ...currentPlace,
                              suitableFor: {
                                ...currentPlace.suitableFor,
                                healthConsiderations: {
                                  ...currentPlace.suitableFor.healthConsiderations,
                                  notRecommendedFor: newValue
                                }
                              }
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Not Recommended For"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          multiple
                          options={specialFacilities}
                          value={currentPlace.suitableFor.healthConsiderations.specialFacilities}
                          onChange={(event, newValue) => {
                            setCurrentPlace({
                              ...currentPlace,
                              suitableFor: {
                                ...currentPlace.suitableFor,
                                healthConsiderations: {
                                  ...currentPlace.suitableFor.healthConsiderations,
                                  specialFacilities: newValue
                                }
                              }
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Special Facilities"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddPlace}
                      startIcon={<Add />}
                      fullWidth
                    >
                      Add Place
                    </Button>
                  </Grid>
                </Grid>
                
                <Divider style={{ margin: '20px 0' }} />
                
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                  Added Places
                </Typography>
                
                {places.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No places added yet.
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {places.map((place, index) => (
                      <Card variant="outlined" key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">{place.name}</Typography>
                            <IconButton size="small" onClick={() => handleRemovePlace(index)}>
                              <Delete />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            Types: {place.placeType.join(', ')}
                          </Typography>
                          <Typography variant="body2">
                            {place.description}
                          </Typography>
                          <Typography variant="body2" style={{ marginTop: '8px' }}>
                            Location: {place.location.coordinates[0]}, {place.location.coordinates[1]}
                          </Typography>
                          <Box display="flex" flexWrap="wrap" mt={1}>
                            {place.images.slice(0, 3).map((img, i) => (
                              <img 
                                key={i}
                                src={img} 
                                alt={`Place ${index} preview ${i}`}
                                style={{ 
                                  width: '60px', 
                                  height: '40px', 
                                  objectFit: 'cover', 
                                  margin: '2px',
                                  borderRadius: '4px'
                                }}
                              />
                            ))}
                            {place.images.length > 3 && (
                              <Chip 
                                label={`+${place.images.length - 3} more`} 
                                size="small"
                                style={{ margin: '2px' }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              style={{ marginTop: 24 }}
              disabled={!isFormValid}
            >
              Add Tour Package
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTourPackage;