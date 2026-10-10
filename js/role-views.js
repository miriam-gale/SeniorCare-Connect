
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const validRoles = [
        "Care Recipient",
        "Family Member",
        "Caregiver",
        "Healthcare Provider"
    ];

    const views = {
        "Care Recipient": {
            title: "Your Health Dashboard",
            message: "Keep track of your health information and daily care.",
            links: [
                ["Medications", "medications.html"],
                ["Symptoms", "symptoms.html"],
                ["Allergies", "allergies.html"],
                ["Health Report", "health-report.html"],
                ["Find Care", "find-care.html"],
                ["Triage", "triage.html"]
            ]
        },

        "Family Member": {
            title: "Family Care Dashboard",
            message: "Stay informed and help your loved one manage their care.",
            links: [
                ["Health Report", "health-report.html"],
                ["Medications", "medications.html"],
                ["Symptoms", "symptoms.html"],
                ["Allergies", "allergies.html"],
                ["Find Care", "find-care.html"]
            ]
        },

        "Caregiver": {
            title: "Caregiver Dashboard",
            message: "Organise care information and support everyday care tasks.",
            links: [
                ["Medications", "medications.html"],
                ["Symptoms", "symptoms.html"],
                ["Allergies", "allergies.html"],
                ["Health Report", "health-report.html"],
                ["Find Care", "find-care.html"]
            ]
        },

        "Healthcare Provider": {
            title: "Healthcare Provider Dashboard",
            message: "Review available health records and explore care resources.",
            links: [
                ["Health Report", "health-report.html"],
                ["Healthcare Providers", "healthcare-provider.html"],
                ["Find Care", "find-care.html"],
                ["Symptoms", "symptoms.html"],
                ["Allergies", "allergies.html"]
            ]
        }
    };

    const dashboard = document.getElementById("role-dashboard");

    function renderDashboard(role) {
        const selectedRole = validRoles.includes(role)
            ? role
            : "Care Recipient";

        if (!dashboard) return;

        const view = views[selectedRole];

        dashboard.replaceChildren();

        const heading = document.createElement("h2");
        heading.textContent = view.title;

        const message = document.createElement("p");
        message.textContent = view.message;

        const linkContainer = document.createElement("div");
        linkContainer.className = "role-dashboard-links";

        view.links.forEach(function (item) {
            const link = document.createElement("a");
            link.textContent = item[0];
            link.className = "profile-quick-link";

            link.href = item[1];

            linkContainer.appendChild(link);
        });

        dashboard.append(heading, message, linkContainer);

        document.body.dataset.userRole = selectedRole;
    }

    function loadDashboard() {
        let profile = {};

        try {
            profile = JSON.parse(
                localStorage.getItem("seniorcareProfile") || "{}"
            );
        } catch (error) {
            console.error("Could not read profile:", error);
        }

        renderDashboard(profile.role);
    }

    // Display the correct dashboard when the page first opens.
    loadDashboard();

    // Update the dashboard immediately after the profile is saved.
    window.addEventListener("profileUpdated", function (event) {
        const updatedProfile = event.detail;

        if (updatedProfile && updatedProfile.role) {
            renderDashboard(updatedProfile.role);
        } else {
            loadDashboard();
        }
    });
});
