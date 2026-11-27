const url = 'data/members.json';
const cards = document.querySelector('#cards');
const gridButton = document.querySelector('#grid');
const listButton = document.querySelector('#list');

// Fetch data from members.json
async function getMemberData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    
    // Support either a direct array or an object
    const membersList = Array.isArray(data) ? data : data.members;
    displayMembers(membersList);
  } catch (error) {
    console.error('Failed to load members:', error);
    cards.innerHTML = '<p>Unable to load chamber members at this time.</p>';
  }
}

// Build the <section> cards 
function displayMembers(members) {
  cards.innerHTML = ''; // Clear container

  members.forEach((member) => {
    const section = document.createElement('section');
    //const lazyAttr = index >= 3 ? 'loading="lazy"' : '';

    section.innerHTML = `
    <img src="${member.image}" alt="${member.name} logo" width="${member.width || 150}" height="${member.height || 150}">
      <h2>${member.name}</h2>
      <p>${member.address}</p>
      <p><a href="${member.websiteurl}" target="_blank" rel="noopener">Website</a></p>
      <p class="card-attribute">WhatsApp: ${member.whatsapp_number}</p>
      <p class="card-attribute">Email: ${member.email}</p>
      <p class="card-attribute">Membership: ${member.membership_level}</p>
    `;

    cards.appendChild(section);
  });
}

// Toggle between Grid and List views
gridButton.addEventListener('click', () => {
  cards.classList.add('grid');
  cards.classList.remove('list');
  gridButton.classList.add('active');
  listButton.classList.remove('active');
});

listButton.addEventListener('click', () => {
  cards.classList.add('list');
  cards.classList.remove('grid');
  listButton.classList.add('active');
  gridButton.classList.remove('active');
});

// Call the get member function
getMemberData();