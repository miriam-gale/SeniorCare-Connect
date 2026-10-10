

// 1. Select HTML elements
const symptomForm = document.getElementById("symptom-form");
const symptomName = document.getElementById("symptom-name");
const symptomDate = document.getElementById("symptom-date");
const symptomNotes = document.getElementById("symptom-notes");

const symptomList = document.getElementById("symptom-list");
const emptyMessage = document.getElementById("symptom-empty-message");
const trendFilter = document.getElementById("trend-filter");

const viewAllButton = document.getElementById("view-all-symptoms");
const symptomListHeading = document.getElementById("symptom-list-heading");



// Controls whether all records or only recent records are displayed
let showAllSymptoms = false;

const submitButton = document.getElementById("symptom-submit-button");
const cancelEditButton = document.getElementById("cancel-edit-button");

// Get severity radio buttons
const severityRadios = document.querySelectorAll(
    'input[name="severity"]'
);

// 2. Track the record being edited
let symptoms = [];
let editingSymptomId = null;

// 3. Date handling
function getTodayDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function updateDateLimit() {
    if (symptomDate) {
        symptomDate.max = getTodayDate();
    }
}

updateDateLimit();

document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
        updateDateLimit();
    }
});

window.addEventListener("focus", updateDateLimit);

// 4. Load saved symptoms
function loadSymptoms() {
    const savedSymptoms = localStorage.getItem("seniorcareSymptoms");

    if (!savedSymptoms) {
        symptoms = [];
        return;
    }

    try {
        const parsedSymptoms = JSON.parse(savedSymptoms);
        symptoms = Array.isArray(parsedSymptoms) ? parsedSymptoms : [];
    } catch (error) {
        console.error("Could not load saved symptoms:", error);
        symptoms = [];
    }
}

// 5. Save symptoms
function saveSymptoms() {
    try {
        localStorage.setItem(
            "seniorcareSymptoms",
            JSON.stringify(symptoms)
        );
        return true;
    } catch (error) {
        console.error("Could not save symptoms:", error);
        alert("Your symptoms could not be saved. Please try again.");
        return false;
    }
}

// 6. Reset the form and leave edit mode
function cancelEdit() {
    editingSymptomId = null;

    symptomForm.reset();
    updateDateLimit();

    if (submitButton) {
        submitButton.innerHTML =
            '<i class="fa-solid fa-plus" aria-hidden="true"></i> Add Symptom';
    }

    if (cancelEditButton) {
        cancelEditButton.hidden = true;
    }
}

