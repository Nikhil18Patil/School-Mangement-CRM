import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material'
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate } from 'react-router-dom';
import { PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import axios from 'axios';

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
        console.log("class list from ", sclassesList);
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error)
    }

    const navigateHandler = async (classID) => {

        const subjects = await axios.get(`${process.env.REACT_APP_BASE_URL}/SubjectsWithNoTeacher`, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (situation === 'Subject') {
            navigate(`/Admin/addsubject/${classID}`)
        }
        else {


            if (Array.isArray(subjects.data)) {
                const filteredSubjects = subjects.data.filter((subject) => {
                    console.log(subject)
                    if (subject.className === classID && !subject.teacher) {
                        return true;
                    }
                    return false;
                });

                console.log({ filteredSubjects })

                if (filteredSubjects.length > 0) {
                    navigate('/Admin/teachers/addteacher/' + classID)
                } else {
                    navigate("/Admin/teachers/choosesubject/" + classID)
                }
            } else {
                navigate("/Admin/teachers/choosesubject/" + classID)
            }
        }
    }

    const sclassColumns = [
        { id: 'name', label: 'Class Name', minWidth: 170 },
    ]

    const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
        return {
            name: sclass.className,
            id: sclass._id,
        };
    })

    const SclassButtonHaver = ({ row }) => {
        return (
            <>
                <PurpleButton variant="contained"
                    onClick={() => navigateHandler(row.id)}>
                    Choose
                </PurpleButton>
            </>
        );
    };

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {getresponse ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <Button variant="contained" onClick={() => navigate("/Admin/addclass")}>
                                Add Class
                            </Button>
                        </Box>
                        :
                        <>
                            <Typography variant="h6" gutterBottom component="div">
                                Choose a classes
                            </Typography>
                            {Array.isArray(sclassesList) && sclassesList.length > 0 &&
                                <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
                            }
                        </>}
                </>
            }
        </>
    )
}

export default ChooseClass