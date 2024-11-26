import { apiClient } from "../apiServices/httpRequest.js";
import { handleRedirect } from "../helpers/handleRedirect.js";
const formSignIn = document.getElementById("formSignIn");

formSignIn.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Extract data from the form
  const formData = new FormData(formSignIn);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (!data.email || !data.password) {
    alert("Username and password are required.");
    return;
  }

  try {
    const result = await apiClient.httpRequest("/user/", "POST", data);
    alert(result.message);
    if (!result.success) return;

    // Reset form after successful submission
    formSignIn.reset();

    // Redirect to the appropriate page
    handleRedirect("/api/user/home");
  } catch (error) {
    console.log("Sign-in error: ", error);
    alert("An error occurred during sign-in. Please try again later.");
    throw error;
  }
});
