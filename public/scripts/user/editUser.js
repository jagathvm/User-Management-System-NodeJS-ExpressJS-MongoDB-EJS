const updateUserForm = document.getElementById("updateUserForm");
const deleteUserForm = document.getElementById("deleteUserForm");
const username = document.getElementById("username").value;

// Fetch data from updateUser Form
updateUserForm.addEventListener("submit", async (e) => {
  const formData = new FormData(updateUserForm);
  const data = Object.fromEntries(formData);

  try {
    const result = await fetch(`/api/admin/dashboard/view/update/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();

    if (!response.success) {
      alert(response.message);
    }
    alert(response.message);

    window.location.href = `/api/admin/dashboard/view/${response.data}`;
  } catch (error) {
    console.error(error);
  }
});

// Delete user data when submit event is triggered
deleteUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const result = await fetch(`/api/admin/dashboard/view/delete/${username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();

    if (!response.success) {
      alert(response.message);
    }
    alert(response.message);

    window.location.href = "/api/admin/dashboard";
  } catch (error) {
    console.error(error);
  }
});
