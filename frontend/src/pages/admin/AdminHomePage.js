import { Container, Grid, Paper } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import GenderDoughnutChart from '../../components/doughnut';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const [girlsVsBoys, setGirlsVsBoys] = useState([]);
    const [teacherStaff, setTeacherStaff] = useState([]);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));

        // const fetchData = async () => {
        //     const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/girlsBoysAdminCount`);
        //     setGirlsVsBoys(result.data)

        //     const result1 = await axios.get(`${process.env.REACT_APP_BASE_URL}/teacherGenderCount`);
        //     setTeacherStaff(result1.data)
        // }
        // fetchData();

    }, [adminID, dispatch]);

    useEffect(() => {

        if (studentsList) {
            let numberOfGirls = 0;
            let numberOfBoys = 0;
            studentsList.forEach(element => {
                element.gender === 'Male' ? numberOfBoys++ : numberOfGirls++;
            });
            setGirlsVsBoys([numberOfBoys, numberOfGirls])
        }

        if (teachersList) {
            let numberOfGirls = 0;
            let numberOfBoys = 0;
            teachersList.forEach(element => {
                element.gender === 'Male' ? numberOfBoys++ : numberOfGirls++;
            });
            setTeacherStaff([numberOfBoys, numberOfGirls])
        }


    }, [studentsList, sclassesList, teachersList])

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3} lg={4}>
                        <StyledPaper sx={{
                            borderRadius: "40px",
                            overflow: "hidden"
                        }}>
                            <img src={Students} alt="Students" />
                            <Title>
                                Total Students
                            </Title>
                            <Data start={0} end={numberOfStudents} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={4}>
                        <StyledPaper sx={{
                            borderRadius: "40px",
                            overflow: "hidden"
                        }}>
                            <img src={Classes} alt="Classes" />
                            <Title>
                                Total Classes
                            </Title>
                            <Data start={0} end={numberOfClasses} duration={5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={4}>
                        <StyledPaper sx={{
                            borderRadius: "40px",
                            overflow: "hidden"
                        }}>
                            <img src={Teachers} alt="Teachers" />
                            <Title>
                                Total Teachers
                            </Title>
                            <Data start={0} end={numberOfTeachers} duration={2.5} />
                        </StyledPaper>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={6}>
                        <GenderDoughnutChart chartType={'bar'} labels={['Boys', 'Girls']} dataValues={girlsVsBoys} backgroundColor={['#36A2EB', '#FF6384']} label={'Students Gender'} />
                    </Grid>
                    <Grid item xs={12} md={3} lg={6}>
                        <GenderDoughnutChart chartType={'bar'} labels={['MaleStaff', 'FemaleStaff']} dataValues={teacherStaff} backgroundColor={['#36A2EB', '#FF6384']} label={'Teacher Gender'} />
                    </Grid>
                </Grid>
            </Container >
        </>
    );
};


const StyledPaper = styled(Paper)`
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
  padding: 16px;
 
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

export default AdminHomePage