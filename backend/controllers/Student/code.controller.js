const Code = require("../../models/Students/code.model"); // Import Code schema
const StudentDetail = require("../../models/Students/details.model"); // Import Student schema

const saveCode = async (req, res) => {
  try {
    const { enrollmentNo, code,programName } = req.body;

  

    // Save the code linked to the enrollment number
    const newCode = await Code.create({
      code,
      enrollmentNo,
      programName
    });

    return res.status(201).json({
      success: true,
      message: "Code saved successfully.",
      data: newCode,
    });
  } catch (error) {
    console.error("Error saving code:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while saving the code.",
    });
  }
};

const getCodesByEnrollment = async (req, res) => {
    try {
      const { enrollmentNo } = req.params;
  
      // Find the student by enrollment number
      // const student = await StudentDetail.findOne({ enrollmentNo });
      // if (!student) {
      //   return res.status(404).json({
      //     success: false,
      //     message: "Student not found with this enrollment number.",
      //   });
      // }
  
      // Fetch all codes for the student
      const codes = await Code.find({ enrollmentNo});
  
      return res.status(200).json({
        success: true,
        data: codes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the codes.",
      });
    }
  };
  

  
  module.exports = { saveCode, getCodesByEnrollment}