
document.addEventListener("DOMContentLoaded", () => {
    // Get the search controls
    const searchForm = document.getElementById("facility-search-form");
    const searchInput = document.getElementById("facility-search");
    const locationFilter = document.getElementById("facility-location");
    const typeFilter = document.getElementById("facility-type");
    const specialtyFilter = document.getElementById("facility-specialty");
    const sortSelect = document.getElementById("facility-sort");
    const resetButton = document.getElementById("facility-reset-button");

    // Get the facility cards and result messages
    const facilityList = document.getElementById("facility-list");
    const emptyState = document.getElementById("facility-empty-state");
    const resultsCount = document.getElementById("facility-results-count");

    // Stop safely if an important element is missing
    if (
        !searchInput ||
        !locationFilter ||
        !typeFilter ||
        !specialtyFilter ||
        !sortSelect ||
        !resetButton ||
        !facilityList ||
        !emptyState ||
        !resultsCount
    ) {
        console.error("Find Care: One or more required HTML elements are missing.");
        return;
    }

    // Save the original facility cards
    const facilities = Array.from(
        facilityList.querySelectorAll(".find-care-card")
    );

    // Convert text to a consistent format for searching
    function normalizeText(text) {
        return text.toLowerCase().trim();
    }

    // Filter, sort and display facilities
    function updateFacilities() {
        const searchTerm = normalizeText(searchInput.value);
        const selectedLocation = normalizeText(locationFilter.value);
        const selectedType = normalizeText(typeFilter.value);
        const selectedSpecialty = normalizeText(specialtyFilter.value);

        let visibleFacilities = facilities.filter((facility) => {
            const name = normalizeText(facility.dataset.name || "");
            const location = normalizeText(facility.dataset.location || "");
            const type = normalizeText(facility.dataset.type || "");
            const specialties = normalizeText(
                facility.dataset.specialty || ""
            );
            const cardText = normalizeText(facility.textContent);

            const matchesSearch =
                !searchTerm ||
                name.includes(searchTerm) ||
                location.includes(searchTerm) ||
                type.includes(searchTerm) ||
                specialties.includes(searchTerm) ||
                cardText.includes(searchTerm);

            const matchesLocation =
                !selectedLocation ||
                location.includes(selectedLocation);

            const matchesType =
                !selectedType ||
                type.includes(selectedType);

            const matchesSpecialty =
                !selectedSpecialty ||
                specialties.includes(selectedSpecialty);

            return (
                matchesSearch &&
                matchesLocation &&
                matchesType &&
                matchesSpecialty
            );
        });

        // Sort the matching facilities
        visibleFacilities.sort((a, b) => {
            const sortBy = sortSelect.value;

            if (sortBy === "location") {
                return (a.dataset.location || "").localeCompare(
                    b.dataset.location || ""
                );
            }

            return (a.dataset.name || "").localeCompare(
                b.dataset.name || ""
            );
        });

        // Display the matching cards in their sorted order
        visibleFacilities.forEach((facility) => {
            facility.hidden = false;
            facilityList.insertBefore(facility, emptyState);
        });

        // Hide cards that do not match
        facilities.forEach((facility) => {
            if (!visibleFacilities.includes(facility)) {
                facility.hidden = true;
            }
        });

        // Update the results message
        const resultTotal = visibleFacilities.length;
        resultsCount.textContent =
            `Showing ${resultTotal} ${resultTotal === 1 ? "facility" : "facilities"} in Accra and Greater Accra`;

        // Show a helpful message when no facilities match
        emptyState.hidden = resultTotal !== 0;
    }

    // Search button
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            updateFacilities();
        });
    }

    // Update results when filters change
    searchInput.addEventListener("input", updateFacilities);
    locationFilter.addEventListener("change", updateFacilities);
    typeFilter.addEventListener("change", updateFacilities);
    specialtyFilter.addEventListener("change", updateFacilities);
    sortSelect.addEventListener("change", updateFacilities);

    // Reset every filter
    resetButton.addEventListener("click", () => {
        searchInput.value = "";
        locationFilter.value = "";
        typeFilter.value = "";
        specialtyFilter.value = "";
        sortSelect.value = "name";

        updateFacilities();
    });

    // Show all facilities when the page first loads
    updateFacilities();
});



