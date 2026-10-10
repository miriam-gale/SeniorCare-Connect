# SeniorCare Connect

**A responsive health and caregiving platform designed to help older adults, family members, and caregivers organise health information and find care resources.**

## About the Project

SeniorCare Connect is a front-end web application prototype focused on supporting everyday caregiving. It brings key health-management tools together in one place, with a responsive interface and role-based dashboard shortcuts.

The project is a prototype for demonstration and learning purposes. It does not replace professional medical advice, diagnosis, or treatment.

## Features

- **Role-based dashboards:** Dashboard shortcuts tailored to Care Recipients, Family Members, Caregivers, and Healthcare Providers.
- **Prototype sign-in and sign-out:** Enter a name, email address, and role to try the interface.
- **Medication management:** Add and manage medication information.
- **Symptom tracking:** Record symptoms and review symptom history and visualisations.
- **Allergy management:** Record and manage allergy information.
- **Triage guidance:** Answer guided questions to view general urgency guidance.
- **Find Care:** Search and filter care options, with a map displaying sample locations.
- **Health Report:** View a summary generated from information recorded in the prototype.
- **Healthcare Provider directory:** Browse sample provider profiles and save care-team selections.
- **Profile management:** Edit profile details and choose a role.
- **Responsive layout:** Designed to adapt to desktop and smaller screens.

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Local Storage for prototype profile and feature data
- Leaflet and OpenStreetMap for the Find Care map
- Chart.js for symptom visualisations

## Project Structure

```text
seniorcare-connect/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── account-menu.js
│   ├── profile.js
│   ├── role-views.js
│   ├── sign-in.js
│   ├── medications.js
│   ├── symptoms.js
│   ├── allergies.js
│   ├── triage.js
│   ├── find-care.js
│   └── healthcare-provider.js
├── pages/
│   ├── profile.html
│   ├── sign-in.html
│   ├── medications.html
│   ├── symptoms.html
│   ├── allergies.html
│   ├── triage.html
│   ├── find-care.html
│   ├── health-report.html
│   ├── healthcare-provider.html
│   └── about.html
├── images/
└── README.md
```

*This tree illustrates the main project structure. If a filename differs in your current folder, keep the actual filename used by your project.*

## Getting Started

### Requirements

- A modern web browser
- Visual Studio Code (recommended)
- The Live Server extension for VS Code (recommended)

### Run Locally

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` with Live Server, or serve the project using another local web server.
4. Use the navigation menu to explore the pages and features.

Using a local server is recommended because relative links and browser features may behave differently when HTML files are opened directly from the file system.

## Trying the Prototype Sign-In

1. Open the **Sign In** option in the account menu.
2. Enter a display name and email address.
3. Choose one of the available roles:
   - Care Recipient
   - Family Member
   - Caregiver
   - Healthcare Provider
4. Continue to the homepage and explore the role-specific dashboard shortcuts.
5. Use **Sign Out** to remove the saved prototype profile.

No real account is created. The sign-in form is a demonstration flow and does not verify a user's identity.

## Data and Privacy Notes

This prototype stores profile and feature information in the browser's `localStorage`. Data is browser- and origin-specific and may remain on the device until it is cleared or removed by the application.

- Clearing browser local storage can remove saved prototype information.
- The prototype does not provide production-grade authentication or server-side access control.
- Role-based dashboards change the interface and shortcuts; they do not securely restrict access to health data.
- Do not enter real or sensitive personal health information into this demonstration.

## Medical Safety Notice

The triage feature provides general informational guidance only. It is not a medical diagnosis and should not be used as a substitute for a qualified healthcare professional or emergency services. If someone may be experiencing a medical emergency, contact local emergency services or seek urgent medical care.

Provider profiles and care locations shown in the prototype may be sample data. Verify provider credentials, contact details, availability, and location independently before relying on them.

## Future Improvements

Potential future development includes:

- Secure authentication and role-based authorisation
- A secure backend and database
- Stronger privacy protections for health information
- Verified healthcare provider and location data
- Automated testing and improved accessibility checks

## Project Repository

[SeniorCare Connect on GitHub](https://github.com/miriam-gale/SeniorCare-Connect)

## Author

Developed as a web technology project by **Miriam Wepiya Gale**.

---

*SeniorCare Connect is an educational prototype and is not intended for production healthcare use.*
