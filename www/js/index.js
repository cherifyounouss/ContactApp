document.addEventListener('deviceready', loadContacts, false);

function loadContacts() {
    let options = new ContactFindOptions();
    options.multiple = true;
    options.hasPhoneNumber = true;
    let fields = ["name"];
    
    navigator.contacts.find(fields, onSuccess, onError, options);
}

function onSuccess(contacts) {

    listeContacts = "";
    
    for (let i = 0; i < contacts.length; i++) {
        listeContacts += `
            <li contact-id="${contacts[i].id}" class="contactItem">
                <a href="#contact-show">
                    <img src="./img/contact.png">
                    <h2>${contacts[i].name.formatted}</h2>
                    <p>${contacts[i].phoneNumbers[0].value}</p>
                </a>
            </li>
        `
    }

    contactList.innerHTML += listeContacts;

    $('.contactItem').click(function() {
        showContact($(this).attr('contact-id'));
    })

    $(contactList).listview('refresh');
}

function onError(error) {
    alert(error);
}

function showContact(id) {
    let options = new ContactFindOptions();
    options.filter = id;
    options.multiple = false;
    let fields = ["id"];
    
    navigator.contacts.find(fields, showContactInfo, showErrorWithContactInfo, options);
}

function showContactInfo(contacts) {
    
    let fieldNotProvidedMessage = "Non renseigné";
    if (contacts.length != 0) {
        let contact = contacts[0];
        contactName.innerHTML = contact.name.formatted;
        contactNumber.innerHTML = contact.phoneNumbers[0] != null ? contact.phoneNumbers[0].value : fieldNotProvidedMessage;
        contactEmail.innerHTML =  contact.emails != null ? contact.emails[0].value : fieldNotProvidedMessage;
        contactAddress.innerHTML = contact.addresses != null ? contact.addresses[0].formatted : fieldNotProvidedMessage;
        contactOrganization.innerHTML = contact.organizations != null ? contact.organizations[0].name : fieldNotProvidedMessage;
    }
    else {
        alert("Contact non trouvé");
    }
}

function showErrorWithContactInfo(error) {
    alert(error);
}

function ajouterContact() {
    let prenomContact = $("#prenomContact").val();
    let nomContact = $("#nomContact").val();
    let numeroTelephone = $("#telContact").val();
    if (prenomContact.length === 0 || nomContact.length === 0 || numeroTelephone.length === 0)
        alert("Veuillez renseigner le(s) champs manquant(s)");
    else {
        let contact = navigator.contacts.create();
        let name = new ContactName();
        name.givenName = prenomContact;
        name.familyName = nomContact;
        contact.name = name;
        let phoneNumbers = [];
        phoneNumbers[0] = new ContactField('mobile', numeroTelephone, true);
        contact.phoneNumbers = phoneNumbers;
        contact.save(contactCreatedWithSuccess, errorWhenCreatingContact);
    }
}

function contactCreatedWithSuccess(contact) {
    let contactString = `
    <li contact-id="${contact.id}" class="contactItem">
        <a href="#contact-show">
            <img src="./img/contact.png">
            <h2>${contact.name.formatted}</h2>
            <p>${contact.phoneNumbers[0].value}</p>
        </a>
    </li>
    `
    alert("Contact créé avec succès");

    contactList.innerHTML += contactString;
    $(contactList).listview('refresh');

    window.location = "index.html";
}

function errorWhenCreatingContact(contactError) {
    alert("Erreur = " + contactError.code);
}