import { apiClient } from "../apiServices/httpRequest.js";
import { handleRedirect } from "../helpers/handleRedirect.js";

const updateUserForm = document.getElementById("updateUserForm");
const deleteUserForm = document.getElementById("deleteUserForm");
const username = document.getElementById("username").value;

// Fetch data from updateUser Form
updateUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Extract data from the form
  const formData = new FormData(updateUserForm);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (!data.username || !data.email || !data.tel || !data.role) {
    alert("All fields are required.");
    return;
  }

  try {
    const result = await apiClient.httpRequest(
      `/admin/dashboard/view/update/${username}`,
      "PUT",
      data
    );
    alert(result.message);
    if (!result.success) return;

    handleRedirect(`/api/admin/dashboard/view/${username}`);
  } catch (error) {
    console.error("Error in updating user:", error);
    alert("An error occurred during user update. Please try again later.");
    throw error;
  }
});

// Delete user data when submit event is triggered
deleteUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const result = await apiClient.httpRequest(
      `/admin/dashboard/view/delete/${username}`,
      "DELETE"
    );
    alert(result.message);
    if (!result.success) return;

    handleRedirect("/api/admin/dashboard");
  } catch (error) {
    console.error("Error in deleting user:", error);
    alert("An error occurred during user deletion. Please try again later.");
    throw error;
  }
});
