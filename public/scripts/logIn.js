const formSignIn = document.getElementById("formSignIn");
form.addEventListener("submit", async (e) => {
  const formData = new FormData(formSignIn);
  const data = Object.fromEntries(formData);
  await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
});
