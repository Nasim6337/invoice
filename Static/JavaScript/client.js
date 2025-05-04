document.addEventListener('DOMContentLoaded',async()=>{

    const clientTable=document.getElementById('clientTable');
    let clientDetails;
   await  fetch("http://localhost:5000/api/getClients")
    .then((res)=>res.json())
    .then((data)=>{
        if(data.status)
            clientDetails=data.clients
    })
    .catch((error)=>{
        alert(error.message)
    })

    if(clientDetails){
        clientDetails.forEach((client)=>{
            let row=document.createElement('tr');
            row.classList='bg-white border-b hover:bg-gray-50'
            row.innerHTML=`
            <td class="flex items-center px-6 py-4 whitespace-nowrap space-x-3">
              <img src="https://i.pravatar.cc/150?img=20" class="w-10 h-10 rounded-full object-cover" alt="Client Avatar">
              <span class="font-medium text-gray-900">${client.clientName}</span>
            </td>

            <td class="px-6 py-4">${client.clientEmail}</td>
            <td class="px-6 py-4">${client.numberOfInvoices.length}</td>
            <td class="px-6 py-4">
              <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Pending</span>
            </td>
            <td class="px-6 py-4 space-x-3">
              <button class="text-blue-600 hover:underline font-medium">View</button>
              <button class="text-yellow-600 hover:underline font-medium">Edit</button>
              <button class="text-red-600 hover:underline font-medium">Delete</button>
            </td>
          
            `
            clientTable.appendChild(row);
    })
    }

    const totalClients=document.getElementById('totalClients');

    totalClients.innerText=clientDetails.length
})