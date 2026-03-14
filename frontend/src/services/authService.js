import API from "../api/axios";

export const registerUser = async (data) => {

  const res = await API.post("/auth/register", data);

  return res.data;

};