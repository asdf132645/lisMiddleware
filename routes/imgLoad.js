const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]);
});

module.exports = router;
