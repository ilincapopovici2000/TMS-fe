import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { kebabCase, addPurchase } from './utils'
import {useStyle } from './components/stiles'
import {createCheckboxesForEvents} from './CreateCheckboxesForEvents'
import { addEventListenersForCheckboxes } from './utils'
import { removeLoader, addLoader } from './loader'
import {createEventElement} from './createEvent'
import {createOrder} from './createOrder'

//setupCounter(document.querySelector('#counter'))

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}

//HTMLtemplates
function getHomePageTemplate() {
  return `
    <div class ="content" id="content" >
      <div class= "center flex justify-center filter-homepage" >
        <div class="w-8">
          <h1 class="text-2xl mb-4 mt-8 text-center">Choose your favourite event</h1>
          <div class="filters flex flex-col ">
            <input type="text" id="filter-name" placeholder="Filter by name" class="px-4 mt-4 mb-4 py-2 border "/>
          </div>
        </div>
      </div>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrderPageTemplate() {
  return `
    <div id="content" class="order">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="purchases ml-6 mr-6">
        <div class="bg-white px-4 py-3 gap-x-4 flex font-bold">
          <span class="flex-1"> Name </span>
          <span class="flex-1"> Number of tickets </span>
          <span class="flex-1"> TicketCategory</span>
          <span class="flex-1"> Ordered At</span>
          <span class="flex-2"> Price</span>
          <span class="w-28 sm:w-8"></span>
        </div>
        <div id="purchases-content">
        </div>
    </div>
  `;
}

function liveSearch(events){
  const filterInput = document.querySelector('#filter-name');
  if(filterInput) {
    const searchValue = filterInput.value;
    //console.log(events);
    //console.log(searchValue);
    if(searchValue !== undefined){
      const filteredEvents = events.filter((event) =>
        event.eventName.toLowerCase().includes(searchValue.toLowerCase())
      );
      addEvents(filteredEvents);
      console.log(filteredEvents);
    }
  }
}


function setupFilterEvents(events){
  const nameFilterInput= document.querySelector('#filter-name');

  if(nameFilterInput){
    const filterInterval = 500;
    nameFilterInput.addEventListener('keyup', () => {
      setTimeout(liveSearch(events), filterInterval);
    });
  }
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}


function setupInitialPage(){
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
  }

async function renderHomePage(){
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = getHomePageTemplate();
    //console.log(getAllEvents());


    const filters = [];

    try{
      const eventsData = await getAllEvents(filters);
      const events = Array.isArray(eventsData) ? eventsData : [];
      console.log(events);
      getAllEvents().then((data) =>{
        //events = data;
        setTimeout(() => {
          removeLoader();
        }, 200);
        addEvents(data);
      });

      setupFilterEvents(events);

      createCheckboxesForEvents(events);
      addEventListenersForCheckboxes(events);
      addEvents(events, filters);

    }catch(error){
      console.error('Error fetching events data: ', error);
    }
 }

  export function renderOrdersPage(categories){
    //console.log(categories);
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = getOrderPageTemplate();
    const purchasesDiv = document.querySelector('.purchases');
    const pucrhasesContent = document.getElementById('purchases-content');
    addLoader();
    if(purchasesDiv){
      getAllOrders().then((orders) =>{
        if(orders.length){
          setTimeout(() => {
            removeLoader();
          }, 200);
          orders.forEach((order)=>{
            const newOrder = createOrder(categories, order);
            pucrhasesContent.appendChild(newOrder);
          });
          purchasesDiv.appendChild(pucrhasesContent);
        }else removeLoader();
      });
    }
  }

async function getAllEvents() {
  const response = await fetch('http://localhost:7231/api/Event/GetAll', {mode:'cors'});
  const data = await response.json();
  return data;
}

async function getAllOrders() {
  const response = await fetch('http://localhost:7231/api/Order/GetAll', {mode:'cors'});
  const data = await response.json();
  return data;
}


async function getAllTicketCategories() {
  const response = await fetch('http://localhost:7231/api/TicketCategory/GetAll', {mode:'cors'});
  const data = await response.json();
  return data;
}

//EVENTS

const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events';
  if(events.length){
    eventsDiv.innerHTML = '';
    events.forEach(event => {
      eventsDiv.appendChild(createEvent(event));
    });
  }
};



const createEvent = (eventData) =>{
  //console.log(eventData);
  const title = kebabCase(eventData.eventType);
  //console.log(eventData.eventType);
  const eventElement = createEventElement(eventData, title);
  return eventElement;
}



// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    getAllTicketCategories()
      .then((categories) => {
        renderOrdersPage(categories);
      })
      .catch((error) => {
        console.error('Error fetching ticket categories: ', error);
      });
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();