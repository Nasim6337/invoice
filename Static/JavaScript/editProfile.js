document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/user/profile", {
      credentials: "include", // in case cookies/session are used
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          const user = data.user;
          document.getElementById("editName").value = user.name || "";
          document.getElementById("editEmail").value = user.email || "";
          document.getElementById("editPhone").value = user.phone || "";
          document.getElementById("editAddress").value = user.address || "";
        } else {
          alert("Failed to load user data.");
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  });
  
  document.getElementById("editProfileForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const updatedData = {
      name: document.getElementById("editName").value,
      phone: document.getElementById("editPhone").value,
      address: document.getElementById("editAddress").value,
    };
  
    fetch("http://localhost:5000/user/editProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          alert("Profile updated successfully!");
          window.location.href = "http://localhost:5000/profile";
        } else {
          alert("Failed to update profile.");
        }
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Error updating profile.");
      });
  });
  