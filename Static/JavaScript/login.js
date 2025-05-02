// File: ../JavaScript/login.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const [emailInput, passwordInput] = form.querySelectorAll("input");
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
  
      try {
        const res = await fetch("/api/auth/login/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });
  
        const result = await res.json();
  
        if (res.ok) {
            localStorage.setItem("email",email)
          alert("Otp sent to your Account ");
          window.location.href = "../HTML/otp.html?type=login";
        } else {
          alert(result.message || "Login failed.");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
      }
    });
  });
  