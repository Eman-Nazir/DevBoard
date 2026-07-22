import { Notification } from "../models/Notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Get notifications for current user 
const getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [notifications, totalCount, unreadCount] = await Promise.all([
    Notification.find({ recipient: req.user._id })
      .populate("actor", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ recipient: req.user._id }),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
      },
    }, "Notifications fetched successfully")
  );
});

// ─── Get unread count only 
const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  return res.status(200).json(
    new ApiResponse(200, { unreadCount }, "Unread count fetched")
  );
});

// ─── Mark single notification as read 
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  ).lean();

  if (!notification) throw new ApiError(404, "Notification not found");

  return res.status(200).json(
    new ApiResponse(200, { notification }, "Marked as read")
  );
});

// ─── Mark all notifications as read 
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  return res.status(200).json(
    new ApiResponse(200, {}, "All notifications marked as read")
  );
});

// ─── Delete a notification 
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) throw new ApiError(404, "Notification not found");

  return res.status(200).json(
    new ApiResponse(200, {}, "Notification deleted")
  );
});

// ─── Delete all read notifications
const clearReadNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({
    recipient: req.user._id,
    isRead: true,
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Read notifications cleared")
  );
});

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
};