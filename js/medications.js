
const medicationForm = document.querySelector("#medication-form");

const medicationName = document.querySelector("#medication-name");
const dosage = document.querySelector("#dosage");
const frequency = document.querySelector("#frequency");
const medicationTime = document.querySelector("#medication-time");

const medicationList = document.querySelector("#medication-list");
const emptyMessage = document.querySelector("#empty-message");

const STORAGE_KEY = "seniorcare-medications";

let editingRow = null;


// Create a medication row with Edit and Delete buttons.
function addMedicationToTable(medication) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = medication.name;

    const dosageCell = document.createElement("td");
    dosageCell.textContent = medication.dosage;

    const frequencyCell = document.createElement("td");
    frequencyCell.textContent = medication.frequency;

    const timeCell = document.createElement("td");
    timeCell.textContent = medication.time;

    const actionsCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.innerHTML =
        '<i class="fa-solid fa-pen" aria-hidden="true"></i> Edit';
    editButton.setAttribute("aria-label", `Edit ${medication.name}`);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.innerHTML =
        '<i class="fa-solid fa-trash" aria-hidden="true"></i> Delete';
    deleteButton.setAttribute("aria-label", `Delete ${medication.name}`);

    // Edit the selected medication.
    editButton.addEventListener("click", function () {
        editingRow = row;

        medicationName.value = row.cells[0].textContent;
        dosage.value = row.cells[1].textContent;
        frequency.value = row.cells[2].textContent;
        medicationTime.value = row.cells[3].textContent;

        medicationForm.querySelector("button[type='submit']")
            .textContent = "Save Changes";

        medicationName.focus();
    });

    // Delete the selected medication.
    deleteButton.addEventListener("click", function () {
        if (editingRow === row) {
            editingRow = null;
            medicationForm.reset();

            medicationForm.querySelector("button[type='submit']")
                .innerHTML =
                '<i class="fa-solid fa-plus" aria-hidden="true"></i> Add Medication';
        }

        row.remove();

        saveMedications();
        updateEmptyMessage();
    });

    actionsCell.append(editButton, deleteButton);

    row.append(
        nameCell,
        dosageCell,
        frequencyCell,
        timeCell,
        actionsCell
    );

    medicationList.appendChild(row);
}


// Save the current table to localStorage.
function saveMedications() {
    const medications = [];

    medicationList.querySelectorAll("tr").forEach(function (row) {
        medications.push({
            name: row.cells[0].textContent,
            dosage: row.cells[1].textContent,
            frequency: row.cells[2].textContent,
            time: row.cells[3].textContent
        });
    });

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(medications)
    );
}


// Show the empty message only when there are no medications.
function updateEmptyMessage() {
    emptyMessage.hidden = medicationList.children.length > 0;
}


// Load previously saved medications.
function loadMedications() {
    const savedMedications = localStorage.getItem(STORAGE_KEY);

    if (savedMedications) {
        try {
            const medications = JSON.parse(savedMedications);

            if (Array.isArray(medications)) {
                medications.forEach(function (medication) {
                    addMedicationToTable(medication);
                });
            }
        } catch (error) {
            console.error("Could not load saved medications:", error);
        }
    }

    updateEmptyMessage();
}


// Add a new medication or save changes to an existing one.
medicationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const medication = {
        name: medicationName.value.trim(),
        dosage: dosage.value.trim(),
        frequency: frequency.value,
        time: medicationTime.value
    };

    if (editingRow) {
        editingRow.cells[0].textContent = medication.name;
        editingRow.cells[1].textContent = medication.dosage;
        editingRow.cells[2].textContent = medication.frequency;
        editingRow.cells[3].textContent = medication.time;

        editingRow.cells[4].querySelectorAll("button")[0]
            .setAttribute("aria-label", `Edit ${medication.name}`);

        editingRow.cells[4].querySelectorAll("button")[1]
            .setAttribute("aria-label", `Delete ${medication.name}`);

        editingRow = null;

        medicationForm.querySelector("button[type='submit']")
            .innerHTML =
            '<i class="fa-solid fa-plus" aria-hidden="true"></i> Add Medication';
    } else {
        addMedicationToTable(medication);
    }

    saveMedications();
    updateEmptyMessage();
    medicationForm.reset();
});


// Run when the page first opens.
loadMedications();


const pageMenuButton = document.querySelector(".page-menu-button");
const pageNavigation = document.querySelector("#page-navigation");

if (pageMenuButton && pageNavigation) {
    const pageMenuIcon = pageMenuButton.querySelector("i");

    function closePageMenu() {
        pageNavigation.classList.remove("show-menu");

        pageMenuButton.setAttribute("aria-expanded", "false");
        pageMenuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        pageMenuIcon.classList.replace("fa-xmark", "fa-bars");
    }

    pageMenuButton.addEventListener("click", function () {
        const isOpen = pageNavigation.classList.toggle("show-menu");

        pageMenuButton.setAttribute("aria-expanded", String(isOpen));

        if (isOpen) {
            pageMenuButton.setAttribute(
                "aria-label",
                "Close navigation menu"
            );
            pageMenuIcon.classList.replace("fa-bars", "fa-xmark");
        } else {
            closePageMenu();
        }
    });

    // Close the menu when a navigation link is selected.
    pageNavigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closePageMenu);
    });

    // Close the menu when Escape is pressed.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closePageMenu();
            pageMenuButton.focus();
        }
    });
}
