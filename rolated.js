// checkRelations.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const agenciesFile = "./contactsHub/agencies_agency_rows.csv";
const contactsFile = "./contactsHub/contacts_contact_rows.csv"

const agencies = [];
const contacts = [];

// Load agencies
fs.createReadStream(agenciesFile)
  .pipe(csv())
  .on("data", (row) => agencies.push({ id: row.id, name: row.name }))
  .on("end", () => {
    // Load contacts
    fs.createReadStream(contactsFile)
      .pipe(csv())
      .on("data", (row) =>
        contacts.push({ id: row.id, agency_id: row.agency_id, name: row.first_name + " " + row.last_name })
      )
      .on("end", () => {
        let matchedCount = 0;

        agencies.forEach((agency) => {
          const relatedContacts = contacts.filter((c) => c.agency_id === agency.id);
          if (relatedContacts.length > 0) {
            matchedCount++;
            console.log(`Agency "${agency.name}" has ${relatedContacts.length} contact(s):`);
            relatedContacts.forEach((c) => console.log(`  - ${c.name}`));
          }
        });

        console.log(`\nTotal agencies: ${agencies.length}`);
        console.log(`Agencies with contacts: ${matchedCount}`);
        console.log(`Agencies with no contacts: ${agencies.length - matchedCount}`);
      });
  });
