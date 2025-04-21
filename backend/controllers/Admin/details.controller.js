const adminDetails = require("../../models/Admin/details.model.js")
const { exec } = require("child_process");
// require("../../C++handlers/cms")

const getDetails = async (req, res) => {
    try {
        let user = await adminDetails.find(req.body);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "No Admin Found" });
        }
        const data = {
            success: true,
            message: "Admin Details Found!",
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
//         let user = await adminDetails.findOne({ employeeId: req.body.employeeId });
//         if (user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Admin With This EmployeeId Already Exists",
//             });
//         }
//         user = await adminDetails.create({ ...req.body, profile: req.file.filename });
//         const data = {
//             success: true,
//             message: "Admin Details Added!",
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
        // Check if Admin already exists
        let user = await adminDetails.findOne({ employeeId: req.body.employeeId });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Admin With This EmployeeId Already Exists",
            });
        }

        // Prepare arguments for the C++ program
        const args = [
            "Admin",
            `"${req.body.firstName}"`,
            `"${req.body.middleName}"`,
            `"${req.body.lastName}"`,
            `"${req.body.email}"`,
            `"${req.body.phoneNumber}"`,
            `"${req.body.gender}"`,
            `"${req.file.filename}"`, // Profile filename
            req.body.employeeId,
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
                const cppResult = JSON.parse(stdout); // Parse only JSON from stdout
                res.status(200).json({ success: true, data: cppResult });
            } catch (err) {
                console.error("Error parsing C++ output:", err);
                res.status(500).json({ success: false, message: "Failed to parse C++ output." });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateDetails = async (req, res) => {
    try {
        let user;
        if (req.file) {
            user = await adminDetails.findByIdAndUpdate(req.params.id, { ...req.body, profile: req.file.filename });
        } else {
            user = await adminDetails.findByIdAndUpdate(req.params.id, req.body);
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Admin Found",
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
        let user = await adminDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Admin Found",
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