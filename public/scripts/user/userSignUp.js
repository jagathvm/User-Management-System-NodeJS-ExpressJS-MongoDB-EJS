const formSignUp = document.getElementById("formSignUp");

formSignUp.addEventListener("submit", async (e) => {
  const formData = new FormData(formSignUp);
  const data = Object.fromEntries(formData);

  try {
    const result = await fetch("/api/user/signup", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await result.json();

    if (response.ok) {
      console.log("Signup successful");
    } else {
      console.error("Signup Failed");
    }
  } catch (error) {
    console.error(`Error during signup: ${error}`);
  }
});
