const http = require('http');
const express = require('express')
const cors = require('cors');
const fs = require('fs')

const app = express()
app.use(cors());

//this line is required to parse the request body
app.use(express.json())

/* Create - POST method */
app.post('/employee/add', (req, res) => {
    //get the existing employee data
    const existEmployees = getEmployeeData()

    //get the new employee data from post request
    const employeeData = req.body

    //check if the employeeData fields are missing
    if (employeeData.firstName == null || employeeData.lastName == null || employeeData.id == null || employeeData.email == null) {
        return res.status(401).send({error: true, msg: 'Data missing'})
    }

    //check if the employeeName exist already
    const findExist = existEmployees.find( employee => employee.id === employeeData.id)
    if (findExist) {
        return res.status(409).send({error: true, msg: 'Employee already exist.'})
    }

    //append the employee data
    existEmployees.push(employeeData)

    //save the new employee data
    saveEmployeeData(existEmployees);
    res.send({success: true, msg: 'Employee added successfully.'})

})

/* Read - GET method */
app.get('/employee/list', (req, res) => {
    const employees = getEmployeeData()
    res.send(employees)
})

/* Update - Patch method */
app.patch('/employee/update/:id', (req, res) => {
    //get the employee id from url
    const id = req.params.id

    //get the update data
    const employeeData = req.body

    //get the existing employee data
    const existEmployees = getEmployeeData()

    //check if the id exist or not
    const findExist = existEmployees.find( employee => employee.id === id )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'Employee does not exist.'})
    }

    //filter the employee data
    const updateEmployee = existEmployees.filter( employee => employee.id !== id )

    //push the updated data
    updateEmployee.push(employeeData)

    //finally save it
    saveEmployeeData(updateEmployee)

    res.send({success: true, msg: 'Employee data updated successfully.'})
})

/* Delete - Delete method */
app.delete('/employee/delete/:id', (req, res) => {
    const id = req.params.id

    //get the existing employee data
    const existEmployees = getEmployeeData()

    //filter the employee data to remove it
    const filterEmployee = existEmployees.filter( employee => employee.id !== id )

    if ( existEmployees.length === filterEmployee.length ) {
        return res.status(409).send({error: true, msg: 'Employee does not exist.'})
    }

    //save the filtered data
    saveEmployeeData(filterEmployee)

    res.send({success: true, msg: 'Employee removed successfully.'})

})


/* util functions */

//read the employee data from json file
const saveEmployeeData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('employees.json', stringifyData)
}

//get the employee data from json file
const getEmployeeData = () => {
    const jsonData = fs.readFileSync('employees.json')
    return JSON.parse(jsonData)
}

/* util functions ends */

const port = process.env.PORT ? process.env.PORT : 3000;
const server = http.createServer(app);

//configure the server port
server.listen(port, () => {
    console.log("listening on port " + port);
});

