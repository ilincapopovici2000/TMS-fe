export function getTicketEvents(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    const result = fetch(`http://localhost:7231/api/Event/GetAll?${queryParams}`, {mode:'cors'}, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    })
    .then((res) => res.json())
    .then((data) => {
        return [...data];
    });
    return result;
  }