// 'use strict';

// // Define a function that renders a row of the results from the API using innerHTML.
// function renderRow(results) {
//     // Define the most appropriate HTML tags and attributes for the API's results object.
//     const row = document.createElement('tr');
    
//     const thumbnailCell = document.createElement('td');
//     const thumbnailImg = document.createElement('img');
//     thumbnailImg.src = results.picture.thumbnail;
//     thumbnailCell.appendChild(thumbnailImg);
//     row.appendChild(thumbnailCell);

//     const emailCell = document.createElement('td');
//     const emailLink = document.createElement('a');
//     emailLink.href = `mailto:${results.email}`;
//     emailLink.textContent = `${results.name.first} ${results.name.last}`;
//     emailCell.appendChild(emailLink);
//     row.appendChild(emailCell);

//     const phoneCell = document.createElement('td');
//     phoneCell.textContent = results.phone;
//     row.appendChild(phoneCell);

//     const cityCell = document.createElement('td');
//     cityCell.textContent = results.location.city;
//     row.appendChild(cityCell);

//     return row;
// }

// // Define an asynchronous function that fetches the data based on the button click event.
// async function fetchData(event) {
//     event.preventDefault();

//     // Define a variable for the attribute being used to dynamically import the data (id of the <tbody>).
//     const targetId = 'apiData';
    
//     // Define a variable to reference the API URL.
//     const urlName = 'https://randomuser.me/api/';

//     try {
//         // Define a variable to response with await and fetch of the urlName.
//         const response = await fetch(urlName);
        
//         // Define a variable to await the .json() response.
//         const data = await response.json();

//         if (response.ok) {
//             // Render the rows by calling the previous function and incrementing the results from zero, using .results[0].
//             const tbody = document.getElementById(targetId);
//             tbody.innerHTML = ''; // Clear existing data

//             const results = data.results[0];
//             const row = renderRow(results);
//             tbody.appendChild(row);

//             // Define a variable for the success message. Use innerHTML to add that message to the first paragraph of the <aside> on the staff.html page.
//             const successMessage = document.getElementById('successMessage');
//             successMessage.innerHTML = 'Data fetched successfully.';
//         }
//     } catch (error) {
//         // Define an error.message value.
//         const errorMessage = error.message;

//         // Use innerHTML to add that error message to the second paragraph of the <aside> on the staff.html page.
//         const failureMessage = document.getElementById('failureMessage');
//         failureMessage.innerHTML = `Error: ${errorMessage}`;
//     }
// }

// // Add an addEventLister() to the end of the module:
// document.addEventListener('DOMContentLoaded', () => {
//     // Define a variable to reference the value of the staff.html page's <button id=""> value.
//     const buttonId = 'fetchDataButton';

//     // Use that variable to listen to the button click and call the async function name.
//     const fetchDataButton = document.getElementById(buttonId);
//     fetchDataButton.addEventListener('click', fetchData);
// });

'use strict';

let staffMembers = [];

// Define a function that renders a row of the results from the API using innerHTML.
function renderRow(results) {
    // Define the most appropriate HTML tags and attributes for the API's results object.
    const row = document.createElement('tr');
    
    const thumbnailCell = document.createElement('td');
    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = results.picture.thumbnail;
    thumbnailCell.appendChild(thumbnailImg);
    row.appendChild(thumbnailCell);

    const emailCell = document.createElement('td');
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:${results.email}`;
    emailLink.textContent = `${results.name.first} ${results.name.last}`;
    emailCell.appendChild(emailLink);
    row.appendChild(emailCell);

    const phoneCell = document.createElement('td');
    phoneCell.textContent = results.phone;
    row.appendChild(phoneCell);

    const cityCell = document.createElement('td');
    cityCell.textContent = results.location.city;
    row.appendChild(cityCell);

    return row;
}

// Define an asynchronous function that fetches the data based on the button click event.
async function fetchData(event) {
    event.preventDefault();

    // Define a variable to reference the API URL.
    const urlName = 'https://randomuser.me/api/';

    try {
        // Define a variable to response with await and fetch of the urlName.
        const response = await fetch(urlName);
        
        // Define a variable to await the .json() response.
        const data = await response.json();

        if (response.ok) {
            // Add the new staff member to the array
            const newStaffMember = data.results[0];
            staffMembers.push(newStaffMember);

            // Render all staff members
            renderStaffMembers();
            
            // Define a variable for the success message. Use innerHTML to add that message to the first paragraph of the <aside> on the staff.html page.
            const successMessage = document.getElementById('successMessage');
            successMessage.innerHTML = 'Data fetched successfully.';
        }
    } catch (error) {
        // Define an error.message value.
        const errorMessage = error.message;

        // Use innerHTML to add that error message to the second paragraph of the <aside> on the staff.html page.
        const failureMessage = document.getElementById('failureMessage');
        failureMessage.innerHTML = `Error: ${errorMessage}`;
    }
}

// Function to render all staff members
function renderStaffMembers() {
    const tbody = document.getElementById('apiData');
    tbody.innerHTML = ''; // Clear existing data

    staffMembers.forEach(member => {
        const row = renderRow(member);
        tbody.appendChild(row);
    });
}

// Add an addEventLister() to the end of the module:
document.addEventListener('DOMContentLoaded', () => {
    // Define a variable to reference the value of the staff.html page's <button id=""> value.
    const buttonId = 'fetchDataButton';

    // Use that variable to listen to the button click and call the async function name.
    const fetchDataButton = document.getElementById(buttonId);
    fetchDataButton.addEventListener('click', fetchData);
});