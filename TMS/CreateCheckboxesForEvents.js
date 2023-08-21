import { handleCheckboxFilter } from "./utils";

function setupHtmlForVenue(filtersContainer, allFiltersContainer){
    allFiltersContainer.classList.add('all-filters-container');
    const venueFilterDiv = document.createElement('div');
    venueFilterDiv.classList.add('filter-container');

    const venueTitle = document.createElement('h3');
    venueTitle.textContent = 'Filter by Venue:';
    venueFilterDiv.appendChild(venueTitle);
    filtersContainer.appendChild(venueFilterDiv);

    return venueFilterDiv;
}

function setupHtmlForEventType(filtersContainer){
    const eventTypeFilterDiv = document.createElement('div');
    eventTypeFilterDiv.classList.add('filter-container');

    const eventTypeTitle = document.createElement('h3');
    eventTypeTitle.textContent = 'Filter by Event Type:';
    eventTypeFilterDiv.appendChild(eventTypeTitle);
    filtersContainer.appendChild(eventTypeFilterDiv);

    return eventTypeFilterDiv;
}


function createCheckbox(type, value){
    const checkboxContainer = document.createElement('div');
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.id = `filter-by-${type}-${value}`;
    checkbox.value = value;

    checkbox.addEventListener('change', () => handleCheckboxFilter());

    const label = document.createElement('label');
    label.setAttribute('for', `filter-by-${type}-${value}`);
    label.textContent = value;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    return checkboxContainer;
}

export function createCheckboxesForEvents(events){

    //Set to eliminate duplicates
    const venueSet = new Set(events.map((event) => event.venue));
    const eventTypeSet = new Set(events.map((event) => event.eventType));

    const filtersContainer = document.querySelector('.filters');
    const allFilterContainer = document.createElement('div');

    const venueFilterDiv = setupHtmlForVenue(
        filtersContainer, allFilterContainer
    );
    
    venueSet.forEach((venue) => {
        const checkboxContainer = createCheckbox('venue', venue);
        venueFilterDiv.appendChild(checkboxContainer);
    });
    
    const eventTypeFilterDiv = setupHtmlForEventType(filtersContainer);

    eventTypeSet.forEach((eventType) => {
        const checkboxContainer = createCheckbox('event-type', eventType);
        eventTypeFilterDiv.appendChild(checkboxContainer);        
    });

    allFilterContainer.appendChild(venueFilterDiv);
    allFilterContainer.appendChild(eventTypeFilterDiv);
    filtersContainer.appendChild(allFilterContainer);
}