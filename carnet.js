
$(document).ready(function () {
  let contacts;
  const storedContacts = localStorage.getItem('contacts');

  if (storedContacts) {
    contacts = JSON.parse(storedContacts);
  } else {
    contacts = [];
  }
  showSortedContacts();


  // Show contact details 
  $('#contacts').on('click', 'tr', function () {
    const selectedIndex = $(this).find('li').data('index');
    const isSelected = $(this).hasClass('selected');
    $('#contacts tr').removeClass('selected');
    $('#contact-details').toggle(!isSelected);
    if (!isSelected) {
      $(this).addClass('selected');
      showContactDetails(selectedIndex);
    }
  });


  // Show new contact form
  $('#new-contact').click(function () {
    $('#contact-form-container').toggle();
  });


  function verifyContact(newContact) {
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].phoneNumber === newContact.phoneNumber) {
        return true;
      }
    }
    return false;
  }


  // Save new contact
  $('#contact-form').submit(function (e) {
    e.preventDefault();
    let newContact = {
      civility: $('#civilite').val(),
      firstName: $('#prenom').val(),
      lastName: $('#nom').val().toUpperCase(),
      phoneNumber: $('#telephone').val()
    };
    if (!verifyContact(newContact)) {
      contacts.push(newContact);
      localStorage.setItem('contacts', JSON.stringify(contacts));
      showSortedContacts();
      $('#contact-form')[0].reset();
      $('#contact-form-container').hide();
    }
    else {
      alert("Contact existe deja");
    }

  });

  // Clear form
  $('#clear').click(function () {
    $('#contact-form')[0].reset();
  });

  // Clear all contacts
  $('#clear-all').click(function () {
    localStorage.removeItem('contacts');
    contacts = [];
    showSortedContacts();
    $('#contact-details').hide();
  });


  function sortContacts() {

    let copie = JSON.parse(JSON.stringify(contacts));
    return copie.sort((a, b) => {

      if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) {
        return 1;
      } else if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) {
        return -1;
      } else {

        if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) {
          return 1;
        } else if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
          return -1;
        } else {
          return 0;
        }
      }
    });
  }

  function showContacts() {
    $('#contacts').empty();
    if (contacts.length === 0) {
      $('#no-contacts-msg').show();
    } else {
      $('#no-contacts-msg').hide();
      contacts.forEach(function (contact, index) {

        $('#contacts').append(`
        <table>
          <tr>
            <td>
              <ul>
                <li data-index="${index}">${contact.firstName} ${contact.lastName}</li>
              </ul>
            </td>
          </tr>
        </table>
        `);
      });
    }
  }
  function showSortedContacts() {

    contacts = sortContacts();

    showContacts();
  }

  function showContactDetails(index) {
    let contact = contacts[index];
    $('#contact-info').html(`
      <p> ${contact.civility} ${contact.firstName} ${contact.lastName} </p>

      <p><strong>Tél:</strong> ${contact.phoneNumber}</p>
      <button id="edit-contact">Editer le contact</button>
      <br>
      
    `);
    $('#contact-details').show();

    $('#edit-contact').click(function () {

      $('#contact-form-container').show();
      $('#civilite').val(contact.civility);
      $('#prenom').val(contact.firstName);
      $('#nom').val(contact.lastName);
      $('#telephone').val(contact.phoneNumber);
      contacts.splice(index, 1); // Remove the contact from the list before editing
      localStorage.setItem('contacts', JSON.stringify(contacts));
      showSortedContacts();
      $('#contact-details').hide();
    });
  }
});
