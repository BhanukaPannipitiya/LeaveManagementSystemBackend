import { Leave } from "../models/leave.model.js";

export const requestLeave = async (req, res) => {
    const { leaveType, startDate, endDate, reason,userId } = req.body;
console.log("req.body",req.body)
    try {
        if (!leaveType || !startDate || !endDate || !reason || !userId) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newLeave = new Leave({
            leaveType,
            startDate,
            endDate,
            reason,
            userId,
        });

        await newLeave.save();

        res.status(200).json({ success: true, message: "Leave request submitted successfully" });
    } catch (error) {
        console.error("Error submitting leave request", error);
        res.status(500).json({ success: false, message: "An error occurred while submitting the leave request" });
    }
};

export const getLeaveHistory = async (req, res) => {
    const { userId } = req.body; // Destructure userId from req.body
    console.log("req.body", userId);
    
    try {
        // Find all leave records associated with the given userId
        const leaveHistory = await Leave.find({ userId }); 
        console.log("leave hist",leaveHistory)
        res.status(200).json({ success: true, leaveHistory });
    } catch (error) {
        console.error("Error retrieving leave history", error);
        res.status(500).json({ success: false, message: "An error occurred while retrieving leave history" });
    }
};

