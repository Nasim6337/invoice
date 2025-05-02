
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const inputs = form.querySelectorAll("input");
      const data = {
        name: inputs[0].value,
        email: inputs[1].value,
        password: inputs[2].value,
        confirmPassword: inputs[3].value,
        phone: inputs[4].value,
        bankName: inputs[5].value,
        accountNumber: inputs[6].value,
        ifscCode: inputs[7].value,
        country: inputs[8].value,
      };
  
      if (data.password !== data.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
  
      try {
        const response = await fetch("/api/auth/signup/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (response.ok) {
            localStorage.setItem("email",data.email)
          alert(" An otp send to your Email  please verify first ");
          window.location.href = "../HTML/otp.html?type=signup";
        } else {
          alert(result.message || "Registration failed.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
      }
    });
  });
  