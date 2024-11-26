import { apiClient } from "../apiServices/httpRequest.js";
import { handleRedirect } from "../helpers/handleRedirect.js";
const addUserForm = document.getElementById("addUserForm");

// Fetch data from addUser Form
addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Extract data from the form
  const formData = new FormData(addUserForm);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (
    !data.username ||
    !data.email ||
    !data.tel ||
    !data.password ||
    !data.role
  ) {
    alert("All fields are required.");
    return;
  }

  try {
    const result = await apiClient.httpRequest(
      "/admin/dashboard/postUser",
      "POST",
      data
    );
    alert(result.message);
    if (!result.success) return;

    handleRedirect(`/api/admin/dashboard/view/${result.data}`);
  } catch (error) {
    console.error(error);
  }
});
