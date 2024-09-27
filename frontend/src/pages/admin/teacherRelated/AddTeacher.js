import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress, Select } from '@mui/material';
import axios from 'axios';

const AddTeacher = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subjectID = params.id

  const [subjects, setSubject] = useState([]);
  const { status, response, error } = useSelector(state => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salary, setSalary] = useState();
  const [gender, setGender] = useState();
  const [dob, setDob] = useState();
  const [contactNo, setContactNo] = useState();
  const [subjectOption, setSubjectOption] = useState();

  const [teachSubject, setTeachSubject] = useState(null);
  const [school, setSchool] = useState(null);
  const [teachSclass, setTeachSclass] = useState(null)

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    const fetchData = async () => {
      const subjects = await axios.get(`${process.env.REACT_APP_BASE_URL}/SubjectsWithNoTeacher`, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log({ ans: subjects.data, subjectID })
      if (Array.isArray(subjects.data)) {
        const filteredSubjects = subjects.data.filter((subject) => {
          console.log(subject)
          if (subject.className === subjectID && !subject.teacher) {
            return true;
          }
          return false;
        });

        console.log({ filteredSubjects })

        if (filteredSubjects.length > 0) {
          setSubject(filteredSubjects);
          setSubjectOption(filteredSubjects[0].subName)
          setSchool(filteredSubjects[0].school);
          setTeachSclass(filteredSubjects[0]?.className ?? null);
          setTeachSubject(filteredSubjects[0]?._id ?? null)
        } else {
          console.log("there is some error go back");
        }
      } else {
        console.log("there is some error go back");
      }
    }
    fetchData();
  }, [dispatch, subjectID]);



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

  const role = "Teacher"
  const fields = { name, email, password, contactNo, role, school, teachSubject, teachSclass, salary, gender, dob, subjectOption }

  const submitHandler = (event) => {
    console.log({ teachSubject, teachSclass })
    event.preventDefault()
    setLoader(true)
    dispatch(registerUser(fields, role))
  }

  useEffect(() => {

    console.log("it is on add teacher page")
    if (status === 'added') {
      dispatch(underControl())
      navigate("/Admin/teachers")
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
    <div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Teacher</span>
          <br />
          <label htmlFor="options">Select an subject</label>
          <select id="options" style={selectStyles} value={subjectOption} onChange={(event) => {
            const targetValue = JSON.parse(event.target.value);
            console.log({ ans: targetValue })

            setSubjectOption(targetValue.subName);
            setSchool(targetValue.school);
            setTeachSclass(targetValue?.className ?? null);
            setTeachSubject(targetValue?._id ?? null)
          }}>
            {subjects.map((subject, index) => {
              console.log({ subject })
              return (<option key={index} value={JSON.stringify(subject)
              }>
                {subject.subName
                }
              </option>)
            })}
          </select>
          <label>
            Class : {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
          </label>
          <label>Name</label>
          <input className="registerInput" type="text" placeholder="Enter teacher's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name" required />

          <label>Email</label>
          <input className="registerInput" type="email" placeholder="Enter teacher's email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email" required />

          <label>Password</label>
          <input className="registerInput" type="password" placeholder="Enter teacher's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password" required />

          <label>Contact-no:</label>
          <input className="registerInput" type="text" placeholder="Enter Contact no"
            value={contactNo}
            onChange={(event) => setContactNo(event.target.value)}
            required />

          <label>Salary</label>
          <input className="registerInput" type="number" placeholder="Enter Salary allocated"
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
            required />

          <label>D.O.B</label>
          <input className="registerInput" type="date"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            required />

          <label>Gender</label>
          <select value={gender} style={selectStyles} onChange={(event) => { setGender(event.target.value) }} >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div >
  )
}

export default AddTeacher