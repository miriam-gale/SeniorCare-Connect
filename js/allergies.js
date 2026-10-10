
"use strict";


// 1. GET ELEMENTS FROM allergies.html


const allergyForm = document.getElementById("allergy-form");
const allergyName = document.getElementById("allergy-name");
const allergyType = document.getElementById("allergy-type");
const allergyReaction = document.getElementById("allergy-reaction");
const allergyNotes = document.getElementById("allergy-notes");

const allergyList = document.getElementById("allergy-list");
const allergyCount = document.getElementById("allergy-record-count");
const emptyState = document.getElementById("allergy-empty-state");

const submitButton = document.getElementById("allergy-submit-button");
const cancelButton = document.getElementById("allergy-cancel-button");
const formHeading = document.getElementById("allergy-form-heading");
const formMessage = document.getElementById("allergy-form-message");

const severityInputs = document.querySelectorAll(
    'input[name="severity"]'
);


// 2. SET UP STORAGE AND EDITING


const STORAGE_KEY = "seniorcareAllergies";

let allergies = [];
let editingAllergyId = null;


// 3. LOAD SAVED ALLERGIES


function loadAllergies() {
    try {
        const savedAllergies = localStorage.getItem(STORAGE_KEY);

        if (savedAllergies) {
            const parsedAllergies = JSON.parse(savedAllergies);

            if (Array.isArray(parsedAllergies)) {
                allergies = parsedAllergies.filter(function (allergy) {
                    return (
                        allergy &&
                        typeof allergy.id === "string" &&
                        typeof allergy.name === "string" &&
                        typeof allergy.type === "string" &&
                        typeof allergy.reaction === "string" &&
                        ["Mild", "Moderate", "Severe"].includes(
                            allergy.severity
                        )
                    );
                });
            }
        }
    } catch (error) {
        console.error("Could not load allergy records:", error);
        showMessage(
            "Saved records could not be loaded. Please check your browser storage.",
            true
        );
    }
}


// 4. SAVE ALLERGIES


function saveAllergies() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(allergies)
        );

        return true;
    } catch (error) {
        console.error("Could not save allergy records:", error);

        showMessage(
            "Your changes could not be saved. Check your browser storage and try again.",
            true
        );

        return false;
    }
}


// 5. DISPLAY FORM MESSAGES


function showMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.style.color = isError ? "#c62828" : "#087b70";
}


// 6. GET SELECTED SEVERITY


function getSelectedSeverity() {
    const selected = document.querySelector(
        'input[name="severity"]:checked'
    );

    return selected ? selected.value : "";
}


// 7. RESET THE FORM


function resetAllergyForm() {
    allergyForm.reset();

    editingAllergyId = null;

    formHeading.textContent = "Add an Allergy";
    submitButton.innerHTML =
        '<i class="fa-solid fa-plus" aria-hidden="true"></i> Add Allergy';

    cancelButton.hidden = true;

    showMessage("");
}


// 8. CREATE TABLE CELLS SAFELY


function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text || "—";
    return cell;
}


// 9. DISPLAY ALLERGY RECORDS


function displayAllergies() {
    allergyList.replaceChildren();

    // Update the number of saved records.
    allergyCount.textContent =
        allergies.length +
        (allergies.length === 1
            ? " allergy recorded"
            : " allergies recorded");

    // Show the empty state only when there are no records.
    emptyState.hidden = allergies.length > 0;

    allergies.forEach(function (allergy) {
        const row = document.createElement("tr");

        row.appendChild(createCell(allergy.name));
        row.appendChild(createCell(allergy.type));
        row.appendChild(createCell(allergy.reaction));

        // Severity badge.
        const severityCell = document.createElement("td");
        const severityBadge = document.createElement("span");

        severityBadge.textContent = allergy.severity;
        severityBadge.classList.add(
            "allergy-severity-badge",
            "severity-" + allergy.severity.toLowerCase()
        );

        severityCell.appendChild(severityBadge);
        row.appendChild(severityCell);

        row.appendChild(createCell(allergy.notes));

        // Actions cell.
        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "allergy-edit-button";
        editButton.dataset.action = "edit";
        editButton.dataset.id = allergy.id;
        editButton.setAttribute(
            "aria-label",
            "Edit allergy: " + allergy.name
        );
        editButton.title = "Edit allergy";

        const editIcon = document.createElement("i");
        editIcon.className = "fa-solid fa-pen";
        editIcon.setAttribute("aria-hidden", "true");
        editButton.appendChild(editIcon);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "allergy-delete-button";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = allergy.id;
        deleteButton.setAttribute(
            "aria-label",
            "Delete allergy: " + allergy.name
        );
        deleteButton.title = "Delete allergy";

        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fa-regular fa-trash-can";
        deleteIcon.setAttribute("aria-hidden", "true");
        deleteButton.appendChild(deleteIcon);

        actionsCell.append(editButton, deleteButton);
        row.appendChild(actionsCell);

        allergyList.appendChild(row);
    });
}


