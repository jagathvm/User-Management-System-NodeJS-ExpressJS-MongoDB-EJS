const addUserForm = document.getElementById("addUserForm");

// Fetch data from addUser Form
addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addUserForm);
  const data = Object.fromEntries(formData);

  try {
    const result = await fetch("/api/admin/dashboard/postUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.ok) {
      window.location.href = "/api/admin/dashboard";
    }
  } catch (error) {
    console.error(error);
  }
});
