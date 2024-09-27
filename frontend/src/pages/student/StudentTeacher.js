import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { BottomNavigation, BottomNavigationAction, Container, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart'
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import axios from 'axios';
import TableTemplate from '../../components/TableTemplate';
import { BlueButton } from "../../components/buttonStyles";


const StudentTeacher = () => {

    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    const [teacherData, setTeachersData] = useState([])

    useEffect(() => {
        console.log({ currentUser })
        dispatch(getUserDetails(currentUser._id, "Student"));
        console.log({ ans: currentUser._id })
        let className = currentUser.className.className
        const fetchData = async () => {
            const teachers = await axios.get(`${process.env.REACT_APP_BASE_URL}/StudentTeacher/${className}`);
            console.log({ curans: teachers.data })
            setTeachersData(teachers.data.teachers)
        }
        fetchData()
    }, [dispatch, currentUser._id])

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
            console.log("sclassDetails in class", sclassDetails)
        }
    }, [userDetails])

    useEffect(() => { console.log({ teacherData }) }, [teacherData])

    useEffect(() => {
        if (subjectMarks.length == 0) {
            dispatch(getSubjectList(currentUser.className._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.className._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => {
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Subject Marks
                </Typography>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Marks</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {subjectMarks.map((result, index) => {
                            if (!result.subName || !result.marksObtained) {
                                return null;
                            }
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </>
        );
    };

    const renderChartSection = () => {
        return <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />;
    };




    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'gender', label: 'Gender', minWidth: 100 },
        { id: 'DOB', label: 'DOB', minWidth: 100 },
        { id: 'contactDetails', label: 'Phone-no', minWidth: 100 }
    ]

    const studentRows = teacherData?.map((teacher) => {
        return {
            name: teacher.name,
            gender: teacher.gender,
            DOB: teacher.DOB,
            contactDetails: teacher.contactDetails
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <BlueButton variant="contained"
                >
                    View
                </BlueButton>
            </>
        );
    };








    const renderClassDetailsSection = () => {
        return (
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Teacher Details
                </Typography>
                <Typography variant="h5" gutterBottom>
                    You are currently in Class {currentUser.className.className}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    And these are the teachers:
                </Typography>

                {Array.isArray(teacherData) && teacherData.length > 0 &&
                    <TableTemplate buttonHaver={SubjectsButtonHaver} columns={studentColumns} rows={studentRows} />
                }


            </Container>
        );
    };
    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                        ?
                        (<>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>)
                        :
                        (<>
                            {renderClassDetailsSection()}
                        </>)
                    }
                </div>
            )}
        </>
    );
};

export default StudentTeacher;