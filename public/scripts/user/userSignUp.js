import { apiClient } from "../apiServices/httpRequest.js";
import { handleRedirect } from "../helpers/handleRedirect.js";
const formSignUp = document.getElementById("formSignUp");

formSignUp.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Extract data from the form
  const formData = new FormData(formSignUp);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (
    !data.username ||
    !data.email ||
    !data.password ||
    !data.passwordConfirm
  ) {
    alert("All fields are required.");
    return;
  }

  if (data.password !== data.passwordConfirm) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const result = await apiClient.httpRequest("/user/signup", "POST", data);
    alert(result.message);
    if (!result.success) return;

    // Reset form after successful submission
    formSignUp.reset();

    // Redirect to the appropriate page
    handleRedirect("/api/user/home");
  } catch (error) {
    console.error(`Error during signup: ${error}`);
    alert("An error occurred during signup. Please try again.");
  }
});
