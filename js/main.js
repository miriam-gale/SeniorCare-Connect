
"use strict";


document.addEventListener("DOMContentLoaded", function () {
    // Support both header class names used across the pages.
    const menuButton = document.querySelector(
        ".page-menu-button, .menu-button"
    );

    const navigation = document.querySelector(
        "#page-navigation, .page-navigation, .navigation"
    );

    if (!menuButton || !navigation) {
        console.error("Navigation menu button or navigation element was not found.");
        return;
    }

    const menuIcon = menuButton.querySelector("i");

    menuButton.addEventListener("click", function () {
        const isOpen = navigation.classList.toggle("show-menu");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        if (menuIcon) {
            menuIcon.classList.toggle("fa-bars", !isOpen);
            menuIcon.classList.toggle("fa-xmark", isOpen);
        }
    });

    // Close the menu when a navigation link is selected.
    navigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navigation.classList.remove("show-menu");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");

            if (menuIcon) {
                menuIcon.classList.add("fa-bars");
                menuIcon.classList.remove("fa-xmark");
            }
        });
    });
});
