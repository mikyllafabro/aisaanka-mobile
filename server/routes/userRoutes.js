const express = require('express');
const { getAllUsers, usersCount, banUser, activateUser } = require('../controllers/userController.js');

const router = express.Router();

// router.get('/allUsers', verifyAdmin, getAllUsers); 
// router.get('/usersCount', verifyAdmin, usersCount); 
router.get('/allUsers', getAllUsers); 
router.get('/usersCount', usersCount); 
router.delete("/ban/:id", banUser);
router.put("/activate/:id", activateUser);

// router.put("/:id/role", verifyAdmin, updateUserRole);

module.exports = router;
