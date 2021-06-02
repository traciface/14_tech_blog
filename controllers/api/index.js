const router = require('express').Router();

const userRoutes = require('./userroutes.js');
const postRoutes = require('./postroutes.js');
const commentRoutes = require('./commentroutes.js');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;