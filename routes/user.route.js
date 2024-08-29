import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getLeaveHistory, requestLeave } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/request-leave", requestLeave);
router.post("/leave-history", getLeaveHistory);



export default router;