'use strict';

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ 
  extended: true 
}));

app.use(express.static('public'));

const theProducts = require("./products.js");

function compareSelectedProduct(userProduct) {
  for (const aProduct of theProducts) {
    if (aProduct.product === userProduct) {
      return aProduct;
    }
  }
}

/// HTML TOP AND BOTTOM
let htmlTop = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="noindex"> 
        <link rel="stylesheet" href="style.css">
        <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png"> 
        <link rel="icon" type="image/png" sizes="512x512" href="./android-chrome-512x512.png"> 
        <link rel="icon" type="image/png" sizes="192x192" href="./android-chrome-192x192.png"> 
        <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png"> 
        <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png"> 
        <link rel="manifest" href="site.webmanifest">
        <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
        <title>E. Alex McIntire</title>
    </head>

<body>
    <header id="grid-child-header">

        <h1>
            <span>E. Alex</span>
            <a href="./index.html" >
                <img id="headerImg" src="./images/android-chrome-192x192.png">
            </a>
            <span>McIntire</span>
        </h1>
    </header>

    <nav class="global" id="grid-child-global-nav">
        <a href="./index.html">Home</a>
        <a href="./contact.html">Contact</a>
        <a href="./gallery.html">Gallery</a>
        <a href="./order.html">Order</a>
    </nav>

    <main id="contact">
`;

let htmlBottom = `
        </main>

        <footer>
            <p>© 2023 E. Alex McIntire</p>
        </footer>

    </body>
    </html>
`;
////////////////


/* ORDER FORM ENDPOINTS */
app.post('/order', (req, res) => {
  console.log('inside POST request - order page /');

  // Get data from the user's form submission:
  // (with destructuring syntax!)
  const {
    firstName,
    lastName,
    email,
    phone,
    streetAddress,
    city,
    state,
    zip,
    instructions,
    quantity,
    product
  } = req.body;

  const theUserChoice = compareSelectedProduct(req.body.userProduct);
  const theUserChoicePrice = theUserChoice.price * quantity;

  // Response displayed to the user:
  res.send(`
    ${htmlTop}
      <h1>Thank you for your order, ${firstName}!</h1>
        <p>Your order, ${quantity} <strong>${theUserChoice.product}</strong>(s) 
        (for a total of ${theUserChoicePrice.toLocaleString('en-US',{style: 'currency',currency: 'USD', 
        minimumFractionDigits: 2})}), will arrive shortly...</p>
        <p>We will send a confirmation to <strong>${email}</strong>.</p>
        <p><strong>${theUserChoice.company}</strong> will contact you if there are any questions.</p>
        <p>Your order will be shipped to:</p>
        <p class="orderText">${firstName} ${lastName}</p>
        <p class="orderText">${streetAddress}</p>
        <p class="orderText">${city}, ${state} ${zip}</p>
        <p class>Instructions: ${instructions}</p>
    ${htmlBottom}
  `);

  //console.log(req.body);
});




////////////////////////////////////////
/* CONTACT FORM ENDPOINTS */
app.post('/submit', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  // Use mapped values to make the code more readable:
      // First, map userRole value to label
      const userRoleMap = {
          hiringManager: "Hiring Manager",
          recruiter: "Recruiter",
          softwareEngineer: "Software Engineer",
          student: "Student",
          faculty: "Faculty",
          staff: "Staff",
          other: "Other",
          none: "None",
      };

      // Next, map the contactSource value to label
      const contactSourceMap = {
          searchEngine: "Search Engine",
          socialMedia: "Social Media",
          wordOfMouth: "Word of Mouth",
          other: "Other",
      };
      const contactSourceValue = req.body.contactSource;
      const contactSourceLabel = contactSourceMap[contactSourceValue] || "Unknown";
  

  const userRoleValue = req.body.userRole;
  const userRoleLabel = userRoleMap[userRoleValue] || "None";

  // Extract and format checkbox values
  const checkboxes = Object.keys(req.body)
  .filter(key => key !== 'name' && key !== 'email' && key !== 'subject' && key !== 'message' && key !== 'userRole' && key !== 'contactSource')
  .filter(key => req.body[key] === 'yes')
  .join(', ');





  let responseMessage = `
  <h2>Thank you for your submission, ${name}!</h2>
  <p class="contactReply" id="replyEmail">Email: ${email}</p>
  <p class="contactReply" id="replySubject">Subject: ${subject}</p>
  <p class="contactReply" id="replyMessage">Message: ${message}</p>
  <p class="contactReply" id="replyJobPosition">Your job/position: ${userRoleLabel}</p>
  <p class="contactReply" id="replySeeMoreOf">You'd like to see more of: ${checkboxes}</p>
  <p class="contactReply" id="replyContactSource">How you found me: ${contactSourceLabel}</p>
  `;

  // Nodemailer setup
// Generate SMTP service account from ethereal.email
nodemailer.createTestAccount((err, account) => {
  if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
  }

  console.log('Credentials obtained, sending message...');

  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
          user: account.user,
          pass: account.pass
      }
  });

  //Message object
  let nodeMailMessage = {
      from: 'mcintiel@oregonstate.edu',
      to: `${email}`,
      subject: `${subject}`,
      text: `${message}`,
      html: 
          `<style>
          /*  ===== MOBILE styles (reside at the top and are inherited by all devices) ===== */
