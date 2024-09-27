import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { GreenButton } from '../../../components/buttonStyles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subjectDetails, sclassStudents, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    console.log("subject id", subjectID)
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));

  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error)
  }

  useEffect(() => { console.log("view subject", { subjectDetails, sclassStudents }) }, [subjectDetails, sclassStudents])

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Subject Details
        </Typography>
        <Typography variant="h6" gutterBottom>
          Subject Name : {subjectDetails && subjectDetails.subName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Subject Code : {subjectDetails && subjectDetails.subCode}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Subject Sessions : {subjectDetails && subjectDetails.sessions}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Students: {numberOfStudents}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Class Name : {subjectDetails && subjectDetails.className && subjectDetails.className.className}
        </Typography>
        {subjectDetails && subjectDetails.teacher ?
          <Typography variant="h6" gutterBottom>
            Teacher Name : {subjectDetails.teacher.name}
          </Typography>
          :
          <GreenButton variant="contained"
            onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}>
            Add Subject Teacher
          </GreenButton>
        }
      </>
    );
  }

  return (
    <>
      {false ?
        < div > Loading...</div >
        :
        <>
          <Box sx={{ width: '100%', typography: 'body1', }} >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                  <Tab label="Details" value="1" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <SubjectDetailsSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      }
    </>
  )
}

export default ViewSubject