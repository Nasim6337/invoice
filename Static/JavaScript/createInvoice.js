const ItemBody=document.getElementById('add_item');
let addItemButton=document.getElementById('add_item_button');



addItemButton.addEventListener('click',()=>{
    let item=document.createElement('tr');
    item.id="item_cell"
    item.innerHTML=`
    
              
                <td class="py-2 px-4" id="item_cell"><input type="text" class="border rounded-lg p-2 w-full" placeholder="Description"></td>
                <td class="py-2 px-4"><input type="number" class="border rounded-lg p-2 w-full" placeholder="0"></td>
                <td class="py-2 px-4"><input type="number" class="border rounded-lg p-2 w-full" placeholder="$0.00"></td>
                <td class="py-2 px-4"><input type="number" class="border rounded-lg p-2 w-full" placeholder="0%"></td>
                <td class="py-2 px-4"><input type="number" class="border rounded-lg p-2 w-full" placeholder="$0.00"></td>
                <td class="py-2 px-4 text-gray-800 font-medium">$0.00</td>
                  <td class="py-2 px-4 text-red-500 cursor-pointer" title="delete item" ><input type="submit" value="🗑️" id="delete_item" class="cursor-pointer"></td>
              
    `;
    ItemBody.appendChild(item);

})

let totalRow=document.querySelectorAll('item_cell');

let totalDeleteButton=document.querySelectorAll('delete_item');


totalDeleteButton.forEach((deleteButton,index)=>{   
    deleteButton.addEventListener('click',()=>{
        let deleteButtonIndex=index;
        totalRow.forEach((row,index)=>{
            if(deleteButtonIndex===index){
                console.log("matched ")
            }
            else
            console.log("not matched")
        })

    })
   
})





