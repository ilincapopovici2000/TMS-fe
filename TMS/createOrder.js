 import { kebabCase } from "./utils";
 import {useStyle} from "./components/stiles" 
import { addLoader, removeLoader } from "./loader";
import {renderOrdersPage} from "./main"

const addOrders = (orders) => {
    const ordersDiv = document.querySelector('.orders');
    ordersDiv.innerHTML = 'No orders';
    if(orders.length){
        ordersDiv.innerHTML = '';
        orders.forEach(orders => {
            ordersDiv.appendChild(createOrder(orders));
      });
    }
  };
 
 export const createOrder = (categories, order) => {
    console.log(order);
    //console.log(order.ticketCategory);
    //console.log(categories);
    const purchase = document.createElement('div');
    purchase.id = `purchase-${order.orderId}`;
    purchase.classList.add(...useStyle('purchase'));
  
    const purchaseTitle = createParagraph(...useStyle('purchaseTitle'));
    purchaseTitle.innerText = kebabCase(order.userName);
    purchase.appendChild(purchaseTitle);
  
    const purchaseQuantity = createInput(...useStyle('purchaseQuantity'));
    purchaseQuantity.type = 'number';
    purchaseQuantity.min = '1';
    purchaseQuantity.value = `${order.numberOfTickets}`;
    purchaseQuantity.disabled = true;
  
    const purchaseQuantityWrapper = createDiv(...useStyle('purchaseQuantityWrapper'));
    purchaseQuantityWrapper.append(purchaseQuantity);
    purchase.appendChild(purchaseQuantityWrapper);
  
    const purchaseType = createSelect(...useStyle('purchaseType'));
    purchaseType.setAttribute('disabled', 'false');
    console.log(categories[0].ticketCategoryId);
    console.log(order.ticketCategory.ticketCategoryId);
    const categoriesOptions = categories.map(
      (ticketCategory) =>
      `<option class="text-sm font-bold text-black" value=${ticketCategory.ticketCategoryId}
      ${ticketCategory.ticketCategoryId == order.ticketCategory.ticketCategoryId ? 'selected' : ''
    }>${ticketCategory.description}</option>`
    ).join('\n');
  
    purchaseType.innerHTML = categoriesOptions;
    const purchaseTypeWrapper = createDiv(...useStyle('purchaseTypeWrapper'));
    purchaseTypeWrapper.append(purchaseType);
    purchase.appendChild(purchaseTypeWrapper);
    const purchaseDate = createDiv(...useStyle('purchaseDate'));
    purchaseDate.innerText = new Date(order.orderedAt).toLocaleDateString();
    purchase.appendChild(purchaseDate);
    const purchasePrice = createDiv(...useStyle('purchasePrice'));
    purchasePrice.innerText = order.totalPrice;
    purchase.appendChild(purchasePrice);
    const actions = createDiv(...useStyle('actions'));
    
  
    const editButton = createButton([...useStyle(['actionButton', 'editButton'])], '<i class="fa-solid fa-pencil"></i>', editHandler);
    actions.appendChild(editButton);

    const saveButton = createButton([...useStyle(['actionButton', 'hiddenButton', 'saveButton'])], '<i class="fa-solid fa-check"></i>', saveHandler);
    actions.appendChild(saveButton);
  
    const cancelButton = createButton([...useStyle(['actionButton', 'hiddenButton', 'cancelButton'])], '<i class="fa-solid fa-xmark"></i>', cancelHandler);
    actions.appendChild(cancelButton);
  
    const deleteButton = createButton([...useStyle(['actionButton', 'deleteButton'])], '<i class="fa-solid fa-trash-can"></i>', deleteHandler);
    actions.appendChild(deleteButton);
  
    purchase.appendChild(actions);
  
    function createDiv(...classes){
      const div = document.createElement('div');
      div.classList.add(...classes);
      return div;
    }
  
    function createParagraph(...classes) {
      const p = document.createElement('p');
      p.classList.add(...classes);
      return p;
    }
  
    function createInput(...classes) {
      const input = document.createElement('input');
      input.classList.add(...classes);
      return input;
    }
  
    function createSelect(...classes) {
      const select =document.createElement('select');
      select.classList.add(...classes);
      return select;
    }
  
    function createButton(classes, innerHTML, handler) {
      const button = document.createElement('button');
      button.classList.add(...classes);
      button.innerHTML = innerHTML;
      button.addEventListener('click', handler);
      return button;
    }
  
    function doNothing(){
      console.log("Hi byeee :)")
    }

    function editHandler(){
        if(saveButton.classList.contains('hidden') && cancelButton.classList.contains('hidden')){
            saveButton.classList.remove('hidden');
            cancelButton.classList.remove('hidden');
            purchaseType.removeAttribute('disabled');
            purchaseQuantity.removeAttribute('disabled');
            editButton.classList.add('hidden');
        }
    }

    function cancelHandler(){
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');
        editButton.classList.remove('hidden');
        purchaseType.setAttribute('disabled', 'true');
        purchaseQuantity.setAttribute('disabled', 'true');
        purchaseQuantity.value = order.numberOfTickets;
        console.log(purchaseType.options);
        Array.from(purchaseType.options).forEach(function (element, index) {
            console.log(element.value);
            if(element.value == order.ticketCategory.ticketCategoryId){
                purchaseType.options.selectedIndex = index;
                return;
            }
        });
    }

    async function updateOrder(orderId, newType, newQuantity){
        return fetch(`http://localhost:7231/api/Order/Patch`, {
            method: 'PATCH',
            mode:'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderId,
                quantity: newQuantity,
                ticketCategoryId: newType,
            })
        }).then((res) => {
            if(res.status ===200) {
                //toasters
            }
            return res;
        }).catch((err) => {
            throw new Error(err);
        })
        renderOrdersPage(categories);
    }

    async function deleteOrder(orderId){
        console.log(orderId)
        addLoader();
        fetch(`http://localhost:7231/api/Order/Delete?id=${orderId}`, {
            method: 'DELETE',
            mode:'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
          })
        .then((res) => res.json())
        .then(data =>{
            //console.log(data);
            const purchaseToBeRemoved = document.getElementById(`purchase-${orderId}`);
            purchaseToBeRemoved.remove();
        })
        .catch((e) => {
            console.error(e);
        })
        .finally(() => {
            removeLoader()
        })
        renderOrdersPage(categories);

    }

    function saveHandler(){
        const newType = purchaseType.value;
        const newQuantity = purchaseQuantity.value;
        if(newType != order.ticketCategory.ticketCategoryId || newQuantity != order.numberOfTickets) {
            addLoader();
            updateOrder(order.orderId, newType, newQuantity)
            .then((res) =>{
                console.log(res)
                if(res.status ===200) {
                    res.json().then((data) =>{
                        order = data;
                        purchasePrice.innerHTML = order.totalPrice;
                        purchaseDate.innerHTML = new Date(order.orderedAt).toLocaleDateString();
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setTimeout(() => {
                    removeLoader();
                }, 200)
            });
        }

        saveButton.classList.remove('hidden');
        cancelButton.classList.add('hidden');
        editButton.classList.remove('hidden');
        purchaseType.setAttribute('disabled', 'true');
        purchaseQuantity.setAttribute('disabled', 'true');
    }

    function deleteHandler(){
        //sssconsole.log(order);
        //console.log(order.orderId);
        deleteOrder(order.orderId);

    }

  
    return purchase;
  };