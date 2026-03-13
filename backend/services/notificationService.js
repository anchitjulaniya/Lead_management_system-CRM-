const Notification = require("../models/Notification");
const socketService = require("./socketService");

exports.createNotification = async (userId, message) => {

  const notification = await Notification.create({
    userId,
    message
  });

  socketService.sendNotification(userId, notification);

};