// 10. ADD OR UPDATE AN ALLERGY


allergyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = allergyName.value.trim();
    const type = allergyType.value;
    const reaction = allergyReaction.value.trim();
    const severity = getSelectedSeverity();
    const notes = allergyNotes.value.trim();

    // Check that all required values are present.
    if (!name || !type || !reaction || !severity) {
        showMessage(
            "Please complete all required fields.",
            true
        );
        return;
    }

    const duplicate = allergies.some(function (allergy) {
        return (
            allergy.name.toLowerCase() === name.toLowerCase() &&
            allergy.id !== editingAllergyId
        );
    });

    if (duplicate) {
        showMessage(
            "An allergy with this name already exists. You can edit its existing record.",
            true
        );
        return;
    }

    let updatedAllergies;

    if (editingAllergyId) {
        // Update the existing record.
        updatedAllergies = allergies.map(function (allergy) {
            if (allergy.id === editingAllergyId) {
                return {
                    ...allergy,
                    name: name,
                    type: type,
                    reaction: reaction,
                    severity: severity,
                    notes: notes,
                    updatedAt: new Date().toISOString()
                };
            }

            return allergy;
        });
    } else {
        // Create a new record.
        const newAllergy = {
            id: (
                typeof crypto !== "undefined" &&
                typeof crypto.randomUUID === "function"
            )
                ? crypto.randomUUID()
                : Date.now().toString() + Math.random().toString(16).slice(2),
            name: name,
            type: type,
            reaction: reaction,
            severity: severity,
            notes: notes,
            createdAt: new Date().toISOString()
        };

        updatedAllergies = [...allergies, newAllergy];
    }

    // Only update the displayed data if saving succeeds.
    const previousAllergies = allergies;
    allergies = updatedAllergies;

    if (!saveAllergies()) {
        allergies = previousAllergies;
        return;
    }

    const wasEditing = editingAllergyId !== null;

    displayAllergies();
    resetAllergyForm();

    showMessage(
        wasEditing
            ? "Allergy updated successfully."
            : "Allergy added successfully."
    );
});


// 11. EDIT OR DELETE A RECORD


allergyList.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button || !allergyList.contains(button)) {
        return;
    }

    const allergyId = button.dataset.id;

    const allergy = allergies.find(function (item) {
        return item.id === allergyId;
    });

    if (!allergy) {
        showMessage("This allergy record could not be found.", true);
        return;
    }

    // EDIT
    if (button.dataset.action === "edit") {
        editingAllergyId = allergy.id;

        allergyName.value = allergy.name;
        allergyType.value = allergy.type;
        allergyReaction.value = allergy.reaction;
        allergyNotes.value = allergy.notes || "";

        severityInputs.forEach(function (input) {
            input.checked = input.value === allergy.severity;
        });

        formHeading.textContent = "Edit Allergy";
        submitButton.innerHTML =
            '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save Changes';

        cancelButton.hidden = false;

        showMessage("Update the details and select Save Changes.");

        allergyForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        allergyName.focus();
    }

    // DELETE
    if (button.dataset.action === "delete") {
        const confirmed = window.confirm(
            'Are you sure you want to delete the allergy "' +
            allergy.name +
            '"?'
        );

        if (!confirmed) {
            return;
        }

        const previousAllergies = allergies;

        allergies = allergies.filter(function (item) {
            return item.id !== allergyId;
        });

        if (!saveAllergies()) {
            allergies = previousAllergies;
            return;
        }

        if (editingAllergyId === allergyId) {
            resetAllergyForm();
        }

        displayAllergies();

        showMessage("Allergy deleted successfully.");
    }
});


// 12. CANCEL EDITING


cancelButton.addEventListener("click", function () {
    resetAllergyForm();
});


// 13. INITIALISE THE PAGE


loadAllergies();
displayAllergies();
