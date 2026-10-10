
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signin-form");
    const nameInput = document.getElementById("signin-name");
    const emailInput = document.getElementById("signin-email");
    const roleInput = document.getElementById("signin-role");
    const message = document.getElementById("signin-message");

    const validRoles = [
        "Care Recipient",
        "Family Member",
        "Caregiver",
        "Healthcare Provider"
    ];

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const role = roleInput.value;

        if (!name || !email || !validRoles.includes(role)) {
            message.textContent = "Please complete all fields correctly.";
            return;
        }

        const profile = {
            name: name,
            email: email,
            phone: "",
            dateOfBirth: "",
            role: role
        };

        try {
            localStorage.setItem(
                "seniorcareProfile",
                JSON.stringify(profile)
            );

            window.location.href = "../index.html";
        } catch (error) {
            console.error("Unable to save profile:", error);
            message.textContent =
                "We could not save your details. Please try again.";
        }
    });
});
