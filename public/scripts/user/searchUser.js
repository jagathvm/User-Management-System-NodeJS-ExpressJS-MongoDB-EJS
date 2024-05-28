// const search = document.getElementById("search");

// search.addEventListener("submit", async (e) => {
//   // e.preventDefault();
//   const data = Object.fromEntries(new FormData(search));

//   try {
//     const result = await fetch("/searchUser", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (result.ok) {
//       const jsonResponse = await result.json();
//       console.log(jsonResponse);
//     } else {
//       console.error(`Error: ${result.statusText}`);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });
