const express = require('express')
const fs = require('fs')

const app = express()

//this line is required to parse the request body
app.use(express.json())

/* Create - POST method */
app.post('/contact/add', (req, res) => {
    //get the existing contact data
    const existContacts = getContactData()

    //get the new contact data from post request
    const contactData = req.body

    //check if the contactData fields are missing
    if (contactData.firstName == null || contactData.lastName == null || contactData.mobile == null || contactData.email == null) {
        return res.status(401).send({error: true, msg: 'Data missing'})
    }

    //check if the contactName exist already
    const findExist = existContacts.find( contact => contact.mobile === contactData.mobile)
    if (findExist) {
        return res.status(409).send({error: true, msg: 'Contact already exist'})
    }

    //append the contact data
    existContacts.push(contactData)

    //save the new contact data
    saveContactData(existContacts);
    res.send({success: true, msg: 'Contact added successfully'})

})

/* Read - GET method */
app.get('/contact/list', (req, res) => {
    const contacts = getContactData()
    res.send(contacts)
})

/* Update - Patch method */
app.patch('/contact/update/:mobile', (req, res) => {
    //get the contactname from url
    const mobile = req.params.mobile

    //get the update data
    const contactData = req.body

    //get the existing contact data
    const existContacts = getContactData()

    //check if the mobile exist or not
    const findExist = existContacts.find( contact => contact.mobile === mobile )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'contactname not exist'})
    }

    //filter the contact data
    const updateContact = existContacts.filter( contact => contact.mobile !== mobile )

    //push the updated data
    updateContact.push(contactData)

    //finally save it
    saveContactData(updateContact)

    res.send({success: true, msg: 'Contact data updated successfully'})
})

/* Delete - Delete method */
app.delete('/contact/delete/:mobile', (req, res) => {
    const mobile = req.params.mobile

    //get the existing contact data
    const existContacts = getContactData()

    //filter the contact data to remove it
    const filterContact = existContacts.filter( contact => contact.mobile !== mobile )

    if ( existContacts.length === filterContact.length ) {
        return res.status(409).send({error: true, msg: 'Contact does not exist'})
    }

    //save the filtered data
    saveContactData(filterContact)

    res.send({success: true, msg: 'Contact removed successfully'})

})


/* util functions */

//read the contact data from json file
const saveContactData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('contacts.json', stringifyData)
}

//get the contact data from json file
const getContactData = () => {
    const jsonData = fs.readFileSync('contacts.json')
    return JSON.parse(jsonData)
}

/* util functions ends */


//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})
