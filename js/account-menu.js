
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const menu = document.getElementById("account-menu");
    const avatarButton = document.getElementById("account-avatar-button");
    const dropdown = document.getElementById("account-dropdown");
    const avatar = document.getElementById("account-avatar");
    const nameDisplay = document.getElementById("account-dropdown-name");
    const roleDisplay = document.getElementById("account-dropdown-role");
    const signOutButton = document.getElementById("account-sign-out");

    // Stop safely if this page does not contain the account menu.
    if (
        !menu || !avatarButton || !dropdown || !avatar ||
        !nameDisplay || !roleDisplay || !signOutButton
    ) {
        return;
    }

    const defaultProfile = {
        name: "Miriam Gale",
        role: "Family Member"
    };

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

    function loadAccountDetails() {
        let profile = { ...defaultProfile };

        try {
            const saved = localStorage.getItem("seniorcareProfile");

            if (saved) {
                const parsed = JSON.parse(saved);

                if (parsed && typeof parsed === "object" &&
                    !Array.isArray(parsed)) {
                    profile = { ...defaultProfile, ...parsed };
                }
            }
        } catch (error) {
            console.error("Unable to load account details:", error);
        }

        const validRoles = [
            "Care Recipient",
            "Family Member",
            "Caregiver",
            "Healthcare Provider"
        ];

        if (!validRoles.includes(profile.role)) {
            profile.role = defaultProfile.role;
        }

        const name =
            typeof profile.name === "string" && profile.name.trim()
                ? profile.name.trim()
                : defaultProfile.name;

        avatar.textContent = getInitials(name);
        nameDisplay.textContent = name;
        roleDisplay.textContent = profile.role;
    }

    function closeMenu() {
        dropdown.hidden = true;
        avatarButton.setAttribute("aria-expanded", "false");
    }

    avatarButton.addEventListener("click", function () {
        const shouldOpen = dropdown.hidden;

        dropdown.hidden = !shouldOpen;
        avatarButton.setAttribute("aria-expanded", String(shouldOpen));
    });

    document.addEventListener("click", function (event) {
        if (!menu.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !dropdown.hidden) {
            closeMenu();
            avatarButton.focus();
        }
    });

    signOutButton.addEventListener("click", function () {
        const confirmed = window.confirm(
            "Return to the SeniorCare Connect homepage?"
        );

        if (confirmed) {
            window.location.href =
                window.location.pathname.includes("/pages/")
                    ? "../index.html"
                    : "index.html";
        }
    });

    
    window.addEventListener("profileUpdated", loadAccountDetails);

    loadAccountDetails();
});
