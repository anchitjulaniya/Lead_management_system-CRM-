export default function validateRegister(form) {

  const { name, email, password, confirmPassword } = form;

  if (!name || !email || !password || !confirmPassword) {
    return "All fields are required";
  }

  if (name.length < 2) {
    return "Name must be at least 2 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;

}