'use strict';

const router = require('express').Router();
const Unit = require('../models/unit.model');

router.get('/', (req, res, next) => {
  Unit.find({}, (err, units) => {
    if (err) return next(err);
    res.json(units);
  });
});

router.get('/:id', (req, res, next) => {
  Unit.findById(req.params.id, (err, unit) => {
    if (err) return next(err);
    res.json(unit);
  })
    .populate('supervisors', '-hash')
    .populate('technicians', '-hash');
});

module.exports = router;
