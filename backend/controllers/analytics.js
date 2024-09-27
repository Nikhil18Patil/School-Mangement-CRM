const studentSchema = require('../models/studentSchema.js');
const teacherSchema = require('../models/teacherSchema.js');
const Sclass = require('../models/sclassSchema.js');


const girlsBoysCount = async (req, res) => {
    const maleStudents = await studentSchema.countDocuments({ gender: 'Male' });
    const girlStudents = await studentSchema.countDocuments({ gender: 'Female' });
    res.send([maleStudents, girlStudents])
}

const techerGenderCount = async (req, res) => {
    const maleTeachers = await teacherSchema.countDocuments({ gender: 'Male' });
    const femaleTeachers = await teacherSchema.countDocuments({ gender: 'Female' });
    res.send([maleTeachers, femaleTeachers])
}

const earningFromStudents = async (req, res) => {
    const division = req.params.time;
    const myMap = new Map();
    try {
        if (division === 'yearly') {
            const classes = await Sclass.find({ school: req.params.schoolId });
            classes.forEach((classer) => {
                let profit = classer.feesPaid * classer.students.length;
                if (myMap.has(classer.year)) {
                    profit += myMap.get(classer.year);
                }
                myMap.set(classer.year, profit);
            })

            let years = [];
            let profits = [];

            myMap.forEach((profit, year) => {
                years.push(year);
                profits.push(profit);
            });

            console.log('Years:', years);
            console.log('Profits:', profits);

            res.send({ years, profits })
        }
    } catch (e) {
        console.log(e)
    }
}


module.exports = { girlsBoysCount, techerGenderCount, earningFromStudents }