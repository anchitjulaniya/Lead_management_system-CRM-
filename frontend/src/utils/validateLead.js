export default function validateLead(form, canAssign) {

  if (!form.name.trim()) {
    return "Name is required";
  }

  if (form.name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(form.phone)) {
    return "Enter valid 10 digit phone number";
  }

  if (form.email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      return "Invalid email format";
    }

  }

  if (canAssign && !form.assignedTo) {
    return "Select sales user";
  }

  return null;

}