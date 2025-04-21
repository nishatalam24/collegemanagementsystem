const facultyDetails = require("../../models/Faculty/details.model.js")
const { exec } = require("child_process");
const getDetails = async (req, res) => {
    try {
        let user = await facultyDetails.find(req.body);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "No Faculty Found" });
        }
        const data = {
            success: true,
            message: "Faculty Details Found!",
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
//         let user = await facultyDetails.findOne({ employeeId: req.body.employeeId });
//         if (user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Faculty With This EmployeeId Already Exists",
//             });
//         }
//         user = await facultyDetails.create({ ...req.body, profile: req.file.filename });
//         const data = {
//             success: true,
//             message: "Faculty Details Added!",
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
      // Check if a faculty member with the given employeeId already exists
      let user = await facultyDetails.findOne({ employeeId: req.body.employeeId });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "Faculty with this Employee ID already exists.",
        });
      }
  
      // Prepare arguments for the C++ program
      const args = [
        "Faculty",
        `"${req.body.firstName}"`,
        `"${req.body.middleName}"`,
        `"${req.body.lastName}"`,
        `"${req.body.email}"`,
        `"${req.body.phoneNumber}"`,
        `"${req.body.gender}"`,
        `"${req.file?.filename || "default.jpg"}"`, // Profile filename (default if not provided)
        req.body.employeeId,
        `"${req.body.department}"`,
        req.body.experience,
        `"${req.body.post}"`,
      ].join(" ");
  
      // Execute the C++ program
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
          
          // Save the faculty details to MongoDB
          user = await facultyDetails.create(cppResult);
  
          res.status(201).json({
            success: true,
            message: "Faculty details added successfully!",
            user,
          });
        } catch (err) {
          console.error("Error parsing C++ output:", err);
          res.status(500).json({ success: false, message: "Failed to parse C++ output." });
        }
      });
    } catch (error) {
      console.error("Error adding faculty details:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  

const updateDetails = async (req, res) => {
    try {
        let user;
        if (req.file) {
            user = await facultyDetails.findByIdAndUpdate(req.params.id, { ...req.body, profile: req.file.filename });
        } else {
            user = await facultyDetails.findByIdAndUpdate(req.params.id, req.body);
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Faculty Found",
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
    try {
        let user = await facultyDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Faculty Found",
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
        let user = await facultyDetails.count(req.body);
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