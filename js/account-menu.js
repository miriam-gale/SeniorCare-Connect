
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

    // Create the Sign In link.
    const signInLink = document.createElement("a");
    signInLink.id = "account-sign-in";
    signInLink.textContent = "Sign In";
    signInLink.href = window.location.pathname.includes("/pages/")
        ? "sign-in.html"
        : "pages/sign-in.html";

    signInLink.style.alignItems = "center";
    signInLink.style.padding = "12px 16px";
    signInLink.style.color = "#078b98";
    signInLink.style.textDecoration = "none";
    signInLink.style.fontSize = "inherit";

    signOutButton.parentNode.insertBefore(signInLink, signOutButton);

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
        let profile = null;

        try {
            const saved = localStorage.getItem("seniorcareProfile");

            if (saved) {
                const parsed = JSON.parse(saved);

                if (
                    parsed &&
                    typeof parsed === "object" &&
                    !Array.isArray(parsed) &&
                    typeof parsed.name === "string" &&
                    parsed.name.trim() &&
                    typeof parsed.email === "string" &&
                    parsed.email.trim()
                ) {
                    profile = parsed;
                }
            }
        } catch (error) {
            console.error("Unable to load account details:", error);
        }

        const isSignedIn = profile !== null;

        // Use Guest details when no valid profile is saved.
        const name = isSignedIn ? profile.name.trim() : "Guest";
        const validRoles = [
            "Care Recipient",
            "Family Member",
            "Caregiver",
            "Healthcare Provider"
        ];

        const role = isSignedIn && validRoles.includes(profile.role)
            ? profile.role
            : isSignedIn
                ? defaultProfile.role
                : "Not signed in";

        avatar.textContent = isSignedIn ? getInitials(name) : "?";
        nameDisplay.textContent = name;
        roleDisplay.textContent = role;

        // Use hidden attributes AND explicit display styles.
        signInLink.hidden = isSignedIn;
        signInLink.style.display = isSignedIn ? "none" : "flex";

        signOutButton.hidden = !isSignedIn;
        signOutButton.style.display = isSignedIn ? "" : "none";
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
            "Are you sure you want to sign out?"
        );

        if (confirmed) {
            localStorage.removeItem("seniorcareProfile");

            loadAccountDetails();
            closeMenu();

            window.location.href =
                window.location.pathname.includes("/pages/")
                    ? "../index.html"
                    : "index.html";
        }
    });

    window.addEventListener("profileUpdated", loadAccountDetails);

    loadAccountDetails();
});
