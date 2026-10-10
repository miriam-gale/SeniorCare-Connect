
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("triage-form");

    if (!form) {
        console.error("Triage form was not found.");
        return;
    }

    // Assessment steps
    const step1 = document.getElementById("triage-step-1");
    const step2 = document.getElementById("triage-step-2");
    const step3 = document.getElementById("triage-step-3");
    const step4 = document.getElementById("triage-step-4");

    if (!step1 || !step2 || !step3 || !step4) {
        console.error("One or more triage steps could not be found.");
        return;
    }

    // Step buttons
    const nextButton = document.getElementById("triage-next-button");
    const backButton = document.getElementById("triage-back-button");
    const detailsNextButton = document.getElementById(
        "triage-details-next-button"
    );
    const reviewBackButton = document.getElementById(
        "triage-review-back-button"
    );
    const reviewNextButton = document.getElementById(
        "triage-review-next-button"
    );
    const guidanceBackButton = document.getElementById(
        "triage-guidance-back-button"
    );
    const restartButton = document.getElementById(
        "triage-restart-button"
    );

    // Messages and result panel
    const formMessage = document.getElementById("triage-form-message");
    const detailsMessage = document.getElementById(
        "triage-details-message"
    );
    const reviewMessage = document.getElementById(
        "triage-review-message"
    );
    const resultPanel = document.getElementById("triage-result");

    const progressSteps = document.querySelectorAll(
        ".triage-progress-step"
    );

    const symptomCheckboxes = form.querySelectorAll(
        'input[name="symptoms"]'
    );

    // Collect selected symptoms.
    function getSelectedSymptoms() {
        return Array.from(symptomCheckboxes)
            .filter(function (checkbox) {
                return checkbox.checked;
            })
            .map(function (checkbox) {
                return checkbox.value;
            });
    }

    function getAssessmentAnswers() {
        const severity = form.querySelector(
            'input[name="triage-severity"]:checked'
        );

        return {
            symptoms: getSelectedSymptoms(),
            duration: document.getElementById("triage-duration").value,
            severity: severity ? severity.value : "",
            trend: document.getElementById("triage-trend").value,
            occurrence: document.getElementById("triage-occurrence").value
        };
    }

    // Display the selected step and update progress.
    function showStep(stepNumber) {
        const steps = [step1, step2, step3, step4];

        steps.forEach(function (step, index) {
            step.hidden = index !== stepNumber - 1;
        });

        progressSteps.forEach(function (step, index) {
            const isActive = index === stepNumber - 1;

            step.classList.toggle("active", isActive);

            if (isActive) {
                step.setAttribute("aria-current", "step");
            } else {
                step.removeAttribute("aria-current");
            }
        });

        const currentStep = steps[stepNumber - 1];
        const heading = currentStep.querySelector("legend");

        if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus();
        }
    }

    function showFormMessage(message) {
        formMessage.textContent = message;
    }

    function showDetailsMessage(message) {
        detailsMessage.textContent = message;
    }

    function showReviewMessage(message) {
        reviewMessage.textContent = message;
    }

    // Detect symptoms that require special safety attention.
    function hasEmergencyWarningSymptoms() {
        const symptoms = getSelectedSymptoms();

        return symptoms.some(function (symptom) {
            return [
                "Chest pain",
                "Shortness of breath"
            ].includes(symptom);
        });
    }

    // Update the persistent result panel.
    function checkEmergencyWarnings() {
        if (hasEmergencyWarningSymptoms()) {
            resultPanel.replaceChildren();

            const heading = document.createElement("h3");
            heading.textContent = "Important safety warning";

            const message = document.createElement("p");
            message.textContent =
                "Chest pain or shortness of breath can sometimes indicate " +
                "a medical emergency. If these symptoms are severe, " +
                "sudden, worsening, or happening now, seek emergency " +
                "medical help immediately. Do not wait to complete this tool.";

            const disclaimer = document.createElement("p");
            disclaimer.textContent =
                "This tool cannot determine the cause or seriousness " +
                "of your symptoms.";

            resultPanel.append(heading, message, disclaimer);
            resultPanel.setAttribute("role", "alert");
        } else {
            resultPanel.setAttribute("role", "region");
            resultPanel.innerHTML = `
                <i class="fa-solid fa-clipboard-check"
                   aria-hidden="true"></i>
                <h3>Complete the symptom assessment</h3>
                <p>
                    Your guidance will appear here after you complete
                    the assessment.
                </p>
                <p class="triage-result-disclaimer">
                    This tool provides general information only and is
                    not a substitute for professional medical advice.
                </p>
            `;
        }
    }

    // Populate the Review step.
    function populateReview() {
        const answers = getAssessmentAnswers();

        const symptomsList = document.getElementById(
            "triage-review-symptoms"
        );

        symptomsList.replaceChildren();

        answers.symptoms.forEach(function (symptom) {
            const item = document.createElement("li");
            item.textContent = symptom;
            symptomsList.appendChild(item);
        });

        if (answers.symptoms.length === 0) {
            const item = document.createElement("li");
            item.textContent = "No symptoms selected.";
            symptomsList.appendChild(item);
        }

        document.getElementById(
            "triage-review-duration"
        ).textContent = answers.duration || "Not provided";

        document.getElementById(
            "triage-review-severity"
        ).textContent = answers.severity || "Not provided";

        document.getElementById(
            "triage-review-trend"
        ).textContent = answers.trend || "Not provided";

        document.getElementById(
            "triage-review-occurrence"
        ).textContent = answers.occurrence || "Not provided";
    }

    // Generate general guidance from the assessment answers.
    function populateGuidance() {
        const answers = getAssessmentAnswers();

        const warning = document.getElementById(
            "triage-guidance-warning"
        );
        const level = document.getElementById(
            "triage-guidance-level"
        );
        const actionsList = document.getElementById(
            "triage-guidance-actions"
        );

        actionsList.replaceChildren();

        const emergencySymptoms = hasEmergencyWarningSymptoms();

        let headingText;
        let guidanceText;
        let actions = [];

        if (emergencySymptoms) {
            headingText = "Safety warning: urgent attention may be needed";

            guidanceText =
                "Chest pain or shortness of breath can sometimes be " +
                "associated with serious conditions. This tool cannot " +
                "assess the cause or severity.";

            actions = [
                "If chest pain or breathing difficulty is severe, sudden, " +
                "worsening, or happening now, seek emergency medical help " +
                "immediately.",
                "Do not delay emergency care to finish this assessment.",
                "If the symptoms are not severe or immediate, contact a " +
                "qualified healthcare professional promptly for advice."
            ];

            warning.hidden = false;
        } else if (
            answers.severity.toLowerCase() === "severe" ||
            answers.trend.toLowerCase().includes("worsen")
        ) {
            headingText = "Prompt medical assessment recommended";

            guidanceText =
                "You reported severe symptoms or symptoms that are " +
                "getting worse. A healthcare professional should assess them.";

            actions = [
                "Contact a qualified healthcare professional promptly.",
                "Seek emergency help if symptoms become severe, sudden, " +
                "or life-threatening.",
                "Keep track of your symptoms and when they change."
            ];

            warning.hidden = true;
        } else if (
            answers.severity.toLowerCase() === "moderate"
        ) {
            headingText = "Consider speaking with a healthcare professional";

            guidanceText =
                "You reported symptoms that interfere with some daily " +
                "activities. Consider professional advice, especially if " +
                "they persist or worsen.";

            actions = [
                "Arrange a healthcare consultation if symptoms persist, " +
                "interfere with daily activities, or concern you.",
                "Monitor your symptoms and any changes.",
                "Seek urgent help if serious warning signs develop."
            ];

            warning.hidden = true;
        } else {
            headingText = "Monitor your symptoms";

            guidanceText =
                "Your answers do not establish a diagnosis or determine " +
                "whether your symptoms are safe. Monitor how you feel and " +
                "seek professional advice if you are concerned.";

            actions = [
                "Rest and maintain hydration if appropriate for you.",
                "Monitor your symptoms and note any changes.",
                "Contact a healthcare professional if symptoms persist " +
                "or you are concerned.",
                "Seek emergency help if serious warning signs develop."
            ];

            warning.hidden = true;
        }

        document.getElementById(
            "triage-guidance-heading"
        ).textContent = headingText;

        level.textContent = guidanceText;

        actions.forEach(function (action) {
            const item = document.createElement("li");
            item.textContent = action;
            actionsList.appendChild(item);
        });

        document.getElementById(
            "triage-guidance-symptoms"
        ).textContent = answers.symptoms.join(", ");

        document.getElementById(
            "triage-guidance-severity"
        ).textContent = answers.severity || "Not provided";

        // Display the completed guidance in the right-hand panel.
        displayGuidanceResult(headingText, guidanceText, actions);
    }

    // Clear symptom validation and update the safety panel.
    symptomCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            showFormMessage("");
            checkEmergencyWarnings();
        });
    });

    // STEP 1: Validate symptoms and continue to Details.
    nextButton.addEventListener("click", function () {
        if (getSelectedSymptoms().length === 0) {
            showFormMessage(
                "Please select at least one symptom to continue."
            );
            symptomCheckboxes[0].focus();
            return;
        }

        showFormMessage("");
        showDetailsMessage("");
        showStep(2);
    });

    // STEP 2: Return to Symptoms.
    backButton.addEventListener("click", function () {
        showDetailsMessage("");
        showStep(1);
    });

    // STEP 2: Validate details and open Review.
    detailsNextButton.addEventListener("click", function () {
        const duration = document.getElementById("triage-duration");
        const severity = form.querySelector(
            'input[name="triage-severity"]:checked'
        );
        const trend = document.getElementById("triage-trend");
        const occurrence = document.getElementById(
            "triage-occurrence"
        );

        if (!duration.value) {
            showDetailsMessage(
                "Please select when your symptoms started."
            );
            duration.focus();
            return;
        }

        if (!severity) {
            showDetailsMessage("Please select your symptom severity.");
            form.querySelector(
                'input[name="triage-severity"]'
            ).focus();
            return;
        }

        if (!trend.value) {
            showDetailsMessage(
                "Please select how your symptoms have changed."
            );
            trend.focus();
            return;
        }

        if (!occurrence.value) {
            showDetailsMessage(
                "Please indicate whether this is a new or recurring problem."
            );
            occurrence.focus();
            return;
        }

        showDetailsMessage("");
        showReviewMessage("");

        populateReview();
        showStep(3);
    });

    // STEP 3: Return to Details.
    reviewBackButton.addEventListener("click", function () {
        showReviewMessage("");
        showStep(2);
    });

    // STEP 3: Generate guidance and open Step 4.
    reviewNextButton.addEventListener("click", function () {
        showReviewMessage("");
        populateGuidance();
        showStep(4);
    });

    // STEP 4: Return to Review without losing answers.
    guidanceBackButton.addEventListener("click", function () {
        showStep(3);
    });

    // Restart the assessment.
    restartButton.addEventListener("click", function () {
        form.reset();

        showFormMessage("");
        showDetailsMessage("");
        showReviewMessage("");

        populateReview();
        checkEmergencyWarnings();
        showStep(1);
    });

    // Start at Step 1.
    showStep(1);
    checkEmergencyWarnings();
});

