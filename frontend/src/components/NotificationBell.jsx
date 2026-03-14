import { useEffect, useState } from "react";
import API from "../api/axios";
import connectSocket from "../socket/socket";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import notificationSound from "../assets/notification.mp3";

dayjs.extend(relativeTime);

export default function NotificationBell() {

  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );

    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data.data);
  };

  const handleBellClick = () => {
    setShow(!show);

    if (!show) {
      notifications.forEach((n) => {
        if (!n.read) markAsRead(n._id);
      });
    }
  };

  useEffect(() => {

    const token = sessionStorage.getItem("token");
    const socket = connectSocket(token);

    socket.connect();

    fetchNotifications();

    const audio = new Audio(notificationSound);

    socket.on("notification", (notification) => {

      console.log("New notification:", notification);

      setNotifications((prev) => [
        notification,
        ...prev
      ]);

      audio.play();

    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };

  }, []);

  return (
    <div className="relative z-10">

      <button
        onClick={handleBellClick}
        className="text-xl cursor-pointer relative"
      >
        🔔

        {unreadCount > 0 && (
          <div className="bg-red-500 text-[12px] h-4.5 w-4.5 flex items-center justify-center text-white rounded-full font-semibold absolute -top-0.5 -right-1">
            {unreadCount}
          </div>
        )}

      </button>

      {show && (

        <div className="absolute right-0 mt-2 w-56 sm:w-72 bg-white shadow rounded p-3 overflow-y-scroll max-h-[75vh]">

          <h3 className="font-semibold mb-2">Notifications</h3>

          {notifications.length === 0 && (
            <p className="text-sm text-gray-500">No notifications</p>
          )}

          {notifications.map((n) => (

            <div
              key={n._id}
              onClick={() => markAsRead(n._id)}
              className={`p-2 border-b text-sm cursor-pointer hover:bg-gray-50 ${
                n.read ? "" : "bg-gray-100"
              }`}
            >
              {n.message}

              <p className="text-xs text-gray-500 mt-1">
                {dayjs(n.createdAt).fromNow()}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}