/*  ===== See tablet, desktop, and print @media queries at the bottom. */


/*   ----- Imports  -----  */
/* @import 'node_modules/modern-normalize/modern-normalize.css';  npm install modern-normalize  Resets elements for browser consistency.  https://www.npmjs.com/package/modern-normalize */         
/* @import "component1.css";   Component-specific stylesheets, if any.   */
/* Font for body: Poppins */
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

/* Font for headings: Open Sans */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');


/*   ----- Variables  -----  */
:root {
  --main-light-shade: #f9f9f9;/* this off-white is from my background, Pam said is okay */
  --main-dark-shade-off-black: #1E1E1E; /* this very dark grey is from my background, Pam said is okay */
  --embellishment-color-blue: #58BDD2;
  --transparent-color-yellow: rgba(248, 245, 130, 0.92);
  --accent-color-red: #b21121;

  /* important: default font size sets rem units for the entire page */
  font-size: 16px;
}

/*  ----- Viewport ----- elements inherited by all remaining elements ----- */

body {       /* Can alternatively define in html {}. */
/* background-color:; currently using background image, see below*/
background-image: url("./images/21-monroe-street-new-york-ny.webp");
background-size: cover;
background-attachment: fixed;
background-position: center center;
color: var(--main-dark-shade-off-black); /* default font color */
font-family: 'Poppins', sans-serif;
margin: 0 auto 8rem auto ;
padding: 0;
width: 100vw;
max-width: 100%;
overflow-y: scroll;
}

/*  ----- Page layout blocks -----  */
header {
background-color: var(--main-light-shade);
margin-top: 3rem;
padding: 0 1rem;

height: 6rem;

display: flex;
justify-content: center;
align-items: center;

border-bottom: 8px dotted var(--embellishment-color-blue);
}

header h1 {
font-size: 1.5rem;
}

header img {
width: 3rem; 
}

header h1 a {
text-decoration: none;
}

main {
padding: 1rem;
border-left: 5px solid var(--main-dark-shade-off-black);
border-right: 5px solid var(--main-dark-shade-off-black);
border-top: 5px solid var(--main-dark-shade-off-black);
box-sizing: border-box;
}

section {}
article {}
  #index {
    display: grid;
    background-color: var(--transparent-color-yellow);
  }
  
  #contact {
    display: grid;
    background-color: var(--transparent-color-yellow);
  }
  
  #gallery {
    display: grid;
    background-color: var(--transparent-color-yellow);
  }

div {}
aside {}
footer {
background-color: var(--transparent-color-yellow); 
border-left: 5px solid var(--main-dark-shade-off-black);
border-right: 5px solid var(--main-dark-shade-off-black);
border-bottom: 5px solid var(--main-dark-shade-off-black);
box-sizing: border-box;
width: 100%;
font-size: 0.8rem;
padding-top: 1rem;
padding-bottom: 1rem;

display: flex;
justify-content: center;
align-items: center;
}

/* ----- Anchors ----- Text links */
a {
color: var(--embellishment-color-blue);
font-weight: 700;
}

a:link {}
a:hover {}
a:active {}
a:visited {}

/*  ----- Navigation ----- Override text links for navigation only.  */
nav {
display: flex;
flex-wrap: wrap;
justify-content: center;
}

.global {
background-color: var(--main-light-shade);
}

.local {
/*  NOTE: flex properties are on the element, so they don't need to be repeated on the class  */
}

.local a {
background-color: var(--accent-color-red);
color: var(--main-light-shade);
}

nav a {
margin-left: 0.3rem;
margin-right: 0.3rem;
margin-top: .5rem;
margin-bottom: .5rem;
padding: .5rem;
border: 4px solid var(--main-dark-shade-off-black);
border-radius: 10%;
text-decoration: none;
}

nav a:hover {}

/*  -----  Typography  ----- */
p {}
br {}
ol, ul, dl {}
li {}
dt {}
dd {}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Open Sans', sans-serif;
  font-weight: 900;
} 

h1 {}
h2 {}
h3 {}
h4 {}
h5 {}
h6 {}

abbr {}
acronym {}
address {}
blockquote {}
q {}
cite {}
em {}
hr {}
mark {}
s {}
span {}
strong {}
sub {}
sup {}
time {}

/*  ----- Coding or instructional typography ----- */
pre {}
code {}
kbd {}
samp {}
var {}
del {} 
ins {}

