const ItemBody=document.getElementById('add_item');
let addItemButton=document.getElementById('add_item_button');

//adding rows
addItemButton.addEventListener('click',()=>{
    let item=document.createElement('tr');
    item.className="item_cell"
    item.innerHTML=`
     
                <td class="py-2 px-4" >
                  
                  <input type="text" class="border rounded-lg p-2 w-full" placeholder="Description"></td>

                <td class="py-2 px-4"><input type="number" id="qnt" class=" border quantity  rounded-lg p-2 w-full" placeholder="0"></td>

                <td class="py-2 px-4"><input type="number" class=" unitPrice border rounded-lg p-2 w-full" placeholder="$0.00"></td>

                <td class="py-2 px-4"><input type="number" class=" cgst border rounded-lg p-2 w-full" placeholder="0%"></td>

                <td class="py-2 px-4"><input type="number" class=" sgst border rounded-lg p-2 w-full" placeholder="0%"></td>

                <td class="py-2 px-4"><input type="number" class=" discount border rounded-lg p-2 w-full" placeholder="$0.00"></td>

                <td class=" total py-2 px-4 text-gray-800 font-medium">$0.00</td>

                <td class="py-2 px-4 text-red-500 cursor-pointer" title="delete item" ><input type="submit" value="🗑️" id="" class="cursor-pointer delete_item"></td>
              
    `
    ItemBody.appendChild(item);
    attachDeleteEvents();
    calculateTotal()
    grandCalculateTotal();
})

//deleting row 
function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.delete_item');
    deleteButtons.forEach((btn) => {
        btn.onclick = function () {
            const row = this.closest('tr'); 
            row.remove(); 
        }
    });
}
//calculating total value for every row
function calculateTotal(){
    let inputs=document.querySelectorAll('.quantity, .unitPrice, .cgst, .sgst, .discount');

    inputs.forEach((input)=>{
        input.addEventListener('input',function (){
            const row = this.closest('tr'); 
            let tds=row.children;
            let quantity=parseFloat(row.querySelector('.quantity')?.value) ||0;
            let unitPrice=parseFloat(row.querySelector('.unitPrice')?.value)||0;
            let cgst=parseFloat(row.querySelector('.cgst')?.value)||0;
            let sgst=parseFloat(row.querySelector('.sgst')?.value)||0;
            
            let discount= parseFloat(row.querySelector('.discount')?.value)|| 0;
            

            let t_mt=quantity*unitPrice;
            let total=t_mt+((t_mt*(cgst+sgst))/100)-discount;
            
            row.querySelector('.total').innerHTML=`${total}`
            grandCalculateTotal();
        })
       
        
    })
    

}
    //calculating grand total value
function grandCalculateTotal() {
    let rows = document.querySelectorAll('.item_cell');
    let subTotal = document.getElementById('Subtotal');
    let SubDiscount = document.getElementById('subDiscount');
    let GrandTotal = document.getElementById('GrandTotal');

    let total = 0;
    let discount = 0;

    rows.forEach(row => {
        let td_ttl = row.querySelector('.total');
        let dsc = row.querySelector('.discount');

        if (td_ttl && dsc) {
            let ttlText = td_ttl.innerHTML.replace('$', '');
            let ttl = parseFloat(ttlText) || 0;
            total += ttl;

            let dsct = parseFloat(dsc.value) || 0;
            discount += dsct;
        }
    });

    subTotal.innerHTML = `$${(total + discount).toFixed(2)}`;
    SubDiscount.innerHTML = `$${discount.toFixed(2)}`;
    GrandTotal.innerHTML = `$${total.toFixed(2)}`;
}


calculateTotal()


function openTemplateModal() {
    document.getElementById('templateModal').classList.remove('hidden');
  }
  
  function closeTemplateModal() {
    document.getElementById('templateModal').classList.add('hidden');
  }
  let templateId
  function confirmTemplate() {
    const selected = document.querySelector('input[name="template"]:checked');
    if (!selected) {
      alert("Please select a template to continue.");
      return;
    }
  
 templateId = selected.value;
    console.log("Selected Template:", templateId);
    generateInvoice()
    // Now continue invoice generation using selected template
    // Either send invoice data + templateId to backend
    // Or preview/download it using a redirect/fetch
  
    closeTemplateModal();
    alert("Invoice will be generated with template: " + templateId);
  
    // Example: POST to backend or redirect to download
    // fetch('/api/invoices/generate', {
    //   method: 'POST',
    //   body: JSON.stringify({ templateId, ...otherInvoiceData })
    // })
  }
  



  async function generateInvoice() {
    
    const businessName = document.getElementById('businessName').value;
    const businessEmail = document.getElementById('businessEmail').value;
    const businessAddress = document.getElementById('businessAddress').value;
    const businessPhoneNumber = document.getElementById('businessPhoneNumber').value;

    const itemRows = document.querySelectorAll('#add_item .item_cell');
    const items = [];
  
    itemRows.forEach(row => {
      const description = row.querySelector('input[placeholder="Description"]').value;
      const quantity = parseFloat(row.querySelector('.quantity').value);
      const price = parseFloat(row.querySelector('.unitPrice').value);
      const cgst = parseFloat(row.querySelector('.cgst').value);
      const sgst = parseFloat(row.querySelector('.sgst').value);
      const discount = parseFloat(row.querySelector('.discount').value);
      
      items.push({ description, quantity, price, cgst, sgst, discount });
    });
  
    const payload = {
      businessName,
      businessAddress,
      businessEmail,
      businessPhoneNumber,
      items,
      template:  'template1' // default fallback
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      const blob = await response.blob();
      console.log("blob",blob)
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'invoice.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error generating invoice:', err);
    }
  }
  



