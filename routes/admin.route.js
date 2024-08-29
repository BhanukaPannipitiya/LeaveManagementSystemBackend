import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getPendingLeaves, handleLeaveRequest } from "../controllers/admin.controller.js";
const router = express.Router();

router.get("/pending-requests", getPendingLeaves);
// router.post("/leave-history", getLeaveHistory);
router.post("/approve-request",handleLeaveRequest)


export default router;