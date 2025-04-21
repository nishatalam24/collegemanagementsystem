const studentDetails = require("../../models/Students/details.model.js")
const { exec } = require("child_process");
// const cpphandler =require("../../C++handlers/")

const getDetails = async (req, res) => {
    try {
        let user = await studentDetails.find(req.body);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "No Student Found" });
        }
        const data = {
            success: true,
            message: "Student Details Found!",
            user,
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// const addDetails = async (req, res) => {
//     try {
//         let user = await studentDetails.findOne({
//             enrollmentNo: req.body.enrollmentNo,
//         });
//         if (user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Student With This Enrollment Already Exists",
//             });
//         }
//         user = await studentDetails.create({ ...req.body, profile: req.file.filename });
//         const data = {
//             success: true,
//             message: "Student Details Added!",
//             user,
//         };
//         res.json(data);
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// }


const addDetails = async (req, res) => {
    try {
      // Check if a student with the given enrollmentNo already exists
      let user = await studentDetails.findOne({ enrollmentNo: req.body.enrollmentNo });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "Student with this Enrollment Number already exists.",
        });
      }
  
      // Prepare arguments for the C++ program
      const args = [
        "Student",
        `"${req.body.firstName}"`,
        `"${req.body.middleName}"`,
        `"${req.body.lastName}"`,
        `"${req.body.email}"`,
        `"${req.body.phoneNumber}"`,
        `"${req.body.gender}"`,
        `"${req.file?.filename || "default.jpg"}"`, // Profile filename (default if not provided)
        req.body.enrollmentNo,
        req.body.semester,
        `"${req.body.branch}"`,
      ].join(" ");
  
      
      // Execute the C++ program
      // exec(`/Users/nishatalam/Desktop/First_sem_assignments/CPP/college_management_master/backend/c++handlers/cms ${args}`, async (error, stdout, stderr) => {
      exec(`/Users/nishatalam/Desktop/First_sem_assignments/CPP/college_management_master/backend/c++handlers/cms ${args}`, async (error, stdout, stderr) => {
        if (error) {
          console.error("C++ Error:", stderr || error.message);
          return res.status(500).json({ message: "C++ program error." });
        }
  
        // Log debug information from stderr (optional)
        if (stderr) {
          console.error("C++ Debug Info:", stderr);
        }
  
        try {
          const cppResult = JSON.parse(stdout); // Parse JSON output from C++
          
          // Save the student details to MongoDB
          user = await studentDetails.create(cppResult);
  
          res.status(201).json({
            success: true,
            message: "Student details added successfully!",
            user,
          });
        } catch (err) {
          console.error("Error parsing C++ output:", err);
          res.status(500).json({ success: false, message: "Failed to parse C++ output." });
        }
      });
    } catch (error) {
      console.error("Error adding student details:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

const updateDetails = async (req, res) => {
    try {
        let user;
        if (req.file) {
            user = await studentDetails.findByIdAndUpdate(req.params.id, { ...req.body, profile: req.file.filename });
        } else {
            user = await studentDetails.findByIdAndUpdate(req.params.id, req.body);
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Student Found",
            });
        }
        const data = {
            success: true,
            message: "Updated Successfull!",
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteDetails = async (req, res) => {
    let { id } = req.body;
    try {
        let user = await studentDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Student Found",
            });
        }
        const data = {
            success: true,
            message: "Deleted Successfull!",
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getCount = async (req, res) => {
    try {
        let user = await studentDetails.count(req.body);
        const data = {
            success: true,
            message: "Count Successfull!",
            user,
        };
        res.json(data);
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Internal Server Error", error });
    }
}

module.exports = { getDetails, addDetails, updateDetails, deleteDetails, getCount }