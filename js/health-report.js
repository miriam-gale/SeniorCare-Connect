
document.addEventListener("DOMContentLoaded", () => {
    const reportDate = document.getElementById("report-date");

    function readRecords(key) {
        try {
            const saved = localStorage.getItem(key);
            const records = saved ? JSON.parse(saved) : [];
            return Array.isArray(records) ? records : [];
        } catch (error) {
            console.error(`Could not load ${key}:`, error);
            return [];
        }
    }

    function createCell(value) {
        const cell = document.createElement("td");
        cell.textContent = value || "—";
        return cell;
    }

    function displayTable(records, tableId, emptyId, fields) {
        const table = document.getElementById(tableId);
        const emptyMessage = document.getElementById(emptyId);

        if (!table) return;

        table.replaceChildren();

        records.forEach((record) => {
            const row = document.createElement("tr");

            fields.forEach((field) => {
                let value = record[field];

                if (field === "severity" && value !== undefined) {
                    const labels = {
                        "1": "1 - Mild",
                        "2": "2 - Moderate",
                        "3": "3 - Severe",
                        "4": "4 - Very severe"
                    };

                    value = labels[String(value)] || value;
                }

                row.appendChild(createCell(value));
            });

            table.appendChild(row);
        });

        if (emptyMessage) {
            emptyMessage.hidden = records.length > 0;
        }
    }

    const medications = readRecords("seniorcare-medications");
    const symptoms = readRecords("seniorcareSymptoms");
    const allergies = readRecords("seniorcareAllergies");

    if (reportDate) {
        reportDate.textContent = new Date().toLocaleString();
    }

    document.getElementById("medication-count").textContent =
        medications.length;
    document.getElementById("symptom-count").textContent =
        symptoms.length;
    document.getElementById("allergy-count").textContent =
        allergies.length;

    displayTable(
        medications,
        "report-medications",
        "medications-empty",
        ["name", "dosage", "frequency", "time"]
    );

    displayTable(
        symptoms,
        "report-symptoms",
        "symptoms-empty",
        ["name", "date", "severity", "notes"]
    );

    displayTable(
        allergies,
        "report-allergies",
        "allergies-empty",
        ["name", "reaction", "notes"]
    );

    // Use the browser's print dialog for printing or saving as PDF.
    document.querySelectorAll(".report-actions button").forEach((button) => {
        button.addEventListener("click", () => window.print());
    });
});
