const formSignUp = document.getElementById("formSignUp");

form.addEventListener("submit", async (e) => {
  const formData = new FormData(formSignUp);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch("/api/register", {
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
