const updateUserForm = document.getElementById("updateUserForm");

// Fetch data from updateUser Form
updateUserForm.addEventListener("submit", async (e) => {
  const formData = new FormData(updateUserForm);
  const data = Object.fromEntries(formData);

  // Get the user ID from a hidden input
  const userId = document.getElementById("userId").value;

  try {
    const result = await fetch(`/api/admin/dashboard/edit/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.ok) {
      window.location.href = `/api/admin/dashboard/view/${userId}`;
    }
  } catch (error) {
    console.error(error);
  }
});
