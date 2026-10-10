
document.addEventListener("DOMContentLoaded", () => {
    const providers = [
        {
            id: "1",
            name: "Dr. Susan Donkor",
            qualification: "MD",
            specialty: "Primary Care",
            role: "Family Medicine",
            location: "Ridge, Accra, Ghana",
            image: "../images/dr-susan-donkor.png",
            description: "Provides general and ongoing healthcare."
        },
        {
            id: "2",
            name: "Dr. James Addo",
            qualification: "MD",
            specialty: "Cardiology",
            role: "Cardiologist",
            location: "Cantonments, Accra, Ghana",
            image: "../images/dr-james-addo.png",
            description: "Specializes in heart and cardiovascular care."
        },
        {
            id: "3",
            name: "Dr. Maria Afful",
            qualification: "MD",
            specialty: "Endocrinology",
            role: "Endocrinologist",
            location: "East Legon, Accra, Ghana",
            image: "../images/dr-maria-afful.png",
            description: "Specializes in hormone-related conditions."
        },
{
    id: "4",
    name: "Dr. Ama Mensah",
    qualification: "MD",
    specialty: "Geriatrics",
    role: "Geriatrician",
    location: "Ridge, Accra, Ghana",
    image: "../images/dr-ama-mensah.png",
    description: "Focuses on the healthcare needs of older adults, including age-related conditions and ongoing care."
},
{
    id: "5",
    name: "Dr. Kofi Asare",
    qualification: "MD",
    specialty: "Neurology",
    role: "Neurologist",
    location: "Cantonments, Accra, Ghana",
    image: "../images/dr-kofi-asare.png",
    description: "Focuses on conditions affecting the brain, spinal cord, and nervous system."
}
    ];

    const $ = (selector) => document.querySelector(selector);

    const form = $("#provider-search-form");
    const queryInput = $("#provider-query");
    const specialtyInput = $("#provider-specialty");
    const locationInput = $("#provider-location");
    const providerList = $("#provider-list");
    const resultCount = $("#provider-result-count");
    const noResults = $("#provider-no-results");
    const clearButton = $("#clear-provider-filters");
    const careTeamList = $("#care-team-list");
    const careTeamEmpty = $("#care-team-empty");
    const viewTeamButton = $("#view-care-team");

    const STORAGE_KEY = "seniorcareCareTeam";
    let showCareTeamOnly = false;

    // Safely load saved provider IDs.
    function getCareTeam() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(saved)
                ? saved.map(String)
                : [];
        } catch (error) {
            console.error("Could not load care team:", error);
            return [];
        }
    }

    function saveCareTeam(team) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
            return true;
        } catch (error) {
            console.error("Could not save care team:", error);
            alert("Your care team could not be saved in this browser.");
            return false;
        }
    }

    function makeIcon(className) {
        const icon = document.createElement("i");
        icon.className = className;
        icon.setAttribute("aria-hidden", "true");
        return icon;
    }

    function makeParagraph(iconClass, text) {
        const paragraph = document.createElement("p");
        paragraph.appendChild(makeIcon(iconClass));
        paragraph.appendChild(document.createTextNode(" " + text));
        return paragraph;
    }

    function makeButton(text, className, iconClass, providerId) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.dataset.providerId = providerId;
        button.appendChild(makeIcon(iconClass));
        button.appendChild(document.createTextNode(" " + text));
        return button;
    }

    function createProviderCard(provider) {
        const card = document.createElement("article");
        card.className = "health-provider-card";

        const image = document.createElement("img");
        image.src = provider.image;
        image.alt = "Portrait of " + provider.name;
        image.className = "health-provider-image";
        image.loading = "lazy";
        image.onerror = () => {
            image.alt = "Doctor portrait unavailable";
            image.style.visibility = "hidden";
        };

        const details = document.createElement("div");
        details.className = "health-provider-details";

        const nameRow = document.createElement("div");
        nameRow.className = "health-provider-name-row";

        const heading = document.createElement("h3");
        heading.textContent =
            `${provider.name}, ${provider.qualification}`;

        const badge = document.createElement("span");
        badge.className = "provider-specialty-badge";
        badge.textContent = provider.specialty;

        nameRow.append(heading, badge);

        details.append(
            nameRow,
            makeParagraph("fa-solid fa-user-doctor", provider.role),
            makeParagraph("fa-solid fa-location-dot", provider.location)
        );

        const actions = document.createElement("div");
        actions.className = "health-provider-actions";

        const viewButton = makeButton(
            "View Details",
            "health-provider-button view-provider",
            "fa-regular fa-address-card",
            provider.id
        );

        const saved = getCareTeam().includes(provider.id);

        const addButton = makeButton(
            saved ? "Added to My Care Team" : "Add to My Care Team",
            "health-provider-outline-button add-provider",
            saved ? "fa-solid fa-check" : "fa-solid fa-circle-plus",
            provider.id
        );

        addButton.setAttribute("aria-pressed", String(saved));

        actions.append(viewButton, addButton);
        card.append(image, details, actions);

        return card;
    }

    function renderProviders() {
        if (!providerList) return;

        const query = queryInput.value.trim().toLowerCase();
        const specialty = specialtyInput.value.trim().toLowerCase();
        const location = locationInput.value.trim().toLowerCase();
        const team = getCareTeam();

        const filtered = providers.filter((provider) => {
            const searchableText = [
                provider.name,
                provider.specialty,
                provider.role,
                provider.location,
                provider.description
            ].join(" ").toLowerCase();

            const matchesQuery =
                !query || searchableText.includes(query);

            const matchesSpecialty =
                !specialty ||
                provider.specialty.toLowerCase() === specialty;

            const matchesLocation =
                !location ||
                provider.location.toLowerCase().includes(location);

            const matchesTeam =
                !showCareTeamOnly || team.includes(provider.id);

            return matchesQuery &&
                matchesSpecialty &&
                matchesLocation &&
                matchesTeam;
        });

        providerList.replaceChildren();

        filtered.forEach((provider) => {
            providerList.appendChild(createProviderCard(provider));
        });

        if (resultCount) {
            resultCount.textContent =
                `${filtered.length} provider${filtered.length === 1 ? "" : "s"} found`;
        }

        if (noResults) {
            noResults.hidden = filtered.length !== 0;
        }
    }

    function renderCareTeam() {
        if (!careTeamList || !careTeamEmpty) return;

        const savedIds = getCareTeam();
        const savedProviders = providers.filter((provider) =>
            savedIds.includes(provider.id)
        );

        careTeamList.replaceChildren();

        savedProviders.forEach((provider) => {
            const item = document.createElement("div");
            item.className = "care-team-item";

            const name = document.createElement("p");
            name.textContent = provider.name;

            const location = document.createElement("p");
            location.textContent = provider.location;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-care-provider";
            removeButton.dataset.providerId = provider.id;
            removeButton.textContent = "Remove";

            item.append(name, location, removeButton);
            careTeamList.appendChild(item);
        });

        careTeamEmpty.hidden = savedProviders.length > 0;
        careTeamList.hidden = savedProviders.length === 0;
    }

    // Search when the form is submitted.
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            showCareTeamOnly = false;
            renderProviders();
        });
    }

    // Update results when filters change.
    if (specialtyInput) {
        specialtyInput.addEventListener("change", () => {
            showCareTeamOnly = false;
            renderProviders();
        });
    }

    if (locationInput) {
        locationInput.addEventListener("input", () => {
            showCareTeamOnly = false;
            renderProviders();
        });
    }

    if (queryInput) {
        queryInput.addEventListener("input", () => {
            showCareTeamOnly = false;
            renderProviders();
        });
    }

    // Reset search and filters.
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            queryInput.value = "";
            specialtyInput.value = "";
            locationInput.value = "";
            showCareTeamOnly = false;

            renderProviders();
        });
    }

    // Handle provider card buttons using event delegation.
    if (providerList) {
        providerList.addEventListener("click", (event) => {
            const addButton = event.target.closest(".add-provider");
            const viewButton = event.target.closest(".view-provider");

            if (addButton) {
                const id = addButton.dataset.providerId;
                const team = getCareTeam();

                if (team.includes(id)) {
                    const updated = team.filter((item) => item !== id);

                    if (saveCareTeam(updated)) {
                        renderProviders();
                        renderCareTeam();
                    }
                } else {
                    if (saveCareTeam([...team, id])) {
                        renderProviders();
                        renderCareTeam();
                    }
                }

                return;
            }

            if (viewButton) {
                const provider = providers.find(
                    (item) => item.id === viewButton.dataset.providerId
                );

                if (!provider) return;

                alert(
                    `${provider.name}, ${provider.qualification}\n\n` +
                    `Specialty: ${provider.specialty}\n` +
                    `Role: ${provider.role}\n` +
                    `Location: ${provider.location}\n\n` +
                    `${provider.description}\n\n` +
                    "Demonstration profile: the provider details and " +
                    "credentials have not been independently verified."
                );
            }
        });
    }

    // Toggle between all providers and the saved care team.
    if (viewTeamButton) {
        viewTeamButton.addEventListener("click", () => {
            showCareTeamOnly = !showCareTeamOnly;

            viewTeamButton.innerHTML = showCareTeamOnly
                ? '<i class="fa-solid fa-users" aria-hidden="true"></i> View All Providers'
                : '<i class="fa-solid fa-user-group" aria-hidden="true"></i> View My Care Team';

            renderProviders();
            renderCareTeam();

            $(".health-provider-results")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    // Remove a saved provider from the sidebar.
    if (careTeamList) {
        careTeamList.addEventListener("click", (event) => {
            const button = event.target.closest(".remove-care-provider");
            if (!button) return;

            const updated = getCareTeam().filter(
                (id) => id !== button.dataset.providerId
            );

            if (saveCareTeam(updated)) {
                renderProviders();
                renderCareTeam();
            }
        });
    }

    // Helpful Information links should scroll to their sections.
    document.querySelectorAll(".health-provider-help-links a[href^='#']")
        .forEach((link) => {
            link.addEventListener("click", (event) => {
                const target = document.querySelector(link.getAttribute("href"));

                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                    history.replaceState(null, "", link.getAttribute("href"));
                }
            });
        });

    renderProviders();
    renderCareTeam();
});
