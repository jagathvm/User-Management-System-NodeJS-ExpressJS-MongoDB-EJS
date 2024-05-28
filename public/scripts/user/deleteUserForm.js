const deleteUserForm = document.getElementById("deleteUserForm");

deleteUserForm.addEventListener("submit", async (e) => {
  const userId = document.getElementById("userId").value;

  try {
    const result = await fetch(`/api/admin/dashboard/edit/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
});
