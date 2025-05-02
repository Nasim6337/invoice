
document.addEventListener("DOMContentLoaded",async()=>{
    let fetchedUserData;
    //fetching the user detail for serving into the front-end part 
    await fetch('http://localhost:5000/user/profile')
    .then((Response)=>{
        return Response.json();    
    })
    .then((data)=>{
        if(data.status)
            fetchedUserData=data.user
    })
    .catch((error)=>{
        console.log("error in profile info fetching",error.message)
    })
    
    let uNAme=document.getElementById('UserName');
    let uEmail=document.getElementById('userEmail');
    let uPhoneNumber=document.getElementById('userNumber');
    let uAddress=document.getElementById('userAddress');
    let joinDate=document.getElementById('joinDate')
    let totalInvoices=document.getElementById('totalInvoices');
    let paidInvoices=document.getElementById('paidInvoices');
    let pendingInvoices=document.getElementById('pendingInvoices');
    let profileImage=document.getElementById('profileImage');
    uNAme.innerHTML=fetchedUserData?.name;
    uEmail.innerHTML=fetchedUserData?.email;
    uPhoneNumber.innerHTML=fetchedUserData?.phone;
    uAddress.innerHTML=fetchedUserData?.address;
    totalInvoices.innerHTML=fetchedUserData?.totalInvoices?.length;
    paidInvoices.innerHTML=fetchedUserData?.paidInvoices;
    pendingInvoices.innerHTML=fetchedUserData?.pendingInvoices;
    profileImage.src=fetchedUserData?.profilePicture;

    


});

//updating fields of users
let editButton=document.getElementById('editProfile');
editButton.addEventListener('click',async()=>{
    window.location.href="http://localhost:5000/editProfile";
})

//logging out from account
let logout=document.getElementById('logOut');
logout.addEventListener('click',async()=>{
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    localStorage.clear();
    window.location.href="http://localhost:5000/login"

})

//deleting account of user
let deletedButton=document.getElementById('deleteButton');
deletedButton.addEventListener('click',async()=>{
    fetch('http://localhost:5000/user/deleteUser',{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({status:"delete"}),
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.status)
            {alert(data.message);
                document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
                localStorage.clear();
            window.location.href="http://localhost:5000/login"}
    })
    .catch((error)=>{
        alert(error.message)
    })
})