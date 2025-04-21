const express = require("express");
const router = express.Router();
const { saveCode, getCodesByEnrollment } = require("../../controllers/Student/code.controller");

// Save a new code
router.post("/codes", saveCode);

// Get all codes for a student
router.get("/codes/:enrollmentNo", getCodesByEnrollment);

// Get a single code by uniqueCodeId
// router.get("/codes/:uniqueCodeId", getCodeByUniqueId);

module.exports = router;
