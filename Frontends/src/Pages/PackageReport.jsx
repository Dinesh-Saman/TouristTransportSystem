import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../Components/sidebar';
import axios from 'axios';
import html2canvas from 'html2canvas';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Chip,
  Badge
} from '@material-ui/core';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import letterheadImage from '../Images/letterhead.png'; 
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Terrain as TerrainIcon,
  BeachAccess as BeachAccessIcon,
  Landscape as LandscapeIcon,
  Public as PublicIcon
} from '@material-ui/icons';

const PackageReportPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/packages');
        
        if (Array.isArray(response.data)) {
          setPackages(response.data);
        } else if (response.data && Array.isArray(response.data.packages)) {
          setPackages(response.data.packages);
        } else if (response.data && Array.isArray(response.data.data)) {
          setPackages(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setPackages([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError('Failed to load packages.');
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    // Hide the buttons before capturing
    const downloadButtons = document.getElementById('download-buttons');
    if (downloadButtons) {
      downloadButtons.style.display = 'none';
    }
    
    try {
      const element = reportRef.current;
      
      // Additional html2canvas configuration for better rendering
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Ensure all elements are visible in the clone
          const elements = clonedDoc.querySelectorAll('*');
          elements.forEach(el => {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
          });
          
          // Force show all badges and chips
          const badges = clonedDoc.querySelectorAll('.MuiBadge-badge');
          badges.forEach(badge => {
            badge.style.display = 'block';
            badge.style.visibility = 'visible';
          });
          
          const chips = clonedDoc.querySelectorAll('.MuiChip-root');
          chips.forEach(chip => {
            chip.style.display = 'inline-flex';
            chip.style.visibility = 'visible';
            chip.style.opacity = '1';
          });
        }
      });
      
      // Restore the buttons
      if (downloadButtons) {
        downloadButtons.style.display = 'flex';
      }
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Add image to PDF (with padding)
      const margin = 2; // margin in mm
      doc.addImage(imgData, 'PNG', margin, margin, imgWidth - (margin * 2), imgHeight - (margin * 2));
      
      // If the image height is greater than page height, create multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      
      while (heightLeft >= pageHeight) {
        position = heightLeft - pageHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', margin, -(position + margin), imgWidth - (margin * 2), imgHeight - (margin * 2));
        heightLeft -= pageHeight;
      }
      
      doc.save('package_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      // Restore the buttons in case of error
      if (downloadButtons) {
        downloadButtons.style.display = 'flex';
      }
    }
  };

  const handleDownloadExcel = () => {
    try {
      // Prepare the data for Excel
      const excelData = packages.map(pkg => ({
        'Package ID': pkg._id,
        'Package Name': pkg.name,
        'District': pkg.district,
        'Duration (Days)': pkg.duration,
        'Places Count': pkg.places?.length || 0,
        'Place Types': pkg.places?.flatMap(place => place.placeType || []).filter((v, i, a) => a.indexOf(v) === i).join(', ') || 'N/A',
        'Price': pkg.price ? `$${pkg.price.toFixed(2)}` : 'N/A',
        'Created At': pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : 'N/A'
      }));
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Packages');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Save the file
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'package_report.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Failed to generate Excel file. Please try again.');
    }
  };

  const getPlaceTypeIcon = (type) => {
    switch(type) {
      case 'Beach': return <BeachAccessIcon fontSize="small" />;
      case 'Mountains': return <TerrainIcon fontSize="small" />;
      case 'Waterfalls': return <LandscapeIcon fontSize="small" />;
      default: return <PublicIcon fontSize="small" />;
    }
  };

  const renderPlaceTypes = (types) => {
    if (!types || types.length === 0) return 'N/A';
    
    return types.map((type, index) => (
        <Box
          key={index}
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#e0e0e0',
            padding: '5px 10px',
            borderRadius: '12px',
            fontSize: '14px',
            marginRight: '5px',
            marginTop:'5px'
          }}
        >
          {type}
        </Box>
      ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Box display="flex">
        <Sidebar />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          flex={1} 
          minHeight="100vh"
        >
          <Typography>Loading packages...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex">
        <Sidebar />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          flex={1} 
          minHeight="100vh"
        >
          <Typography color="error">{error}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box 
          flex={1} 
          p={2} 
          style={{ 
            minHeight: '100vh', 
            backgroundColor: 'white', 
            borderRadius: 8, 
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', 
            margin: '15px'
          }}
        >
          <Box 
            ref={reportRef}
            style={{ 
              backgroundColor: 'white', 
              borderRadius: 8, 
              position: 'relative',
              padding: '20px'
            }} 
            id="printable-section"
          >
            {/* Letterhead image */}
            <img 
              src={letterheadImage} 
              alt="Letterhead" 
              style={{ 
                width: '100%', 
                marginBottom: '20px', 
                borderBottom: '2px solid #d4ac0d', 
                boxSizing: 'border-box',
              }} 
            />
            
            {/* Page Title */}
            <Typography variant="h4" gutterBottom style={{ 
              marginBottom: '20px', 
              fontFamily: 'cursive', 
              fontWeight: 'bold', 
              color: 'purple', 
              textAlign: 'center' 
            }}>
              Tour Packages Report
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                    <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Package Name</strong></TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Image</strong></TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>District</strong></TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Duration</strong></TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Places</strong></TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Place Types</strong></TableCell>
                    <TableCell style={{ color: 'white' }}><strong>Created Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packages.length > 0 ? (
                    packages.map((pkg) => (
                      <TableRow key={pkg._id || `pkg-${Math.random()}`}>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>{pkg.name || 'N/A'}</TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>
                          {pkg.packageImage ? (
                            <Avatar 
                              src={pkg.packageImage}
                              alt={pkg.name}
                              style={{ 
                                width: 60, 
                                height: 60,
                                visibility: 'visible'
                              }}
                            />
                          ) : (
                            <Avatar style={{ 
                              width: 60, 
                              height: 60,
                              visibility: 'visible'
                            }}>
                              {pkg.name ? pkg.name.charAt(0).toUpperCase() : 'P'}
                            </Avatar>
                          )}
                        </TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>
                          <Box display="flex" alignItems="center">
                            <LocationOnIcon fontSize="small" style={{ marginRight: 5 }} />
                            {pkg.district || 'N/A'}
                          </Box>
                        </TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>
                          <Box display="flex" alignItems="center">
                            {pkg.duration ? `${pkg.duration} days` : 'N/A'}
                          </Box>
                        </TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>
                          <Badge 
                            badgeContent={pkg.places?.length || 0} 
                            color="primary"
                            overlap="rectangular"
                            style={{
                              marginLeft: '15px',
                              visibility: 'visible'
                            }}
                          />
                        </TableCell>
                        <TableCell style={{ borderRight: '1px solid #ddd' }}>
                          <Box style={{ visibility: 'visible' }}>
                            {pkg.places && pkg.places.length > 0 ? (
                              renderPlaceTypes(
                                Array.from(new Set(
                                  pkg.places.flatMap(place => place.placeType || [])
                                ))
                              )
                            ) : 'N/A'}
                          </Box>
                        </TableCell>
                        <TableCell>{formatDate(pkg.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No packages found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          
          <Box mt={4} display="flex" justifyContent="left" gap={2} id="download-buttons">
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
            <Button 
              variant="contained" 
              style={{ backgroundColor: '#d4ac0d', color: 'white', marginLeft: '15px' }}
              onClick={handleDownloadExcel}
            >
              Download Excel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PackageReportPage;