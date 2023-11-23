'use strict';

// create an array to hold the staff members
let staffMembers = [];

// define a function that renders a row of the results from API (using innerHTML)
function getStaffMember(results) {
    
    // build staff member row from the results
    const row = document.createElement('tr');
    
    // create a cell for the staff member's image
    const staffMemberImgCell = document.createElement('td');
    const staffMemberImg = document.createElement('img');
    staffMemberImg.src = results.picture.thumbnail;
    staffMemberImgCell.appendChild(staffMemberImg);
    row.appendChild(staffMemberImgCell);

    // create a cell for the staff member's name and email
    const emailCell = document.createElement('td');
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:${results.email}`;
    emailLink.textContent = `${results.name.first} ${results.name.last}`;
    emailCell.appendChild(emailLink);
    row.appendChild(emailCell);

    // create a cell for the staff member's phone number
    const phoneNumberCell = document.createElement('td');
    phoneNumberCell.textContent = results.phone;
    row.appendChild(phoneNumberCell);

    // create a cell for the staff member's city
    const cityCell = document.createElement('td');
    cityCell.textContent = results.location.city;
    row.appendChild(cityCell);

    return row;
}

// create async function to fetches the data from the API (based on button click)
async function fetchData(event) {
    event.preventDefault();

    // variable to reference the API URL
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

            if (successMessage) {
                serverMessage.innerHTML = 'Server Message:';
            }
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
        const row = getStaffMember(member);
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