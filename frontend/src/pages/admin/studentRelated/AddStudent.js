import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress } from '@mui/material';
import axios from 'axios';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('')
    const [classNamer, setClassName] = useState('Select class')
    const [sclassName, setSclassName] = useState('')
    const [sclassListUpdate, setSclassListUpdate] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)
    const [feesPaid, setFeesPaid] = useState();
    const [gender, setGender] = useState("Male");
    const [contactNumber, setContactNumber] = useState();
    const [date, setDate] = useState();

    const adminID = currentUser._id
    const id = adminID;
    const role = "Student"
    const attendance = []

    const selectStyles = {
        width: '100%',
        padding: '10px',
        fontSize: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#c3b6b6',
        appearance: 'none',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease',
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SclassList/${id}`);
            setSclassListUpdate(result.data)
        }
        fetchData();
    }, [])

    useEffect(() => {
        setClassName(sclassListUpdate[0]?.className);
        setSclassName(sclassListUpdate[0]?._id);
    }, [sclassListUpdate])


    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);


    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            sclassListUpdate.forEach((data, index) => {
                if (data.className === event.target.value) {
                    setClassName(data.className);
                    setSclassName(data._id);
                }
            })


        }
    }

    const fields = { name, rollNum, password, className: sclassName, adminID, role, attendance, feesPaid, DOB: date, contactDetails: contactNumber, gender }

    const submitHandler = (event) => {
        event.preventDefault()
        if (sclassName === "") {
            setMessage("Please select a classname")
            setShowPopup(true)
        }
        else {
            setLoader(true)
            dispatch(registerUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Add Student</span>
                    <label>Name</label>
                    <input className="registerInput" type="text" placeholder="Enter student's name..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name" required />

                    <label>Gender</label>
                    <select
                        className="registerInput"
                        value={gender}
                        style={selectStyles}
                        onChange={(e) => { setGender(e.target.value) }} required>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                    </select>

                    <label>Contact Details</label>
                    <input className="registerInput" type="number" placeholder="Enter Contact Number"
                        value={contactNumber}
                        onChange={(event) => setContactNumber(event.target.value)}
                        autoComplete="contactDetails" required />

                    <label>D.O.B</label>
                    <input className="registerInput" type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        required />

                    <label>Class</label>
                    <select
                        className="registerInput"
                        value={classNamer}
                        style={selectStyles}
                        onChange={changeHandler} required>

                        {sclassListUpdate.map((data, index) => (
                            <option key={index} value={data.className}>
                                {data.className}
                            </option>
                        ))}

                    </select>


                    <label>Roll Number</label>
                    <input className="registerInput" type="number" placeholder="Enter student's Roll Number..."
                        value={rollNum}
                        onChange={(event) => setRollNum(event.target.value)}
                        required />

                    <label>Password</label>
                    <input className="registerInput" type="password" placeholder="Enter student's password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password" required />

                    <label>Fees Paid</label>
                    <input className="registerInput" type="number" placeholder="Enter fees paid"
                        value={feesPaid}
                        onChange={(event) => setFeesPaid(event.target.value)}
                        required />

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Add'
                        )}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddStudent