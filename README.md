CineFlow: Visual Reference Manager

//____Project Overview____//

I developed CineFlow as a production suite designed specifically for filmmakers and visual artists. The application serves as a "Visual Reference Manager," allowing users to organize shot lists, mood boards, and documentary concepts in one centralized dashboard. My goal was to create a tool that bridges the gap between creative inspiration and organized production planning.




//___Features & Functionality___//
In alignment with the Coding Sprint requirements, the app includes:

• Dynamic Dashboard: A central hub that renders project cards using Vanilla JavaScript.

• Persistent Storage: I implemented localStorage so that all boards, projects, and archives are saved directly in the browser, ensuring no data is lost upon refreshing.

• Full CRUD Operations: Users can Create new entries, Read/View existing ones, Update (Edit) details, and Delete (Remove) items with a safety confirmation.

• Instant Search: A reactive search bar that filters through titles, moods, and notes in real-time as the user types.

• Image Management: Users can either provide an image URL or upload a local file, which the app processes using FileReader technology.



//___Technical Implementation___//
Following the Vanilla JavaScript, HTML, and CSS mandate, I focused on the following core areas:

• DOM Manipulation: I used JavaScript to dynamically build and inject HTML into the grid, ensuring the UI stays in sync with the data.

• Event Handling: The app responds to multiple event types, including clicks for navigation, input for searching, and form submissions for data entry.

• Single Page Logic: I designed the app to function as a Single Page Application (SPA), where JavaScript toggles the visibility of different sections (Dashboard, Projects, Archives) without needing to reload the page.



//___Reflections & Challenges___//

One of the most significant technical choices I made was using Base64 encoding for image uploads. This allowed me to meet the "Developer" goal of creating a functional prototype that handles local media without needing a complex backend database. The biggest challenge was managing the state of the app during the Testing and Feedback phase to ensure that counters and cards updated instantly across all categories.