import { Container, Grid, Paper } from '@mui/material'
import SeeNotice from '../../../components/SeeNotice';
import Students from "../../../assets/img1.png";
import Classes from "../../../assets/img2.png";
import Teachers from "../../../assets/img3.png";
import Fees from "../../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import GenderDoughnutChart from '../../../components/doughnut';
import axios from 'axios';

const IncomeAnalytics = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user)

    const [selectYear, setSelectYear] = useState(2024);
    const [yearlyEarning, setYearlyEarning] = useState([]);
    const [monthlyEaring, setMonthlyEarning] = useState([]);
    const [years, setYears] = useState([]);
    const [totalEarning, setTotalEarning] = useState();
    const [chartType, setChartType] = useState('yearly');

    const [selectYearTeacher, setSelectYearTeacher] = useState(2024);
    const [yearlyEarningTeacher, setYearlyEarningTeacher] = useState([]);
    const [monthlyEaringTeacher, setMonthlyEarningTeacher] = useState([]);
    const [yearsTeacher, setYearsTeacher] = useState([]);
    const [totalEarningTeacher, setTotalEarningTeacher] = useState();
    const [chartTypeTeacher, setChartTypeTeacher] = useState('yearly');


    const [selectYearTeacherNet, setSelectYearTeacherNet] = useState(2024);
    const [yearlyEarningTeacherNet, setYearlyEarningTeacherNet] = useState([]);
    const [monthlyEaringTeacherNet, setMonthlyEarningTeacherNet] = useState([]);
    const [yearsTeacherNet, setYearsTeacherNet] = useState([]);
    const [totalEarningTeacherNet, setTotalEarningTeacherNet] = useState();
    const [chartTypeTeacherNet, setChartTypeTeacherNet] = useState('yearly');

    const adminID = currentUser._id

    const monthName = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "september", "Octomber", "November", "December"]

    useEffect(() => {
        console.log("it is running")
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));

        console.log("answer is solution", { studentsList, sclassesList, teachersList })
    }, [adminID, dispatch]);

    useEffect(() => {
        const StudentsEarning = async () => {
            const myMap = new Map();
            const classPrices = new Map();

            sclassesList.forEach((classer) => {
                classPrices.set(classer.className, { fees: classer.fees, year: classer.year });
            })


            console.log("Student Earning is running")
            try {
                if (chartType === 'yearly') {
                    sclassesList.forEach((classer) => {
                        let profit = classer.fees * classer.students.length;
                        if (myMap.has(classer.year)) {
                            profit = profit + myMap.get(classer.year);
                        }
                        console.log(profit);
                        myMap.set(classer.year, profit);
                    })

                    let years = [];
                    let profits = [];

                    myMap.forEach((profit, year) => {
                        years.push(year);
                        profits.push(profit);
                    });

                    setYearlyEarning(profits);
                    setYears(years);
                    let totalEarnings = 0;
                    profits.forEach((p) => {
                        totalEarnings += p;
                    })
                    setTotalEarning(totalEarnings);

                    console.log('Years:', years);
                    console.log('Profits:', profits);
                }
                else if (chartType === 'monthly' && studentsList) {
                    let month;
                    console.log({ studentsList });
                    studentsList.forEach((student) => {
                        const studentPaid = classPrices.get(student.className.className).fees;
                        const studentYear = classPrices.get(student.className.className).year;

                        console.log("student year", { studentPaid, studentYear, selectYear })

                        if (studentYear === parseInt(selectYear, 10)) {
                            if (student.createdAt)
                                month = new Date(student.createdAt).getMonth();
                            else {
                                month = Math.floor(Math.random() * 9) + 1;
                                console.log({ month })
                            }


                            console.log({ studentPaid, studentYear })
                            if (myMap.has(month)) {
                                const pricing = myMap.get(month) + studentPaid;
                                myMap.set(month, pricing);
                            } else {
                                myMap.set(month, studentPaid);
                            }
                        }


                    })

                    let profits = [];

                    monthName.forEach((month, index) => {
                        let profit = myMap.has(index) ? myMap.get(index) : 0;
                        profits.push(profit);
                    });

                    console.log({ monthName, profits });
                    setMonthlyEarning(profits)

                }
            } catch (e) {
                console.log(e)
            }
        }
        StudentsEarning();
    }, [sclassesList, studentsList, chartType, selectYear])

    useEffect(() => {
        const TeacherEarning = async () => {
            const myMap = new Map();
            const classPrices = new Map();

            sclassesList.forEach((classer) => {
                classPrices.set(classer.className, { fees: classer.fees, year: classer.year });
            })
            try {
                if (chartTypeTeacher === 'yearly') {
                    console.log({ teachersList })
                    teachersList.forEach((teacher) => {
                        const teacherYear = classPrices.get(teacher.teachSclass.className).year;
                        let teacherPaid = teacher.salary;

                        if (myMap.has(teacherYear)) {
                            teacherPaid = myMap.get(teacherYear) + teacherPaid;
                        }

                        myMap.set(teacherYear, teacherPaid);
                    })

                    let years = [];
                    let profits = [];

                    myMap.forEach((profit, year) => {
                        years.push(year);
                        profits.push(profit);
                    });

                    setYearlyEarningTeacher(profits);
                    setYearsTeacher(years);

                    let totalEarnings = 0;
                    profits.forEach((p) => {
                        totalEarnings += p;
                    })
                    setTotalEarningTeacher(totalEarnings);
                }
                else if (chartTypeTeacher === 'monthly') {
                    let month;
                    console.log("********")
                    teachersList.forEach((teacher) => {
                        const teacherGetPaid = teacher.salary;
                        const teacherYear = classPrices.get(teacher.teachSclass.className).year;

                        console.log("IT is not entering here", { teacherYear, selectYearTeacher })
                        if (teacherYear === parseInt(selectYearTeacher, 10)) {
                            if (teacher.createdAt)
                                month = new Date(teacher.createdAt).getMonth();
                            else {
                                month = Math.floor(Math.random() * 9) + 1;
                                console.log({ month })
                            }



                            if (myMap.has(month)) {
                                const pricing = myMap.get(month) + teacherGetPaid;
                                myMap.set(month, pricing);
                            } else {
                                myMap.set(month, teacherGetPaid);
                            }
                        }

                    })

                    let profits = [];

                    monthName.forEach((month, index) => {
                        let profit = myMap.has(index) ? myMap.get(index) : 0;
                        profits.push(profit);
                    });

                    console.log("teacher earning", { monthName, profits });
                    setMonthlyEarningTeacher(profits)

                }
            } catch (e) {
                console.log(e)
            }
        }
        TeacherEarning()
    }, [sclassesList, teachersList, chartTypeTeacher, selectYearTeacher])

    useEffect(() => {
        if (chartTypeTeacherNet === 'yearly') {
            setChartType('yearly');
            setChartTypeTeacher('yearly');
        } else if (chartTypeTeacherNet === 'monthly') {
            setChartType('monthly');
            setChartTypeTeacher('monthly');
            setSelectYear(selectYearTeacherNet);
            setSelectYearTeacher(selectYearTeacherNet);
        }
    }, [sclassesList, teachersList, chartTypeTeacherNet, selectYearTeacherNet])

    useEffect(() => {

        if (chartTypeTeacherNet === 'yearly') {
            let ans = [];
            for (let i = 0; i < yearlyEarning.length; i++) {
                ans.push(yearlyEarning[i] - yearlyEarningTeacher[i]);
            }
            console.log("nettt monthly earnings", { ans })
            setYearlyEarningTeacherNet(ans);
        }
        else if (chartTypeTeacherNet === 'monthly') {
            let ans = []
            let n = Math.max(monthlyEaring.length, monthlyEaringTeacher.length);
            for (let i = 0; i < n; i++) {

                ans.push(monthlyEaring[i] - monthlyEaringTeacher[i]);
            }
            console.log("nettt yearly earnings", { ans })
            setMonthlyEarningTeacherNet(ans);
        }


    }, [yearlyEarning, yearlyEarningTeacher, monthlyEaring, monthlyEaringTeacher])

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3} lg={3}>
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
                    <Grid item xs={12} md={3} lg={3}>
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
                    <Grid item xs={12} md={3} lg={3}>
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
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper sx={{
                            borderRadius: "40px",
                            overflow: "hidden"
                        }}>
                            <img src={Fees} alt="Fees" />
                            <Title>
                                Fees Collection
                            </Title>
                            <Data start={0} end={totalEarning} duration={2.5} prefix="$" />
                        </StyledPaper>
                    </Grid>

                    <Grid item xs={12} md={12} lg={6}>
                        <div>
                            <div>
                                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                                    <option value="yearly">Yearly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            {chartType === "yearly" ?
                                (<GenderDoughnutChart chartType={'bar'} labels={years} dataValues={yearlyEarning} backgroundColor={['#36A2EB', '#FF6384']} label={'Yearly earning from students'} />) :
                                (
                                    <div>
                                        <div>
                                            <select value={selectYear} onChange={(e) => setSelectYear(e.target.value)}>
                                                {years?.map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <GenderDoughnutChart chartType={'bar'} labels={monthName} dataValues={monthlyEaring} backgroundColor={['#36A2EB', '#FF6384']} label={'Monthly earning from students'} />
                                    </div>)
                            }
                        </div>

                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                        <div>
                            <div>
                                <select value={chartTypeTeacher} onChange={(e) => setChartTypeTeacher(e.target.value)}>
                                    <option value="yearly">Yearly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            {chartTypeTeacher === "yearly" ?
                                (<GenderDoughnutChart chartType={'bar'} labels={yearsTeacher} dataValues={yearlyEarningTeacher} backgroundColor={['#36A2EB', '#FF6384']} label={'Yearly expenditure from teacher'} />) :
                                (
                                    <div>
                                        <div>
                                            <select value={selectYearTeacher} onChange={(e) => setSelectYearTeacher(e.target.value)}>
                                                {yearsTeacher?.map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <GenderDoughnutChart chartType={'bar'} labels={monthName} dataValues={monthlyEaringTeacher} backgroundColor={['#36A2EB', '#FF6384']} label={'Monthly expenditure from teacher'} />
                                    </div>)
                            }
                        </div>

                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <div>
                            <div>
                                <select value={chartTypeTeacherNet} onChange={(e) => setChartTypeTeacherNet(e.target.value)}>
                                    <option value="yearly">Yearly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            {chartTypeTeacherNet === "yearly" ?
                                (<GenderDoughnutChart chartType={'bar'} labels={years} dataValues={yearlyEarningTeacherNet} backgroundColor={['#36A2EB', '#FF6384']} label={'Yearly Net Gain'} />) :
                                (
                                    <div>
                                        <div>
                                            <select value={selectYearTeacherNet} onChange={(e) => setSelectYearTeacherNet(e.target.value)}>
                                                {years?.map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <GenderDoughnutChart chartType={'bar'} labels={monthName} dataValues={monthlyEaringTeacherNet} backgroundColor={['#36A2EB', '#FF6384']} label={'Monthly Net Gain'} />
                                    </div>)
                            }
                        </div>

                    </Grid>
                </Grid>
            </Container>
        </>
    );
};


const StyledPaper = styled(Paper)`
background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
  padding: 16px;
   border-radius: 40px;
  overflow:hidden;
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

export default IncomeAnalytics