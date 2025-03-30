import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Card, 
  CardContent, 
  Grid,
  Container,
  Avatar,
  TextField,
  Chip
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBackIos, 
  ArrowForwardIos, 
  DirectionsBus,
  DirectionsCar,
  Train,
  TwoWheeler,
  Flight,
  Star,
  Email,
  Phone,
  Place,
  Schedule,
  VerifiedUser,
  LocalAtm
} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PackagePage from '../Pages/PackagePage';

const useStyles = makeStyles((theme) => ({
  heroSection: {
    position: 'relative',
    minHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: theme.spacing(4),
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: theme.shape.borderRadius,
  },
  slideIndicator: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&.active': {
      backgroundColor: theme.palette.primary.main,
    }
  },
  serviceCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: theme.shadows[6],
    }
  },
  testimonialCard: {
    padding: theme.spacing(3),
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  contactForm: {
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  iconLarge: {
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  section: {
    padding: theme.spacing(8, 0),
  },
  sectionTitle: {
    position: 'relative',
    marginBottom: theme.spacing(6),
    '&::after': {
      content: '""',
      display: 'block',
      width: '80px',
      height: '4px',
      backgroundColor: theme.palette.primary.main,
      margin: theme.spacing(2, 'auto', 0),
    }
  },
  bookingCard: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: theme.shape.borderRadius,
  }
}));

