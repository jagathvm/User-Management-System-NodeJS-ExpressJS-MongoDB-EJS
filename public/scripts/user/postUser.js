import { apiClient } from "../apiServices/httpRequest.js";
import { handleRedirect } from "../helpers/handleRedirect.js";
const addUserForm = document.getElementById("addUserForm");

// Fetch data from addUser Form
addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Extract data from the form
  const formData = new FormData(addUserForm);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (
    !data.username ||
    !data.email ||
    !data.tel ||
    !data.password ||
    !data.role
  ) {
    alert("All fields are required.");
    return;
  }

  try {
    const result = await apiClient.httpRequest(
      "/admin/dashboard/postUser",
      "POST",
      data
    );
    console.log(result);
    alert(result.message);
    if (!result.success) return;

    handleRedirect(`/api/admin/dashboard/view/${result.data}`);
  } catch (error) {
    console.error(error);
  }
});

// Retain form values on page reload and update the URL
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  const searchInput = document.getElementById("searchUser");
  const sortDropdownButton = document.getElementById("sortDropdown");
  const sortDropdownItems = document.querySelectorAll(".sort-option");
  const filterRadios = document.querySelectorAll(".form-check-input");
  const clearFiltersButton = document.getElementById("clearFiltersButton");

  // Function to retain search input value
  const retainSearchInput = () => {
    if (searchInput) {
      const searchUserValue = urlParams.get("searchUser") || "";
      searchInput.value = searchUserValue;
    }
  };

  // Function to retain sort options
  const retainSortOptions = () => {
    const sortValue = urlParams.get("sort");
    if (sortValue) {
      const selectedSortOption = [...sortDropdownItems].find(
        (item) => item.dataset.sort === sortValue
      );
      if (selectedSortOption) {
        selectedSortOption.classList.add("active");
        sortDropdownButton.textContent = selectedSortOption.textContent.trim();
      }
    }
  };

  // Function to retain checked filters
  const retainCheckedFilters = () => {
    filterRadios.forEach((radio) => {
      radio.checked = urlParams.get(radio.name) === radio.value;
    });
  };

  // Function to build the URL
  const buildUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    const page = urlParams.get("page") || 1;

    // Add the page parameter first
    url.searchParams.set("page", page);

    // Add the sort parameter if it exists
    const selectedSortOption = [...sortDropdownItems].find((item) =>
      item.classList.contains("active")
    );
    if (selectedSortOption) {
      url.searchParams.set("sort", selectedSortOption.dataset.sort);
    }

    // Add the filters (role and status)
    filterRadios.forEach((radio) => {
      if (radio.checked) {
        url.searchParams.set(radio.name, radio.value);
      }
    });

    // Add the search term if it exists
    const searchTerm = searchInput?.value.trim();
    if (searchTerm) {
      url.searchParams.set("searchUser", searchTerm);
    }

    return url.href;
  };

  // Function to update the URL
  const updateUrl = (resetPage = false) => {
    if (resetPage) {
      urlParams.set("page", 1); // Reset page to 1 if necessary
    }
    const newUrl = buildUrl();
    window.history.replaceState({}, "", newUrl);
    window.location.reload();
  };

  // Event listener for sort options
  const setupSortOptions = () => {
    sortDropdownItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        // Mark the clicked item as active and remove active class from others
        sortDropdownItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        // Update the URL without resetting the page number
        updateUrl(false);
      });
    });
  };

  // Event listener for filters
  const setupFilterRadios = () => {
    filterRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        // Update the URL and reset the page number to 1
        updateUrl(true);
      });
    });
  };

  // Event listener for search input
  const setupSearchInput = () => {
    if (searchInput) {
      searchInput.addEventListener("blur", () => {
        // Update the URL and reset the page number to 1
        updateUrl(true);
      });
    }
  };

  // Initialize the UI and event listeners
  const init = () => {
    retainSearchInput();
    retainSortOptions();
    retainCheckedFilters();
    setupSortOptions();
    setupFilterRadios();
    setupSearchInput();
  };

  init(); // Run initialization

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
      // Clear the search input
      if (searchInput) {
        searchInput.value = "";
      }

      // Remove active class from sort options
      sortDropdownItems.forEach((item) => item.classList.remove("active"));

      // Uncheck all filter radio buttons
      filterRadios.forEach((radio) => {
        radio.checked = false;
      });

      // Clear URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("sort");
      url.searchParams.delete("role");
      url.searchParams.delete("status");
      url.searchParams.delete("searchUser");
      url.searchParams.set("page", 1); // Reset to page 1

      // Update the URL and reload the page
      window.history.replaceState({}, "", url.href);
      window.location.reload();
    });
  }
});