// Display the completed guidance in the right-hand result panel.

function displayGuidanceResult(headingText, guidanceText, actions) {
    const panel = document.getElementById("triage-result");

    if (!panel) {
        console.error("Triage result panel was not found.");
        return;
    }

    const emergency = getEmergencyStatusForResult();

    panel.replaceChildren();

    const icon = document.createElement("i");
    icon.className = emergency
        ? "fa-solid fa-triangle-exclamation"
        : "fa-solid fa-clipboard-check";
    icon.setAttribute("aria-hidden", "true");

    const heading = document.createElement("h3");
    heading.textContent = headingText;

    const description = document.createElement("p");
    description.textContent = guidanceText;

    const actionsHeading = document.createElement("h4");
    actionsHeading.textContent = "Recommended next steps";

    const list = document.createElement("ul");

    actions.forEach(function (action) {
        const item = document.createElement("li");
        item.textContent = action;
        list.appendChild(item);
    });

    const disclaimer = document.createElement("p");
    disclaimer.className = "triage-result-disclaimer";
    disclaimer.textContent =
        "General information only. This is not a diagnosis.";

    panel.append(
        icon,
        heading,
        description,
        actionsHeading,
        list,
        disclaimer
    );

    panel.setAttribute("role", emergency ? "alert" : "region");
}

function getEmergencyStatusForResult() {
    const symptomCheckboxes = document.querySelectorAll(
        '#triage-form input[name="symptoms"]:checked'
    );

    return Array.from(symptomCheckboxes).some(function (checkbox) {
        return [
            "Chest pain",
            "Shortness of breath"
        ].includes(checkbox.value);
    });
}


    

