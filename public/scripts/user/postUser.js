import { apiClient } from "../apiServices/httpRequest.js";

const addUserForm = document.getElementById("addUserForm");

// Fetch data from addUser Form
addUserForm.addEventListener("submit", async (e) => {
  const formData = new FormData(addUserForm);
  const data = Object.fromEntries(formData);

  try {
    const result = await apiClient.httpRequest(
      "/admin/dashboard/postUser",
      "POST",
      data
    );

    if (!result.success) {
      alert(result.message);
    }
    alert(result.message);
    window.location.href = `/api/admin/dashboard/view/${result.data}`;
  } catch (error) {
    console.error(error);
  }
});
