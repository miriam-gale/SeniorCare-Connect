
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".navigation");
const menuIcon = menuButton.querySelector("i");

menuButton.addEventListener("click", function () {
    const isOpen = navigation.classList.toggle("show-menu");

    if (isOpen) {
        menuIcon.classList.replace("fa-bars", "fa-xmark");
        menuButton.setAttribute("aria-label", "Close navigation menu");
    } else {
        menuIcon.classList.replace("fa-xmark", "fa-bars");
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }
});


const profileButton = document.querySelector("#profile-button");
const profileDropdown = document.querySelector("#profile-dropdown");

if (profileButton && profileDropdown) {

    profileButton.addEventListener("click", function () {
        const isExpanded =
            profileButton.getAttribute("aria-expanded") === "true";

        profileButton.setAttribute("aria-expanded", String(!isExpanded));
        profileDropdown.hidden = isExpanded;
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".profile-menu")) {
            profileDropdown.hidden = true;
            profileButton.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            profileDropdown.hidden = true;
            profileButton.setAttribute("aria-expanded", "false");
            profileButton.focus();
        }
    });
}
