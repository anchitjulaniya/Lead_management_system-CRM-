import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      
      <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">
        404
      </h1>

      <div className="bg-blue-500 px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>

      <p className="mt-8 text-lg text-gray-600 text-center max-w-md">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
  
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium shadow-md hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </Link>

    </div>
  );
}