document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("facility-map");
    const facilityList = document.getElementById("facility-list");

    if (!mapElement || typeof L === "undefined" || !facilityList) {
        console.warn("Find Care map could not be initialized.");
        return;
    }

    // Create the map centred on Accra.
    const map = L.map(mapElement).setView([5.6037, -0.1870], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // These are approximate testing coordinates.
    // Verify exact locations before using this for navigation.
    const mapFacilities = [
        {
            name: "Korle Bu Teaching Hospital",
            location: "Korle Bu, Accra",
            coordinates: [5.5352, -0.2258],
            website: "https://www.kbth.gov.gh/"
        },
        {
            name: "Greater Accra Regional Hospital (Ridge)",
            location: "Ridge, Accra",
            coordinates: [5.5650, -0.1980],
            website: "https://garh.gov.gh/"
        },
        {
            name: "University of Ghana Medical Centre",
            location: "Legon, Accra",
            coordinates: [5.6510, -0.1960],
            website: "https://ugmedicalcentre.org/"
        }
    ];

    const markers = new Map();

    // Create a marker for each facility.
    mapFacilities.forEach((facility) => {
        const marker = L.marker(facility.coordinates).addTo(map);

        marker.bindPopup(`
            <strong>${facility.name}</strong><br>
            ${facility.location}<br>
            <a href="${facility.website}"
               target="_blank"
               rel="noopener noreferrer">
                Official website
            </a>
        `);

        markers.set(facility.name.toLowerCase(), {
            marker,
            coordinates: facility.coordinates
        });
    });

    // Match each facility card to its map marker.
    function getMarkerForCard(card) {
        const cardName = (card.dataset.name || "").toLowerCase();

        for (const [name, data] of markers) {
            if (name === cardName) {
                return data;
            }
        }

        return null;
    }

    // Focus the map on the facilities currently displayed.
    function focusVisibleFacilities() {
        const visibleCards = Array.from(
            facilityList.querySelectorAll(".find-care-card")
        ).filter((card) => !card.hidden);

        const matchingMarkers = visibleCards
            .map(getMarkerForCard)
            .filter(Boolean);

        if (matchingMarkers.length === 0) {
            return;
        }

        if (matchingMarkers.length === 1) {
            const item = matchingMarkers[0];
            map.setView(item.coordinates, 15);
            item.marker.openPopup();
            return;
        }

        const bounds = L.latLngBounds(
            matchingMarkers.map((item) => item.coordinates)
        );

        map.fitBounds(bounds, {
            padding: [30, 30],
            maxZoom: 13
        });
    }

    // Clicking a facility card focuses its marker.
    facilityList.addEventListener("click", (event) => {
        const card = event.target.closest(".find-care-card");

        if (!card || card.hidden) {
            return;
        }

        const item = getMarkerForCard(card);

        if (item) {
            map.setView(item.coordinates, 15);
            item.marker.openPopup();
        }
    });

    // Recheck the map after search or filters change.
    const searchControls = [
        document.getElementById("facility-search"),
        document.getElementById("facility-location"),
        document.getElementById("facility-type"),
        document.getElementById("facility-specialty"),
        document.getElementById("facility-sort"),
        document.getElementById("facility-reset-button")
    ];

    searchControls.forEach((control) => {
        if (control) {
            control.addEventListener("input", focusVisibleFacilities);
            control.addEventListener("change", focusVisibleFacilities);
            control.addEventListener("click", () => {
                window.setTimeout(focusVisibleFacilities, 0);
            });
        }
    });

    window.setTimeout(() => {
        map.invalidateSize();
        focusVisibleFacilities();
    }, 150);
});
