const formSignIn = document.getElementById("formSignIn");

formSignIn.addEventListener("submit", async (e) => {
  const formData = new FormData(formSignIn);
  const data = Object.fromEntries(formData);
  await fetch("/api/admin/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
});
