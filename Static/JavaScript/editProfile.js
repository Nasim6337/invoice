document.addEventListener("DOMContentLoaded", async() => {

  //user profile data fetchup
    await fetch("http://localhost:5000/user/profile", {
      credentials: "include", // in case cookies/session are used
    }).then((res) => res.json())
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

      // business detail fetchup
      await fetch("http://localhost:5000/user/getBusinessDetail", {
        credentials: "include", // in case cookies/session are used
      }).then((res) => res.json())
        .then((data) => {
          if (data.status) {
            const business = data.business;
            document.getElementById("businessName").value = business?.businessName || "";
            document.getElementById("businessEmail").value = business?.businessEmail || "";
            document.getElementById("businessPhoneNumber").value = business?.businessPhoneNumber || "";
            document.getElementById("businessAddress").value = business?.businessAddress || "";
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

  document.getElementById("BusinessForm").addEventListener("submit",async function(e){
    e.preventDefault();

    const updatedData = {
      businessEmail:document.getElementById('businessEmail').value,
      businessName: document.getElementById("businessName").value,
      businessPhoneNumber: document.getElementById("businessPhoneNumber").value,
      businessAddress: document.getElementById("businessAddress").value,
    };

    document.getElementById('updateBusiness')
    .addEventListener('click',async()=>{
      fetch("http://localhost:5000/user/updateBusinessDetail",{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      })
      .then((res)=>res.json())
      .then((data)=>{
        if(data.status){
           alert("business  updated successfully!");
          window.location.href = "http://localhost:5000/profile";
        } else {
          alert("Failed to update profile.");
        }
      })
      .catch((err) => {
        console.error("Error updating business:", err);
        alert("Error updating business");
      });


    })

    document.getElementById('createBusiness')
    .addEventListener('click',async()=>
    {
      fetch("http://localhost:5000/user/businessDetail",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      })
      .then((res)=>res.json())
      .then((data)=>{
        if(data.status){
          alert("business  created successfully!");
          window.location.href = "http://localhost:5000/profile";
        } else {
          alert("Failed to create  business .");
        }
      })
      .catch((err) => {
        console.error("Error creating  business:", err);
        alert("Error creating business");
      });
  }
)
  })
  