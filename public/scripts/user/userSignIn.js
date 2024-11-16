import { apiClient } from "../apiServices/httpRequest.js";
const formSignIn = document.getElementById("formSignIn");

formSignIn.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Extract data from the form
  const formData = new FormData(formSignIn);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (!data.username || !data.password) {
    alert("Username and password are required.");
    return;
  }

  try {
    const result = await apiClient.httpRequest("/user/", "POST", data);
    const redirectUrl =
      result.data === 1 ? "/api/admin/dashboard" : "/api/user/home";
    alert(result.message);

    // Reset form after successful submission
    formSignIn.reset();
    window.location.href = redirectUrl;
  } catch (error) {
    console.log("Sign-in error: ", error);
    alert("An error occurred during sign-in. Please try again later.");
    throw error;
  }
});
