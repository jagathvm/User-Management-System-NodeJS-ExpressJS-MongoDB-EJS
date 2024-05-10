const formSignIn = document.getElementById("formSignIn");
const formSignUp = document.getElementById("formSignUp");

formSignIn.addEventListener("submit", async (e) => {
  const formData = new FormData(formSignIn);
  const data = Object.fromEntries(formData);
  await fetch("/api/user/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
});

formSignUp.addEventListener("submit", async (e) => {
  const formData = new FormData(formSignUp);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Signup successful");
    } else {
      console.error("Signup Failed");
    }
  } catch (error) {
    console.error(`Error during signup: ${error}`);
  }
});
