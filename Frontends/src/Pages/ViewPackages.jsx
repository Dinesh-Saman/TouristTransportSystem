import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, 
  Avatar, Chip, IconButton, Collapse, Grid, Card, CardContent, CardHeader, Divider, 
  List, ListItem, ListItemText, Badge, CardMedia
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../Components/sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DescriptionIcon from '@material-ui/icons/Description';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PublicIcon from '@material-ui/icons/Public';
import TerrainIcon from '@material-ui/icons/Terrain';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import WcIcon from '@material-ui/icons/Wc';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import LandscapeIcon from '@material-ui/icons/Landscape';
import HotelIcon from '@material-ui/icons/Hotel';
import ImageIcon from '@material-ui/icons/Image';

const useStyles = makeStyles((theme) => ({
  searchField: {
    marginBottom: '20px',
    width: '300px',
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '5px 10px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  },
  criteriaSelect: {
    marginRight: '45px',
    minWidth: '150px',
    marginBottom: '30px',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(3),
    borderRadius: 8,
    '& .MuiTable-root': {
      borderCollapse: 'separate',
      borderSpacing: '0 8px'
    },
  },
  tableRow: {
    backgroundColor: '#f9f9f9',
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  tableHeadRow: {
    backgroundColor: '#d4ac0d',
  },
  tableHeadCell: {
    color: 'white',
    fontWeight: 'bold',
  },
  packageAvatar: {
    width: 60,
    height: 60,
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
    border: '2px solid white',
  },
  detailsContainer: {
    padding: theme.spacing(3),
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: theme.spacing(2, 0),
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  packageInfoFlex: {
    display: 'flex',
    padding: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: theme.spacing(3),
  },
  packageAvatarLarge: {
    width: 100,
    height: 100,
    marginRight: theme.spacing(4),
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    border: '3px solid white',
  },
  packageDetailsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  packageName: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.dark,
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(1.5),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeaderLocation: {
    backgroundColor: '#43a047',
  },
  cardHeaderDetails: {
    backgroundColor: '#1976d2',
  },
  cardHeaderPlaces: {
    backgroundColor: '#7b1fa2',
  },
  cardIcon: {
    marginRight: theme.spacing(1),
    color: 'white',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1.5, 0),
    '& svg': {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
    },
  },
  infoLabel: {
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    minWidth: 120,
  },
  infoValue: {
    color: theme.palette.text.primary,
  },
  actionButton: {
    margin: theme.spacing(0.5),
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  editButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2E7D32',
    },
  },
  placeChip: {
    margin: theme.spacing(0.5),
    backgroundColor: '#e0f7fa',
  },
  typeChip: {
    margin: theme.spacing(0.5),
    backgroundColor: '#e8f5e9',
  },
  suitabilityChip: {
    margin: theme.spacing(0.5),
    backgroundColor: '#fff3e0',
  },
  imageGallery: {
    display: 'flex',
    overflow: 'hidden',
    borderRadius: '8px 8px 0 0',
    height: 180,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
  imageCount: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
  },
  placeCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    },
  },
  noImagePlaceholder: {
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px 8px 0 0',
  }
}));

