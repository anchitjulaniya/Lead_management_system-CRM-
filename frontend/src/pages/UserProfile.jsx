import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {

  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (

    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex justify-center">

      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 md:p-8 animate-[fadeIn_0.4s]">

      

        <div className="flex flex-col items-center text-center mb-6">

          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold shadow">

            {initials}

          </div>

          <h2 className="mt-4 text-2xl font-semibold">
            {user.name}
          </h2>

          <span className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full capitalize">
            {user.role}
          </span>

        </div>


        <div className="space-y-4">

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{user.name}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Role</span>
            <span className="font-medium capitalize">
              {user.role}
            </span>
          </div>

        </div>


        <div className="mt-6 text-center text-gray-400 text-sm">
          Logged in user profile
        </div>

      </div>

    </div>

  );

}