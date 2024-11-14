const addUserForm = document.getElementById("addUserForm");

// Fetch data from addUser Form
addUserForm.addEventListener("submit", async (e) => {
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

    const response = await result.json();

    if (!response.success) {
      alert(response.message);
    }

    window.location.href = `/api/admin/dashboard/view/${response.data}`;
  } catch (error) {
    console.error(error);
  }
});