const ViewPackages = () => {
  const classes = useStyles();
  const [packageData, setPackageData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/packages');
        
        if (Array.isArray(response.data)) {
          setPackageData(response.data);
        } else if (response.data && Array.isArray(response.data.packages)) {
          setPackageData(response.data.packages);
        } else if (response.data && Array.isArray(response.data.data)) {
          setPackageData(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setPackageData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the package data!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load package data',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        setPackageData([]);
      }
    };
  
    fetchPackageData();
  }, []);

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/packages/${id}`);
        setPackageData(packageData.filter(pkg => pkg._id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Package has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error("There was an error deleting the package!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Error deleting package: ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleUpdate = (packageId) => {
    navigate(`/update-package/${packageId}`);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
    setSearchQuery("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredPackages = packageData.filter(pkg => {
    if (!searchQuery) return true;
    
    // Handle nested fields
    if (searchCriteria === 'district') {
      return pkg.district?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    const field = pkg[searchCriteria]?.toString().toLowerCase();
    return field?.includes(searchQuery.toLowerCase());
  });

  const paginatedPackages = filteredPackages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderPlaceTypes = (types) => {
    if (!types || types.length === 0) return 'N/A';
    
    return types.map((type, index) => (
      <Chip 
        key={index}
        label={type}
        size="small"
        className={classes.typeChip}
        icon={
          type === 'Beach' ? <BeachAccessIcon fontSize="small" /> :
          type === 'Mountains' ? <TerrainIcon fontSize="small" /> :
          type === 'Waterfalls' ? <LandscapeIcon fontSize="small" /> :
          <PublicIcon fontSize="small" />
        }
      />
    ));
  };

  const renderSuitability = (suitability) => {
    if (!suitability) return null;
    
    return (
      <Box mt={1}>
        <Typography variant="subtitle2" gutterBottom>Age Range: {suitability.ageRange?.min || 0} - {suitability.ageRange?.max || 100}</Typography>
        <Typography variant="subtitle2" gutterBottom>Gender Neutral: {suitability.genderNeutral ? 'Yes' : 'No'}</Typography>
        
        {suitability.hobbies && suitability.hobbies.length > 0 && (
          <Box mt={1}>
            <Typography variant="subtitle2">Hobbies:</Typography>
            <Box>
              {suitability.hobbies.map((hobby, index) => (
                <Chip 
                  key={index}
                  label={hobby}
                  size="small"
                  className={classes.suitabilityChip}
                />
              ))}
            </Box>
          </Box>
        )}
        
        {suitability.climate && suitability.climate.length > 0 && (
          <Box mt={1}>
            <Typography variant="subtitle2">Climate:</Typography>
            <Box>
              {suitability.climate.map((climate, index) => (
                <Chip 
                  key={index}
                  label={climate}
                  size="small"
                  className={classes.suitabilityChip}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const renderPlaceImages = (images) => {
    if (!images || images.length === 0) {
      return (
        <Box className={classes.noImagePlaceholder}>
          <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon style={{ marginRight: 8 }} /> No images available
          </Typography>
        </Box>
      );
    }

    return (
      <Box className={classes.imageGallery}>
        <img 
          src={images[0]} 
          alt="Place" 
          className={classes.mainImage}
          onError={(e) => {
            console.error("Error loading image");
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x250?text=Image+Not+Available";
          }}
        />
        {images.length > 1 && (
          <Box className={classes.imageOverlay}>
            <Box className={classes.imageCount}>
              <ImageIcon style={{ fontSize: 16, marginRight: 4 }} />
              {images.length} Photos
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box className={classes.contentContainer}>
          <Box
            alignItems="center"
            justifyContent="space-between"
            marginTop={"60px"}
            width="100%"
            display="flex"
            flexDirection="row"
            marginBottom={3}
          >
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Tour Packages
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="name">Package Name</MenuItem>
                  <MenuItem value="district">District</MenuItem>
                  <MenuItem value="duration">Duration</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                placeholder={`Search by ${searchCriteria}`}
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className={classes.searchField}
              />
            </Box>
          </Box>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow className={classes.tableHeadRow}>
                  <TableCell className={classes.tableHeadCell}></TableCell>
                  <TableCell className={classes.tableHeadCell}>Image</TableCell>
                  <TableCell className={classes.tableHeadCell}>Package Name</TableCell>
                  <TableCell className={classes.tableHeadCell}>District</TableCell>
                  <TableCell className={classes.tableHeadCell}>Duration (Days)</TableCell>
                  <TableCell className={classes.tableHeadCell}>Places</TableCell>
                  <TableCell className={classes.tableHeadCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPackages.map((pkg) => (
                  <React.Fragment key={pkg._id}>
                    <TableRow className={classes.tableRow}>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleExpandRow(pkg._id)}
                          style={{ transform: expandedRow === pkg._id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {pkg.packageImage ? (
                          <Avatar 
                            className={classes.packageAvatar} 
                            src={pkg.packageImage}
                            alt={pkg.name}
                            onError={(e) => {
                              console.error("Error loading image");
                              e.target.onerror = null; 
                              e.target.src = ""; 
                            }}
                          />
                        ) : (
                          <Avatar className={classes.packageAvatar}>
                            {pkg.name ? pkg.name.charAt(0).toUpperCase() : 'P'}
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell><strong>{pkg.name}</strong></TableCell>
                      <TableCell>{pkg.district}</TableCell>
                      <TableCell>{pkg.duration}</TableCell>
                      <TableCell>
                        <Badge 
                          badgeContent={pkg.places?.length || 0} 
                          color="primary"
                          overlap="rectangular"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <IconButton
                            className={`${classes.actionButton} ${classes.editButton}`}
                            size="small"
                            onClick={() => handleUpdate(pkg._id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            className={`${classes.actionButton} ${classes.deleteButton}`}
                            size="small"
                            onClick={() => handleDelete(pkg._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={expandedRow === pkg._id} timeout="auto" unmountOnExit>
                          <Box className={classes.detailsContainer}>
                            <Box className={classes.packageInfoFlex}>
                              {pkg.packageImage ? (
                                <Avatar 
                                  className={classes.packageAvatarLarge} 
                                  src={pkg.packageImage}
                                  alt={pkg.name}
                                  onError={(e) => {
                                    console.error("Error loading image");
                                    e.target.onerror = null; 
                                    e.target.src = ""; 
                                  }}
                                />
                              ) : (
                                <Avatar className={classes.packageAvatarLarge}>
                                  {pkg.name ? pkg.name.charAt(0).toUpperCase() : 'P'}
                                </Avatar>
                              )}
                              <Box className={classes.packageDetailsSection}>
                                <Typography variant="h5" className={classes.packageName}>
                                  {pkg.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {pkg.district} District
                                </Typography>
                                <Box mt={1}>
                                  <Typography variant="body2">
                                    <CalendarTodayIcon fontSize="small" /> Duration: {pkg.duration} days
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            
                            {/* Package Details Card - Full Width */}
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader} ${classes.cardHeaderDetails}`}
                                    avatar={<DescriptionIcon className={classes.cardIcon} />}
                                    title="Package Details"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                  />
                                  <CardContent>
                                    <Typography variant="body1" paragraph>
                                      {pkg.description}
                                    </Typography>
                                    <Divider />
                                    <Box mt={2}>
                                      <Typography variant="subtitle1" gutterBottom>
                                        Created: {formatDate(pkg.createdAt)}
                                      </Typography>
                                      <Typography variant="subtitle1">
                                        Last Updated: {formatDate(pkg.updatedAt)}
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                              
                              {/* Places Card - Full Width */}
                              <Grid item xs={12}>
                                <Card>
                                  <CardHeader
                                    className={`${classes.cardHeader} ${classes.cardHeaderPlaces}`}
                                    avatar={<LocationOnIcon className={classes.cardIcon} />}
                                    title="Included Places"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                  />
                                  <CardContent>
                                    {pkg.places && pkg.places.length > 0 ? (
                                      <Grid container spacing={3}>
                                        {pkg.places.map((place, index) => (
                                          <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Card className={classes.placeCard} variant="outlined">
                                              {/* Place images at the top */}
                                              {renderPlaceImages(place.images)}
                                              
                                              <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                  {place.name}
                                                </Typography>
                                                <Typography variant="body2" paragraph>
                                                  {place.description}
                                                </Typography>
                                                
                                                <Box mt={1}>
                                                  <Typography variant="subtitle2">Place Types:</Typography>
                                                  <Box>
                                                    {renderPlaceTypes(place.placeType)}
                                                  </Box>
                                                </Box>
                                                
                                                {renderSuitability(place.suitableFor)}
                                                
                                                <Box mt={2}>
                                                  <Typography variant="subtitle2">Location:</Typography>
                                                  <Typography variant="body2">
                                                    {place.location.coordinates[0]}, {place.location.coordinates[1]}
                                                  </Typography>
                                                </Box>
                                              </CardContent>
                                            </Card>
                                          </Grid>
                                        ))}
                                      </Grid>
                                    ) : (
                                      <Typography variant="body2" color="textSecondary">
                                        No places included in this package
                                      </Typography>
                                    )}
                                  </CardContent>
                                </Card>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredPackages.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewPackages;