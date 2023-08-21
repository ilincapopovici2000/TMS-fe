import { getTicketEvents } from "./getAllEvents";



/**
 * @param {string} str
 * @returns {string}
 */
 export const kebabCase = (str) => str.replaceAll(' ','-');
 /**
  * 
  * @param {string} searchTerm
  */

 export const addPurchase = (data) => {
    const purchasedEvents = 
        JSON.parse(localStorage.getItem('purchasedEvents')) || [];
    purchasedEvents.setItem('purchasedEvents', JSON.stringify(purchasedEvents));
 };

 export async function handleCheckboxFilter(){
    const filters = getFilters();

    try{
        const filteredData = await getTicketEvents(filters);
        addEventListener(filteredData);
    }catch (error) {
        console.error('Error fetching filtered events: ', error);
    }
 }

 export function addEventListenersForCheckboxes(events){
    const venueCheckboxes = document.querySelectorAll('[id^="filter-by-venue"]');
    venueCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('chenge', () => handleCheckboxFilter(events));
    });

    const eventTypeCheckboxes = document.querySelectorAll(
        '[id^="filter-by-event-type"]'
    );
    eventTypeCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => handleCheckboxFilter(events));
    });
    handleCheckboxFilter(events);
 }

 export function getFilters(){
    const venueFilters = Array.from(
        document.querySelectorAll('[id^="filter-by-venue"]')
    )
        .filter((checkbox) => checkbox.checked) //take the values of the filtered events
        .map((checkbox) => checkbox.value);
    
    const eventTypeFilters = Array.from(
        document.querySelectorAll('[id^="filter-by-event-type"]')
    )
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);
    
    return {
        venue: venueFilters,
        eventType:eventTypeFilters,
    }; 

 }