// 7. Start editing an existing symptom
function editSymptom(symptom) {
    symptomName.value = symptom.name;
    symptomDate.value = symptom.date;
    symptomNotes.value = symptom.notes || "";

    severityRadios.forEach(function (radio) {
        radio.checked = radio.value === String(symptom.severity);
    });

    editingSymptomId = symptom.id;

    submitButton.innerHTML =
        '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save Changes';

    cancelEditButton.hidden = false;

    symptomForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// 8. Delete a symptom
function deleteSymptom(symptom) {
    const confirmed = confirm(
        `Are you sure you want to delete the record for "${symptom.name}"?`
    );

    if (!confirmed) return;

    const previousSymptoms = [...symptoms];

    symptoms = symptoms.filter(function (item) {
        return item.id !== symptom.id;
    });

    if (saveSymptoms()) {
        if (editingSymptomId === symptom.id) {
            cancelEdit();
        }

        displaySymptoms();
        alert("Symptom record deleted successfully!");
    } else {
        symptoms = previousSymptoms;
        displaySymptoms();
    }
}

// 9. Display symptoms in the table
function displaySymptoms() {
    symptomList.replaceChildren();

    if (emptyMessage) {
        emptyMessage.style.display =
            symptoms.length === 0 ? "block" : "none";
    }

    // Sort records from newest to oldest
const sortedSymptoms = [...symptoms].sort(function (a, b) {
    return b.date.localeCompare(a.date);
});

// Show five recent records or the complete history
const symptomsToDisplay = showAllSymptoms
    ? sortedSymptoms
    : sortedSymptoms.slice(0, 5);

    symptomsToDisplay.forEach(function (symptom) {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = symptom.date;

        const nameCell = document.createElement("td");
        nameCell.textContent = symptom.name;

        const severityCell = document.createElement("td");

        const severityLabels = {
            "1": "1 - Mild",
            "2": "2 - Moderate",
            "3": "3 - Severe",
            "4": "4 - Very severe"
        };

        severityCell.textContent =
            severityLabels[String(symptom.severity)] ||
            symptom.severity;

        const notesCell = document.createElement("td");
        notesCell.textContent = symptom.notes || "—";

        const actionsCell = document.createElement("td");

        // Edit button
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.classList.add("edit-symptom-btn");

        editButton.addEventListener("click", function () {
            editSymptom(symptom);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-symptom-btn");

        deleteButton.addEventListener("click", function () {
            deleteSymptom(symptom);
        });

        actionsCell.append(editButton, deleteButton);

        row.append(
            dateCell,
            nameCell,
            severityCell,
            notesCell,
            actionsCell
        );

        symptomList.appendChild(row);
    });

    updateSymptomChart();
}


/* VIEW ALL SYMPTOMS */


if (viewAllButton) {
    viewAllButton.addEventListener("click", function () {
        showAllSymptoms = !showAllSymptoms;

        // Update the button label and icon
        viewAllButton.innerHTML = showAllSymptoms
            ? 'Show Recent <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>'
            : 'View All <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';

        // Update the section heading
        if (symptomListHeading) {
            symptomListHeading.textContent = showAllSymptoms
                ? "All Symptoms"
                : "Recent Symptoms";
        }

        // Refresh the table
        displaySymptoms();
    });
}





/*SYMPTOM TRENDS CHART */

const chartCanvas = document.getElementById("symptom-trend-chart");
const chartContainer = document.getElementById("symptom-chart-container");
const chartMessage = document.getElementById("symptom-chart-message");

let symptomChart = null;

// Get the dates for the last seven days, including today
function getLastSevenDays() {
    const dates = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        date.setDate(date.getDate() - i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        dates.push(`${year}-${month}-${day}`);
    }

    return dates;
}

// Draw or update the chart
function updateSymptomChart() {
    if (!chartCanvas || typeof Chart === "undefined") {
        return;
    }

    const selectedSymptom = trendFilter.value;
    const lastSevenDays = getLastSevenDays();

    // Filter records by symptom and date
    const filteredSymptoms = symptoms.filter(function (symptom) {
        const matchesSymptom =
            selectedSymptom === "all" ||
            symptom.name === selectedSymptom;

        const matchesDate = lastSevenDays.includes(symptom.date);

        return matchesSymptom && matchesDate;
    });

    // Show a message if no records match
    if (filteredSymptoms.length === 0) {
        if (symptomChart) {
            symptomChart.destroy();
            symptomChart = null;
        }

        chartContainer.hidden = true;
        chartMessage.hidden = false;
        chartMessage.textContent =
            "No matching symptom records found for the last seven days.";

        return;
    }

    chartMessage.hidden = true;
    chartContainer.hidden = false;

    // Count records for each day
    const counts = lastSevenDays.map(function (date) {
        return filteredSymptoms.filter(function (symptom) {
            return symptom.date === date;
        }).length;
    });

    // Format dates for display
    const labels = lastSevenDays.map(function (date) {
        const parts = date.split("-");
        return `${parts[2]}/${parts[1]}`;
    });

    // Remove the previous chart before drawing a new one
    if (symptomChart) {
        symptomChart.destroy();
    }

    symptomChart = new Chart(chartCanvas, {
        type: "bar",

        data: {
            labels: labels,

            datasets: [{
                label: "Symptoms recorded",
                data: counts,
                backgroundColor: "#80cbc4",
                borderColor: "#0f6b5f",
                borderWidth: 1,
                borderRadius: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        title: function (items) {
                            const index = items[0].dataIndex;
                            return lastSevenDays[index];
                        }
                    }
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    },
                    title: {
                        display: true,
                        text: "Number of records"
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: "Date"
                    }
                }
            }
        }
    });
}

// Update the chart whenever the filter changes
if (trendFilter) {
    trendFilter.addEventListener("change", updateSymptomChart);
}

// 10. Handle form submission
symptomForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = symptomName.value;
    const date = symptomDate.value;
    const notes = symptomNotes.value.trim();

    const selectedSeverity = document.querySelector(
        'input[name="severity"]:checked'
    );

    // Validate required fields
    if (!name || !date) {
        alert("Please select a symptom and enter a date.");
        return;
    }

    if (!selectedSeverity) {
        alert("Please select the severity of your symptom.");
        return;
    }

    // Validate the date
    updateDateLimit();

    const dateParts = date.split("-").map(Number);
    const parsedDate = new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2]
    );

    const validDate =
        /^\d{4}-\d{2}-\d{2}$/.test(date) &&
        parsedDate.getFullYear() === dateParts[0] &&
        parsedDate.getMonth() === dateParts[1] - 1 &&
        parsedDate.getDate() === dateParts[2];

    if (!validDate) {
        alert("Please enter a valid symptom date.");
        return;
    }

    if (date > getTodayDate()) {
        alert("The symptom date cannot be in the future.");
        return;
    }

    const symptomData = {
        name: name,
        date: date,
        severity: selectedSeverity.value,
        notes: notes
    };

    const previousSymptoms = [...symptoms];
    const wasEditing = editingSymptomId !== null;

    if (wasEditing) {
        // Update the existing record without creating a duplicate
        symptoms = symptoms.map(function (symptom) {
            if (symptom.id === editingSymptomId) {
                return {
                    ...symptom,
                    ...symptomData
                };
            }

            return symptom;
        });
    } else {
        // Add a new record
        symptoms.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            ...symptomData
        });
    }

    if (saveSymptoms()) {
        displaySymptoms();
        cancelEdit();

        alert(
            wasEditing
                ? "Symptom updated successfully!"
                : "Symptom recorded successfully!"
        );
    } else {
        symptoms = previousSymptoms;
        displaySymptoms();
    }
});

// 11. Cancel editing when requested
if (cancelEditButton) {
    cancelEditButton.addEventListener("click", cancelEdit);
}

// 12. Load and display records when the page opens
loadSymptoms();
displaySymptoms();
updateSymptomChart();

console.log("Symptoms Tracker loaded successfully!");


