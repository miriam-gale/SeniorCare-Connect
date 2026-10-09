
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
