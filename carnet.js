
$(document).ready(function () {
  let contacts;
  const storedContacts = localStorage.getItem('contacts');

  if (storedContacts) {
    contacts = JSON.parse(storedContacts);
  } else {
    contacts = [];
  }
  contacts = sortContacts();

  showContacts();

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

  // Save new contact
  $('#contact-form').submit(function (e) {
    e.preventDefault();
    let newContact = {
      civility: $('#civilite').val(),
      firstName: $('#prenom').val(),
      lastName: $('#nom').val().toUpperCase(),
      phoneNumber: $('#telephone').val()
    };
    contacts.push(newContact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    showSortedContacts();
    $('#contact-form')[0].reset();
    $('#contact-form-container').hide();
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

    let copiedContacts = JSON.parse(JSON.stringify(contacts));
    return copiedContacts.sort((a, b) => {

      const lastNameComparison = a.lastName.toLowerCase() > b.lastName.toLowerCase() ? 1 : -1;
      if (lastNameComparison !== 0) {
        return lastNameComparison;
      }

      return a.firstName.toLowerCase() > b.firstName.toLowerCase() ? 1 : -1;
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
          <tr data-index="${index}">
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
    $('#contacts tr').removeClass('selected-contact');
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