/*  ----- Table ----- */
table {}
caption {}
thead {}
tbody {}
tfoot {}
tr {}
tr:nth-child(even) {}
th {}
td {}
td:nth-child(1) {}
colgroup {}
data {}
datalist {}


/*  ----- Form ----- */
form {
max-width: 800px;
margin: 0 auto;

}
fieldset {
border: 3px solid var(--accent-color-red)
}
legend {
  font-weight: 700;
}
label {
display: block;
}
button {
background-color: var(--accent-color-red);
color: var(--main-light-shade);

margin-left: 0.3rem;
margin-right: 0.3rem;
margin-top: .5rem;
margin-bottom: .5rem;
padding: .5rem;
border: 4px solid var(--main-dark-shade-off-black);
border-radius: 10%;
text-decoration: none;
}

#contactButtonSet{
border: none;
margin: 0.5rem;
display: flex;
flex-wrap: wrap;
justify-content: center;
}

#contactButtonSet button {
margin: 0.5rem;
}

input {
margin-bottom: 0.8rem;
padding: 0.8rem;

line-height: 2rem;
font-size: 1rem;
}

.checkbox {
  font-weight: 700;
  margin-right: 0.8rem;
  padding-left: 2rem;
}

select {
margin-top: 0.5rem;
margin-bottom: 0.5rem;
padding: 0.8rem;

line-height: 2rem;
font-size: 1rem;
}
optgroup {}
option {

}
textarea {
margin-bottom: 0.8rem;
line-height: 2rem;
font-size: 1rem;
}
output {}
meter {}
progress {}

.contactReply,
.nodeMailMessage {
border: 3px solid var(--embellishment-color-blue); /* Example border styling */
padding: 1rem; /* Example padding */
margin: 1rem 0; /* Example margin to separate messages */
background-color: var(--main-light-shade); /* Example background color */
color: var(--main-dark-shade-off-black); /* Example text color */
font-size: 1rem; /* Example font size */
line-height: 1.5; /* Example line height */
max-width: 100%; /* Constrain the width to the parent element's width */
display: block;
}


/* ----- Media ----- */
figure {}
figcaption {}
figure img {}
svg {}
picture {}
source {}
iframe {}
video {}
audio {}
embed {}
object {}

/*  ----- Classes for alignment, positioning, widths, grids, embellishments, and animation -----  */
.gallery {
display: flex;
flex-flow: row wrap;
justify-content: center;
}

.gallery figure {
width: 300px;
margin: .75%;
padding: 0;
}

.gallery figcaption {
display: block;
padding: 3px;
}

.gallery img {
width: 100%;
border: 5px solid black;

overflow-clip-margin: content-box;
overflow: clip;
}

.floatright {}
.floatleft {}
.center-middle {}

.ten {}
.twenty {}
.thirty {}
.forty {}
.fifty {}
.sixty {}
.seventy {}
.eighty {}

.radius {}
.circle {}
.boxshadow {}
.tshadow {} 
.gradient {}
.shape {}

@keyframes App-logo {}

/*   ===== TABLET  media query overrides mobile styles ===== */
@media all and (min-width: 600px) {
  body {
      max-width: 70vw; /* As the screen expands, this makes sure the background image is visible */
      margin-left: auto; 
      margin-right: auto;
    }
  
    header {
      /* for larger screens, a larger header (with more padding and margin) */
      height: 8rem;
      margin-top: 5rem; 
      padding: 0 2rem; 
    }
  
    header h1 {
      font-size: 2rem; 
    }
  
    header img {
      width: 4rem;
    }
  
    main {
      /* for larger screens, more padding in the <main> */        
      padding-left: 5rem; 
      padding-right: 5rem;
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
}

/*   ===== DESKTOP  media query overrides mobile and tablet styles ===== */
@media all and (min-width: 1080px) {}

/*   ===== PRINT  media query overrides previous styles =====  */
@media print {}

/*   ===== END OF FILE =====  */
          </style>
          <h2>Thank you for your submission, ${name}!</h2>
          <p class="contactReply" id="replyEmail">Email: ${email}</p>
          <p class="contactReply" id="replySubject">Subject: ${subject}</p>
          <p class="contactReply" id="replyMessage">Message: ${message}</p>
          <p class="contactReply" id="replyJobPosition">Your job/position: ${userRoleLabel}</p>
          <p class="contactReply" id="replySeeMoreOf">You'd like to see more of: ${checkboxes} (Selected)</p>
          <p class="contactReply" id="replyContactSource">How you found me: ${contactSourceLabel}</p>

      `
  };

  transporter.sendMail(nodeMailMessage, (err, info) => {
      if (err) {
          console.log('Error occurred. ' + err.nodeMailMessage);
          return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
});
  // end Nodemailer setup



  res.send(`${htmlTop}${responseMessage}${htmlBottom}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