const TransportHome = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero section slides
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Premium Transport Services',
      subtitle: 'Comfortable and reliable transportation for all your travel needs'
    },
    {
      image: 'https://img.freepik.com/free-photo/sunset-pool_1203-3192.jpg?t=st=1743300651~exp=1743304251~hmac=1ad6471ac05d539a10a76e5ab6e82c45e10203bf83fa14729a4c7f1656d052fc&w=900',
      title: 'Nationwide Coverage',
      subtitle: 'Connecting you to destinations across the country'
    },
    {
      image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Safe & Secure Travel',
      subtitle: 'Your safety is our top priority'
    }
  ];

  // Services data
  const services = [
    {
      icon: <DirectionsCar className={classes.iconLarge} />,
      title: "Car Rentals",
      description: "Wide selection of vehicles with flexible rental options."
    },
    {
      icon: <Flight className={classes.iconLarge} />,
      title: "Airport Transfers",
      description: "Reliable transfers to and from all major airports."
    },
    {
      icon: <Schedule className={classes.iconLarge} />,
      title: "Scheduled Tours",
      description: "Guided tours with transportation included."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Robert Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "New York, USA",
      rating: 5,
      comment: "The bus service was extremely comfortable and arrived right on time. Will definitely use again!"
    },
    {
      name: "Maria Garcia",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      location: "Miami, USA",
      rating: 4,
      comment: "Rented a car for our family vacation and the process was seamless. Great customer service."
    },
    {
      name: "James Wilson",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      location: "Chicago, USA",
      rating: 5,
      comment: "The airport transfer was worth every penny. Driver was professional and vehicle was spotless."
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const theme = useTheme();

  return (
    <Box>
      
      {/* Hero Section with Slideshow */}
      <Box 
        className={classes.heroSection}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slides[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out'
        }}
      >
        <Container>
          <Box className={classes.heroContent}>
            <Typography 
              variant="h2" 
              gutterBottom 
              style={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 'bold',
                marginBottom: '20px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {slides[currentSlide].title}
            </Typography>
            <Typography 
              variant="h5" 
              style={{
                fontFamily: '"Roboto", sans-serif',
                marginBottom: '40px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {slides[currentSlide].subtitle}
            </Typography>
            
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/login')}
              style={{
                padding: '15px 40px',
                fontWeight: 'bold',
                borderRadius: '50px',
                fontSize: '1.1rem'
              }}
            >
              Book Now
            </Button>
          </Box>
        </Container>

        {/* Navigation Arrows */}
        <IconButton 
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            zIndex: 2,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ArrowBackIos />
        </IconButton>
        
        <IconButton 
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            zIndex: 2,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ArrowForwardIos />
        </IconButton>
        
        {/* Slide Indicators */}
        <Box
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            gap: '10px'
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`${classes.slideIndicator} ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
        </Box>
      </Box>
      <PackagePage></PackagePage>

      {/* Services Section */}
      <Box className={classes.section} bgcolor="background.default">
        <Container>
          <Typography 
            variant="h3" 
            align="center" 
            className={classes.sectionTitle}
            style={{ fontWeight: 'bold' }}
          >
            Our Transport Services
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="textSecondary" 
            paragraph
            style={{ maxWidth: '800px', margin: '0 auto 40px' }}
          >
            Choose from our wide range of transportation options to suit your needs
          </Typography>
          
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className={classes.serviceCard}>
                  {service.icon}
                  <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" align="center">
                    {service.description}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    style={{ marginTop: '20px' }}
                    onClick={() => navigate(`/services/${service.title.toLowerCase().replace(' ', '-')}`)}
                  >
                    Learn More
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box className={classes.section} style={{ backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)' }}>
        <Container>
          <Grid container alignItems="center" spacing={6}>
            <Grid item xs={12} md={6}>
              <img 
                src="https://img.freepik.com/free-photo/girl-taking-photo-boyfriend-jungle_23-2147637676.jpg?uid=R129411847&ga=GA1.1.1390875937.1743015419&semt=ais_hybrid" 
                alt="Transport Benefits" 
                style={{ 
                  width: '100%', 
                  borderRadius: '8px', 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
                }} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                gutterBottom 
                className={classes.sectionTitle}
                style={{ textAlign: 'left' }}
              >
                Why Choose Us?
              </Typography>
              
              <Box display="flex" alignItems="flex-start" mb={3}>
                <VerifiedUser style={{ color: '#1976d2', fontSize: '2rem', marginRight: '16px' }} />
                <Box>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    Trusted Service
                  </Typography>
                  <Typography variant="body1">
                    Licensed and verified transport providers with excellent safety records.
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="flex-start" mb={3}>
                <LocalAtm style={{ color: '#1976d2', fontSize: '2rem', marginRight: '16px' }} />
                <Box>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    Best Prices
                  </Typography>
                  <Typography variant="body1">
                    Competitive pricing with no hidden charges. Price match guarantee.
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="flex-start">
                <Schedule style={{ color: '#1976d2', fontSize: '2rem', marginRight: '16px' }} />
                <Box>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    24/7 Availability
                  </Typography>
                  <Typography variant="body1">
                    Book anytime, anywhere. Our customer support is always available.
                  </Typography>
                </Box>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                style={{ marginTop: '30px' }}
                onClick={() => navigate('/about')}
              >
                Learn More About Us
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box className={classes.section}>
        <Container>
          <Typography 
            variant="h3" 
            align="center" 
            className={classes.sectionTitle}
            style={{ fontWeight: 'bold' }}
          >
            What Our Customers Say
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="textSecondary" 
            paragraph
            style={{ maxWidth: '800px', margin: '0 auto 40px' }}
          >
            Hear from travelers who have used our transport services
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className={classes.testimonialCard} elevation={3}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      style={{ width: '60px', height: '60px', marginRight: '16px' }} 
                    />
                    <Box>
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" mb={2}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        style={{ 
                          color: i < testimonial.rating ? '#FFD700' : '#E0E0E0',
                          fontSize: '1.2rem'
                        }} 
                      />
                    ))}
                  </Box>
                  <Typography variant="body1" style={{ fontStyle: 'italic' }}>
                    "{testimonial.comment}"
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box className={classes.section} style={{ backgroundColor: '#1976d2', color: 'white' }}>
        <Container>
          <Grid container spacing={4} justify="center">
            <Grid item xs={6} sm={3} align="center">
              <Typography variant="h2" style={{ fontWeight: 'bold' }}>10K+</Typography>
              <Typography variant="h6">Daily Rides</Typography>
            </Grid>
            <Grid item xs={6} sm={3} align="center">
              <Typography variant="h2" style={{ fontWeight: 'bold' }}>200+</Typography>
              <Typography variant="h6">Vehicles</Typography>
            </Grid>
            <Grid item xs={6} sm={3} align="center">
              <Typography variant="h2" style={{ fontWeight: 'bold' }}>50+</Typography>
              <Typography variant="h6">Cities</Typography>
            </Grid>
            <Grid item xs={6} sm={3} align="center">
              <Typography variant="h2" style={{ fontWeight: 'bold' }}>98%</Typography>
              <Typography variant="h6">Customer Satisfaction</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box className={classes.section} id="contact">
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center" 
            className={classes.sectionTitle}
            style={{ fontWeight: 'bold' }}
          >
            Contact Us
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="textSecondary" 
            paragraph
            style={{ margin: '0 auto 40px' }}
          >
            Need assistance? Our team is here to help
          </Typography>
          
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Card className={classes.contactForm} elevation={3}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        variant="outlined"
                        multiline
                        rows={4}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        fullWidth
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box mb={4}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                  Get in Touch
                </Typography>
                <Typography variant="body1" paragraph>
                  Have questions about our services or need help with a booking? Contact our customer support team.
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={3}>
                <Place style={{ marginRight: '16px', color: '#1976d2', fontSize: '2rem' }} />
                <Box>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Headquarters
                  </Typography>
                  <Typography variant="body1">
                    456 Transport Avenue, City Center, 10001
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" mb={3}>
                <Email style={{ marginRight: '16px', color: '#1976d2', fontSize: '2rem' }} />
                <Box>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Email
                  </Typography>
                  <Typography variant="body1">
                    support@transportpro.com
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center">
                <Phone style={{ marginRight: '16px', color: '#1976d2', fontSize: '2rem' }} />
                <Box>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    +1 (800) 123-4567 (24/7 Support)
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default TransportHome;