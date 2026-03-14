import { useEffect, useState } from "react";
import API from "../api/axios";
import connectSocket from "../socket/socket";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const token = sessionStorage.getItem("token");
const socket = connectSocket(token);

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const markAsRead = async (id) => {
    try {
      const res = await API.patch(`/notifications/${id}/read`);
      
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification read", err);

    }
  };

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");

    setNotifications(res.data.data);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = () => {
    setShow(!show);

    if (!show) {
      notifications.forEach((n) => {
        if (!n.read) {
          markAsRead(n._id);
        }
      });
    }
  };
  useEffect(() => {
    
    socket.connect();

    fetchNotifications();

    socket.on("notification", (notification) => {

    setNotifications(prev => [
      notification,
      ...prev
    ]);

    // setUnread(prev => prev + 1);

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
        🔔{" "}
        {unreadCount > 0 && (
          <div className="bg-red-500 text-[12px] h-[18px] w-[18px] flex items-center justify-center text-white rounded-full font-semibold absolute top-[-2px] right-[-4px]">
            {unreadCount}
          </div>
        )}
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-56 sm:w-72 bg-white shadow rounded p-3 overflow-y-scroll h-fit max-h-[75vh]">
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
