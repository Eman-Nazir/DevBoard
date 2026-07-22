import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); 
// All notification routes require authentication

router.get("/", getNotifications);               // GET  /notifications?page=1&limit=20
router.get("/unread-count", getUnreadCount);     // GET  /notifications/unread-count
router.patch("/read-all", markAllAsRead);        // PATCH /notifications/read-all
router.delete("/clear-read", clearReadNotifications); // DELETE /notifications/clear-read
router.patch("/:id/read", markAsRead);           // PATCH /notifications/:id/read
router.delete("/:id", deleteNotification);       // DELETE /notifications/:id

export default router;