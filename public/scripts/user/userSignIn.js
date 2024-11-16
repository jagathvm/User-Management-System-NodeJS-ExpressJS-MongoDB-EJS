import { apiClient } from "../apiServices/httpRequest.js";
const formSignIn = document.getElementById("formSignIn");

formSignIn.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(formSignIn);
  const data = Object.fromEntries(formData);

  try {
    const result = await apiClient.httpRequest("/user/", "POST", data);
    const redirectUrl =
      result.data === 1 ? "/api/admin/dashboard" : "/api/user/home";

    alert(result.message);
    window.location.href = redirectUrl;
  } catch (error) {
    console.log("Sign-in error: ", error);
    alert("An error occurred during sign-in. Please try again later.");
    throw error;
  }
});
