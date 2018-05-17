'use strict';

const router = require('express').Router();
const auth = require('../auth');
const Ticket = require('../models/ticket.model');

router.post('/', (req, res, next) => {
    const data = req.body;
    if (!data.subject || !data.createdForName || !data.createdForEmail || !data.unit) {
        return res.status(400).json({message: "Missing required field(s)."});
    }
    const ticket = {
        createdBy: {
            _id: req.user._id
        },
        createdForName: data.createdForName,
        createdForEmail: data.createdForEmail,
        subject: data.subject,
        details: data.details,
        unit: {
            _id: data.unit // The unit in the request should just be the id.
        }
    }
    new Ticket(ticket).save((err, ticket) => {
        if (err) {
            return res.status(500).json({message: "Mongo error"});
        }
        res.send(ticket);
    });
});

module.exports = router;
