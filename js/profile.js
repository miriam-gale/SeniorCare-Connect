
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // 1. Get elements from profile.html
    const profileForm = document.getElementById("profile-form");

    const nameInput = document.getElementById("profile-name");
    const emailInput = document.getElementById("profile-email");
    const phoneInput = document.getElementById("profile-phone");
    const dobInput = document.getElementById("profile-dob");
    const roleInput = document.getElementById("profile-role");

    const editButton = document.getElementById("edit-profile-button");
    const cancelButton = document.getElementById("cancel-profile-button");
    const signOutButton = document.getElementById("sign-out-button");

    const formActions = document.getElementById("profile-form-actions");
    const message = document.getElementById("profile-message");

    const displayName = document.getElementById("profile-display-name");
    const displayRole = document.getElementById("profile-display-role");
    const avatar = document.getElementById("profile-avatar");

    const storageKey = "seniorcareProfile";

    // 2. Default demonstration profile
    const defaultProfile = {
        name: "Miriam Gale",
        email: "",
        phone: "",
        dateOfBirth: "",
        role: "Family Member"
    };

    const validRoles = [
        "Care Recipient",
        "Family Member",
        "Caregiver",
        "Healthcare Provider"
    ];

    const fields = [
        nameInput,
        emailInput,
        phoneInput,
        dobInput,
        roleInput
    ];

    let originalProfile = null;

    // 3. Get today's date in YYYY-MM-DD format
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    dobInput.max = getTodayDate();

    // 4. Generate initials from the user's name
    function getInitials(name) {
        const words = name.trim().split(/\s+/).filter(Boolean);

        if (words.length === 0) {
            return "?";
        }

        return words
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }

    // 5. Read the current form values
    function getProfileFromForm() {
        return {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            dateOfBirth: dobInput.value,
            role: roleInput.value
        };
    }

    // 6. Display profile information
    function showProfile(profile) {
        nameInput.value = profile.name;
        emailInput.value = profile.email;
        phoneInput.value = profile.phone;
        dobInput.value = profile.dateOfBirth;
        roleInput.value = profile.role;

        displayName.textContent = profile.name || "Your Name";
        displayRole.textContent = profile.role;
        avatar.textContent = getInitials(profile.name);
    }

    // 7. Enable or disable editing
    function setEditing(isEditing) {
        fields.forEach(function (field) {
            field.disabled = !isEditing;
        });

        editButton.hidden = isEditing;
        formActions.hidden = !isEditing;
    }

    // 8. Load saved information from localStorage
    function loadProfile() {
        let profile = { ...defaultProfile };

        try {
            const savedProfile = localStorage.getItem(storageKey);

            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);

                if (
                    parsedProfile &&
                    typeof parsedProfile === "object" &&
                    !Array.isArray(parsedProfile)
                ) {
                    profile = {
                        ...defaultProfile,
                        ...parsedProfile
                    };
                }
            }
        } catch (error) {
            console.error("Could not load profile:", error);
            message.textContent =
                "Could not load saved information.";
        }

        // Validate the role
        if (!validRoles.includes(profile.role)) {
            profile.role = defaultProfile.role;
        }

        // Prevent invalid saved values from breaking the form
        for (const key of [
            "name",
            "email",
            "phone",
            "dateOfBirth"
        ]) {
            if (typeof profile[key] !== "string") {
                profile[key] = defaultProfile[key];
            }
        }

        if (profile.dateOfBirth > getTodayDate()) {
            profile.dateOfBirth = "";
        }

        showProfile(profile);
        originalProfile = { ...profile };
        setEditing(false);
    }

    // 9. Edit Profile button
    editButton.addEventListener("click", function () {
        originalProfile = getProfileFromForm();
        message.textContent = "";
        setEditing(true);
        nameInput.focus();
    });

    // 10. Cancel changes
    cancelButton.addEventListener("click", function () {
        showProfile(originalProfile);
        message.textContent = "Your changes were cancelled.";
        setEditing(false);
    });

    // 11. Save changes
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!profileForm.reportValidity()) {
            return;
        }

        const updatedProfile = getProfileFromForm();

        if (!updatedProfile.name) {
            message.textContent = "Please enter your full name.";
            nameInput.focus();
            return;
        }

        if (
            updatedProfile.dateOfBirth &&
            updatedProfile.dateOfBirth > getTodayDate()
        ) {
            message.textContent =
                "Date of birth cannot be in the future.";
            dobInput.focus();
            return;
        }

        if (!validRoles.includes(updatedProfile.role)) {
            message.textContent = "Please select a valid account role.";
            return;
        }

        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(updatedProfile)
            );

            originalProfile = { ...updatedProfile };

            showProfile(updatedProfile);
            setEditing(false);

            message.textContent =
                "Your profile was saved successfully.";

            // Update the navigation avatar if account-menu.js is loaded
            window.dispatchEvent(
                new CustomEvent("profileUpdated", {
                    detail: updatedProfile
                })
            );
        } catch (error) {
            console.error("Could not save profile:", error);

            message.textContent =
                "Unable to save your changes. Please check browser storage.";
        }
    });

    // 12. Sign out (prototype only)
    signOutButton.addEventListener("click", function () {
        const confirmed = window.confirm(
            "Are you sure you want to return to the homepage?"
        );

        if (confirmed) {
            window.location.href = "../index.html";
        }
    });

    // 13. Load the profile when the page opens
    loadProfile();
});
