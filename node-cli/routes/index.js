const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('ok');
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router; 