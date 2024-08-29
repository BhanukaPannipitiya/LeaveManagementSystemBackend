import { Leave } from "../models/leave.model.js";

// Get all pending leave requests
export const getPendingLeaves = async (req, res) => {
    try {
        // Find all leaves with status 'pending'
        // console.log('at the get pending leaves')
        const pendingLeaves = await Leave.find({ status: 'Pending' });
        // console.log("first pending leaves",pendingLeaves)
        
        if (pendingLeaves.length === 0) {
            return res.status(200).json({ success: true, message: "No pending leave requests", pendingLeaves: [] });
        }

        res.status(200).json({ success: true, pendingLeaves });
    } catch (error) {
        console.error("Error retrieving pending leave requests", error);
        res.status(500).json({ success: false, message: "An error occurred while retrieving pending leave requests" });
    }
};

// Approve or reject a leave request
export const handleLeaveRequest = async (req, res) => {
    const { leaveId, action } = req.body;
    console.log("leave id",leaveId)
    console.log("action type",action)
    try {
        const leaveRequest = await Leave.findById(leaveId);
        console.log("leave request data",leaveRequest)

        if (!leaveRequest) {
            return res.status(404).json({ success: false, message: "Leave request not found" });
        }

        // Ensure the action is either 'approve' or 'reject'
        if (action !== 'approve' && action !== 'reject') {
            return res.status(400).json({ success: false, message: "Invalid action. Must be 'approve' or 'reject'" });
        }

        // Update the status based on the action
        leaveRequest.status = action === 'approve' ? 'Approved' : 'Rejected';
        await leaveRequest.save();

        res.status(200).json({ success: true, message: `Leave request ${action}d successfully` });
    } catch (error) {
        console.error(`Error handling leave request with action ${action}`, error);
        res.status(500).json({ success: false, message: `An error occurred while processing the leave request` });
    }
};