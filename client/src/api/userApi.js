import API from "./api";

// =========================
// Get All Users (Admin)
// =========================
export const getUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

// =========================
// Delete User (Admin)
// =========================
export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};