import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, FormHelperText,
  RadioGroup, FormControlLabel, Radio, Avatar, CircularProgress,
  FormControl, Link
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    backgroundImage: 'url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
    }
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[10],
    width: '100%',
    maxWidth: '600px',
    padding: theme.spacing(4),
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
    border: '2px solid #3f51b5', // Added border styling
    '&:before': { // Added decorative corner elements
      content: '""',
      position: 'absolute',
      top: -10,
      left: -10,
      right: -10,
      bottom: -10,
      border: '2px solid #3f51b5',
      borderRadius: theme.shape.borderRadius * 2 + 4,
      zIndex: -1,
      opacity: 0.5
    },
    '&:after': { // Added another decorative layer
      content: '""',
      position: 'absolute',
      top: -15,
      left: -15,
      right: -15,
      bottom: -15,
      border: '2px solid #3f51b5',
      borderRadius: theme.shape.borderRadius * 2 + 8,
      zIndex: -2,
      opacity: 0.3
    }
  },
  title: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 700,
    color: theme.palette.primary.main,
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    position: 'relative',
    '&:after': { // Added underline effect
      content: '""',
      position: 'absolute',
      bottom: -10,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '4px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '2px'
    }
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3)
  },
  avatar: {
    width: 120,
    height: 120,
    border: '3px solid #e0e0e0',
    boxShadow: theme.shadows[3],
    marginBottom: theme.spacing(2)
  },
  submitButton: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: 1.1,
    borderRadius: 50,
    boxShadow: theme.shadows[2],
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)',
      backgroundColor: theme.palette.primary.dark
    },
    transition: 'all 0.3s ease' // Added smooth transition
  },
  loginLink: {
    fontWeight: 600,
    color: theme.palette.primary.dark,
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.primary.main
    }
  },
  inputField: { // Added styling for input fields
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#3f51b5',
        borderWidth: '1px'
      },
      '&:hover fieldset': {
        borderColor: '#3f51b5',
        borderWidth: '1px'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3f51b5',
        borderWidth: '1px'
      }
    }
  }
}));

const EditProfile = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    address: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const userData = response.data.user;
  
        setFormData({
          fullName: userData.full_name,
          email: userData.email,
          contact: userData.contact,
          address: userData.address,
          dob: userData.dob.split('T')[0],
          gender: userData.gender,
          password: '',
          confirmPassword: ''
        });
        
        if (userData.profile_picture) {
          setProfilePicturePreview(`http://localhost:5000/${userData.profile_picture}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        swal('Error', 'Failed to fetch user data. Please try again.', 'error');
      }
    };
  
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateContact = (value) => /^\d{10}$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setErrors(prev => ({ ...prev, profilePicture: "Only JPG/PNG images allowed" }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profilePicture: "Max file size is 2MB" }));
      return;
    }

    setProfilePicture(file);
    setErrors(prev => ({ ...prev, profilePicture: '' }));

    const reader = new FileReader();
    reader.onload = () => setProfilePicturePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview('');
  };

  const validateForm = () => {
    const newErrors = {};
    const { fullName, email, contact, address, dob, gender, password, confirmPassword } = formData;

    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!contact) newErrors.contact = "Contact is required";
    else if (!validateContact(contact)) newErrors.contact = "Must be 10 digits";
    if (!address) newErrors.address = "Address is required";
    if (!dob) newErrors.dob = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (password && password.length < 8) newErrors.password = "Minimum 8 characters";
    if (password && password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('full_name', formData.fullName);
    data.append('email', formData.email);
    data.append('contact', formData.contact);
    data.append('address', formData.address);
    data.append('dob', formData.dob);
    data.append('gender', formData.gender);
    if (formData.password) data.append('password', formData.password);
    if (profilePicture) data.append('profile_picture', profilePicture);

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/user/profile', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      swal("Success", "Profile updated successfully!", "success");
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.status === 409) {
        const field = error.response.data.message.includes("email") ? "email" : "contact";
        swal("Error", error.response.data.message, "error");
        setErrors(prev => ({ ...prev, [field]: error.response.data.message }));
      } else {
        swal("Error", "Update failed. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.formContainer}>
        <Typography variant="h4" className={classes.title}>
          Edit Profile
        </Typography>

        {/* Profile Picture Section */}
        <Box className={classes.avatarContainer}>
          <Avatar
            src={profilePicturePreview}
            className={classes.avatar}
            alt="Profile"
          />
          
          <Box display="flex" alignItems="center">
            <input
              accept="image/*"
              id="profile-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleProfilePictureChange}
            />
            <label htmlFor="profile-upload">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
                size="small"
                disabled={isSubmitting}
                style={{ marginRight: 8 }}
              >
                Upload
              </Button>
            </label>
            
            {profilePicturePreview && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={handleRemoveProfilePicture}
                size="small"
                disabled={isSubmitting}
              >
                Remove
              </Button>
            )}
          </Box>
          
          {errors.profilePicture && (
            <Typography color="error" variant="caption" style={{ marginTop: 8 }}>
              {errors.profilePicture}
            </Typography>
          )}
          
          <Typography variant="caption" style={{ marginTop: 8, color: '#666' }}>
            Recommended: Square image, JPG or PNG, max 2MB
          </Typography>
        </Box>

        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
            className={classes.inputField}
            variant="outlined"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            className={classes.inputField}
            variant="outlined"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Contact Number"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            inputProps={{ maxLength: 10 }}
            error={!!errors.contact}
            helperText={errors.contact}
            required
            className={classes.inputField}
            variant="outlined"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            multiline
            rows={3}
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            required
            className={classes.inputField}
            variant="outlined"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Date of Birth"
            name="dob"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.dob}
            onChange={handleChange}
            error={!!errors.dob}
            helperText={errors.dob}
            required
            className={classes.inputField}
            variant="outlined"
          />

          <FormControl component="fieldset" margin="normal" error={!!errors.gender} required fullWidth>
            <Typography variant="subtitle1">Gender</Typography>
            <RadioGroup
              row
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
              <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
            </RadioGroup>
            <FormHelperText>{errors.gender}</FormHelperText>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            className={classes.submitButton}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={24} /> : null}
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>

          <Box mt={4} textAlign="center">
            <Typography variant="body1">
              <Link href="/" className={classes.loginLink}>
                Back to Home
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;