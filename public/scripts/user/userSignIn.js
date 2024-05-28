const formSignIn = document.getElementById("formSignIn");

formSignIn.addEventListener("submit", async (e) => {
  const formData = new FormData(formSignIn);
  const data = Object.fromEntries(formData);

  try {
    const result = await fetch("/api/user/", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const jsonResponse = await result.json();

    if (jsonResponse.ok) {
      console.log("User Signed In");
    } else {
      console.error("Failed to Sign In");
    }
  } catch (error) {
    console.log(error);
  }
});
