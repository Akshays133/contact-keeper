const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});


// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post('/', [ auth, [
    check('name', 'Name is required').not().isEmpty()
]] , async (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
    
    const { name, email, type, phone } = req.body; 
    try {
        const newContact = new Contact({
            type,
            name,
            user: req.user.id,
            email,
            phone
        });

        const contact = await newContact.save();

        res.json(contact);
 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, email, type, phone } = req.body; 

    // build ContactFields
    const contactFields = {};
    if(name) contactFields.name = name; 
    if(email) contactFields.email = email; 
    if(phone) contactFields.phone= phone; 
    if(type) contactFields.type = type; 

    try {
        let contact = Contact.findById(req.params.id);

        if(!contact) res.status(404).json({ msg: 'Not found' });

        if(contact.user.toString() !== req.user.id) {
            res.status(401).json({ msg: 'Nor authorized' });
        }

        contact = Contact.findByIdAndUpdate(req.params.id, { $set: contactFields }, { new: true });

        res.json(contact);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/contacts/:id
// @desc    Delete contacts
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let contact = Contact.findById(req.params.id);

        if(!contact) res.status(404).json({ msg: 'Not found' });

        // Make sure owns contacts
        if(contact.user.toString() !== req.user.id) {
            res.status(401).json({ msg: 'Nor authorized' });
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Contact removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;