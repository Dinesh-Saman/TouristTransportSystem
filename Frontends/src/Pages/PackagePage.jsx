import React, { useEffect, useState } from 'react';
import { 
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import PackageCard from '../Components/PackageCard';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(8, 0),
  },
  title: {
    position: 'relative',
    marginBottom: theme.spacing(4),
    fontWeight: 'bold',
    '&::after': {
      content: '""',
      display: 'block',
      width: 80,
      height: 4,
      backgroundColor: theme.palette.primary.main,
      margin: theme.spacing(2, 'auto', 0),
    }
  },
  subtitle: {
    maxWidth: 800,
    margin: '0 auto 40px',
    textAlign: 'center',
  },
}));

const PackagesPage = () => {
  const classes = useStyles();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/packages');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <Container className={classes.root}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Typography variant="h3" align="center" className={classes.title}>
        Tour Packages
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" className={classes.subtitle}>
        Discover our curated collection of travel packages tailored to your preferences
      </Typography>
      
      <Grid container spacing={4}>
        {packages.map(pkg => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pkg._id}>
            <PackageCard packageData={pkg} />
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={4}>
        <Button variant="outlined" color="primary" size="large">
          View More Packages
        </Button>
      </Box>
    </Container>
  );
};

export default PackagesPage;