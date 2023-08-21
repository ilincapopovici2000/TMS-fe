import { addPurchase, kebabCase } from "./utils";
import { addLoader, removeLoader } from "./loader";
import { useStyle } from "./components/stiles";



async function getAllUsers() {
    const response = await fetch('http://localhost:7231/api/User/GetAll', {mode:'cors'});
    const data = await response.json();
    return data;
  }

export  const createEventElement = (eventData, title) => {
    //console.log(eventData);
    const images = ["untold.jpeg", "EC.jpg", "CPWF.jpg", "Football.jpg"];
    const id =eventData.eventId;
    const name = eventData.eventName;
    const description = eventData.eventDescription;
    const ticketCategories = eventData.ticketCategories;
    const venue = eventData.venue;
  
    if(name === "Untold"){
      var img = images[0];
    }
  
    if(name === "Electric Castle"){
      img = images[1];
    }
  
    if(name === "Wine Festival"){
      img = images[2];
    }
  
    if(name === "Meci de fotbal"){
      img = images[3];
    }
  
  
  
    //console.log(ticketCategories);
    const eventDiv = document.createElement('div')
    const eventWrapperClasses = useStyle('eventWrapper');
    const actionsWrapperClasses = useStyle('actionsWrapper');
    const quantityClasses = useStyle('quantity');
    const inputClasses = useStyle('input');
    const quantityActionsClasses = useStyle('quantityActions');
    //const increaseBtnClassses = useStyle('increaseBtn');
    const addToCartBtnClasses = useStyle('addToCartBtn');
  
    //Set up event wrapper
    eventDiv.classList.add(...eventWrapperClasses);
  
    //Create the event content markup
    const contentMarkup = `
      <header>
      <h2 class="event-title text-2xl font-bold ">${name}<h2>
      </header>
      <div class="content">
        <img src="${img}" alt="${name}" class="event-image w-full height-200 rounded>
        <p class="description text-gray-700">${description}</p>
        <p class="venue text-gray-700">${venue}</p>
        <div class="nume">
          <label for="name"> Name:</label>
          <input type = "text" id="username" class="name-input">
        </div>
      </div>
    `;
    eventDiv.innerHTML = contentMarkup;
  
    //Create ticket type selection and quantity input
    const actions = document.createElement('div');
    actions.classList.add(...actionsWrapperClasses);
  
    const categoriesOptions = ticketCategories.map(
      (ticketCategory) =>
        `<option value=${ticketCategory.ticketCategoryId}>${ticketCategory.description}</option>`
    );
  
    const ticketTypeMarkup = `
      <h2 class="text-lg font-bold mb-2">Choose Ticket Type:</h2>
      <select id="ticketCategory" name="ticketType" class="select ${title}-ticket-type">
      ${categoriesOptions}.join('\n')}
      </select>
    `;
    //console.log(ticketTypeMarkup)
    actions.innerHTML = ticketTypeMarkup;
  
    const quantity = document.createElement('div');
    quantity.classList.add(...quantityClasses);
  
    const input = document.createElement('input');
    input.classList.add(...inputClasses);
    input.type = 'number';
    input.min = '0';
    input.value = '0';
  
    input.addEventListener('blur', () => {
      if(!input.value) {
        input.value = 0;  //reset to 0
      }
    });
  
    input.addEventListener('input', () => {
      const currentQuantity = parseInt(input.value);
      //console.log(currentQuantity);
      if(currentQuantity > 0) {
        addToCartBtnClasses.disabled = false;
      } else {
        addToCartBtnClasses.disabled = true;
      }
    });
  
    quantity.appendChild(input);
  
    const quantityActions = document.createElement('div');
    quantityActions.classList.add(...quantityActionsClasses);
  
    quantity.appendChild(quantityActions);
    actions.appendChild(quantity);
    eventDiv.appendChild(actions);
  
    //Create the event footer with "Add To Cart button
    const eventFooter = document.createElement('footer');
    const addToCart = document.createElement('button');
    addToCart.classList.add(...addToCartBtnClasses);
    addToCart.innerText = 'Add To Cart';
    addToCart.disabled = false;

  
    addToCart.addEventListener('click', () => {
      handleAddToCart(id, input, addToCart);
    });
    eventFooter.appendChild(addToCart);
    eventDiv.appendChild(eventFooter);
    
    return eventDiv;
  };
  
  async function handleAddToCart (id, input, addToCart)  {
  
    const users = await getAllUsers();
    const userName = document.querySelector('.name-input').value;
    console.log(userName)
    var user = users.find(user => user.userName === userName);
    const userId = user.userid;
    console.log(userId)
    const ticketCategId= document.querySelector('#ticketCategory').value;
    const quantity = input.value;

    if(parseInt(quantity)){
        
      fetch('http://localhost:7231/api/Order/Add', {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          userId: +userId,
          numberOfTickets: quantity,
          ticketCategoryId: +ticketCategId
        })
      }).then((response)=>{
        return response.json().then((data)=>{
          if(!response.ok){
            console.log("Something went wrong...");
          }
          return data;
      })
      }).then((data)=>{
       // addPurchase(data);
        console.log("done!");
        input.value = 0;
        addToCart.disabled = true;
      })
      .finally(() => {
        removeLoader();
      });
  
    }else{
      //Not integer. To be treated
    }
  };