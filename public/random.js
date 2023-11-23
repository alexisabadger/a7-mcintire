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
        // a variable to hold the response from the fetch() call
        const response = await fetch(urlName);
        
        // a variable to await the .json() response.
        const data = await response.json();

        if (response.ok) {

            // if the service/API works, add the new staff member to the array
            const newStaffMember = data.results[0];
            staffMembers.push(newStaffMember);

            // render staff members
            showStaff();
            
            // render the success message if the API call is successful
            const successMessage = document.getElementById('successMessage');
            successMessage.innerHTML = 'Data fetched successfully.';

            // render the server message if the API call is successful
            if (successMessage) {
                serverMessage.innerHTML = 'Server Message:';
            }
        }
    } catch (error) {

        const errorMessage = error.message;

        const failureMessage = document.getElementById('failureMessage');
        failureMessage.innerHTML = `Error: ${errorMessage}`;

        // render the server message if the API call is unsuccessful
        if (failureMessageMessage) {
            serverMessage.innerHTML = 'Server Message:';
        }
    }
}

// function to render all staff members
function showStaff() {
    const tbody = document.getElementById('apiData');
    tbody.innerHTML = '';

    staffMembers.forEach(member => {
        const row = getStaffMember(member);
        tbody.appendChild(row);
    });
}

// add an addEventLister() to the end of the module:
document.addEventListener('DOMContentLoaded', () => {

    // a variable to reference the value of the staff.html page's <button id=""> value
    const buttonId = 'fetchDataButton';

    // now, that variable listens to the button click and calls the async function:
    const fetchDataButton = document.getElementById(buttonId);
    fetchDataButton.addEventListener('click', fetchData);
});