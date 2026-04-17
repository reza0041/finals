/**
 * CINEFLOW - PRODUCTION SUITE
 * Developer: Ali Rezaie
 * * I view JavaScript as the "brain" of my application. 
 * While HTML builds the skeleton and CSS provides the style, 
 * this script is what actually makes the app alive and interactive.
 */

// --- GLOBAL DATA & STARTER CONTENT ---

// 1. I created this 'starterData' object to act as a fallback. 
// It ensures that when a new user opens the app, they see professional examples 
// instead of an empty, broken-looking screen.
const starterData = {
    boards: [
        {
            title: "GAME OVER (SHORT FILM)",
            mood: "HUMOROUS, ACTION, COMEDY, VIOLENT",
            note: "A 27-year-old man living alone in a cramped studio apartment finds his quiet life shattered when two Russian assassins break in with one mission: to kill him.",
            image: "https://images.pexels.com/photos/7533330/pexels-photo-7533330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
            title: "WHAT AFTER? (SHORT DOCUMENTARY)",
            mood: "INSPIRATIONAL, MOTIVATIONAL",
            note: "This documentary follows a photographer striving to pursue his passion while trapped in the routine of a 9—5 job.",
            image: "https://images.pexels.com/photos/1903935/pexels-photo-1903935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
            title: "AI IS TAKING OVER",
            mood: "SCI-FI",
            note: "A chilling look at a world where artificial intelligence begins to blur the line between tool and controller.",
            image: "https://images.pexels.com/photos/17483848/pexels-photo-17483848/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-depicts-the-process-of-machine-learning-it-was-created-by-artist-vincent-schwenk-as-part-of-the-visual-exploring-ai-e.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        }
    ],
    projects: [],
    archives: []
};

// 2. I use 'localStorage' to make the app persistent. 
// I'm checking if the browser already has data saved; if not, I load my starter cards.
// I use JSON.parse because localStorage only stores strings, and I need an object.
let data = JSON.parse(localStorage.getItem('cineflow_data')) || starterData;

// I'm using these as "global trackers" for when I upload a file or type into the search bar.
let uploadedImageBase64 = "";
let currentSearchTerm = ""; 

// --- SELECTORS ---

// 3. Here, I am "linking" my JavaScript to my HTML. 
// I grab the buttons, the search bar, and the modal so I can listen for user actions.
const pages = document.querySelectorAll('.page-content');
const navItems = document.querySelectorAll('.nav__item');
const addForm = document.getElementById('app-modal-form');
const fileInput = document.getElementById('imageFile');
const modal = document.getElementById('app-modal');
const searchInput = document.getElementById('global-search');

// --- NAVIGATION LOGIC ---

// 4. I wrote this loop to handle page switching. 
// Instead of loading new URLs, I'm just hiding and showing different <div> sections.
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); // I stop the browser from trying to navigate away.
        const targetPage = item.getAttribute('data-page'); // I identify which page the user clicked.
        
        // I remove the "active" highlight from all links and add it only to the one I just clicked.
        navItems.forEach(nav => nav.classList.remove('nav__item--active'));
        item.classList.add('nav__item--active');
        
        // I loop through my sections and use the 'hidden' attribute to only show the target page.
        pages.forEach(page => page.hidden = (page.id !== `page-${targetPage}`));
        
        // I update the big <h1> at the top of the page so the user knows where they are.
        document.getElementById('current-page-title').textContent = targetPage.charAt(0).toUpperCase() + targetPage.slice(1);
        
        renderAll(); // I re-run my render function to ensure the correct list is shown.
    });
});

// --- SEARCH FUNCTIONALITY ---

// 5. I added this listener to my search bar to make the app feel fast.
// Every time a user types a single letter, I update my search term and refresh the view.
searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase(); 
    renderAll(); 
});

// --- RENDERING ENGINE ---

// 6. This is the "factory" function I built to actually put cards on the screen.
// I designed it to be reusable for the Dashboard, Projects, and Archive sections.
function renderGrid(containerId, list, categoryKey) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // I clear out the old HTML first to prevent the list from doubling up.

    // I filter the data here. If the user typed something, I only keep items that match.
    const filteredList = list.filter(item => 
        item.title.toLowerCase().includes(currentSearchTerm) || 
        item.note.toLowerCase().includes(currentSearchTerm) ||
        item.mood.toLowerCase().includes(currentSearchTerm)
    );

    // If my filter results in zero items, I display a helpful "Nothing found" message.
    if (filteredList.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>${currentSearchTerm ? 'No matches found.' : 'Nothing here yet.'}</p></div>`;
        return;
    }

    // For every item in my list, I generate a block of HTML and "inject" it into the container.
    filteredList.forEach((item) => {
        const originalIndex = list.indexOf(item); 
        
        const card = document.createElement('div');
        card.className = 'dashboard-card';
        card.innerHTML = `
            <div class="dashboard-card__image">
                <img src="${item.image}" alt="${item.title}">
                <span class="tag">${item.mood}</span>
            </div>
            <div class="dashboard-card__body">
                <h3>${item.title}</h3>
                <p>${item.note}</p>
                <div class="card-actions">
                    <button class="button-secondary" onclick="openEditModal('${categoryKey}', ${originalIndex})">EDIT</button>
                    <button class="button-danger" onclick="deleteItem('${categoryKey}', ${originalIndex})">REMOVE</button>
                </div>
            </div>
        `;
        container.appendChild(card); // I add the finished card to the grid.
    });
}

// 7. This is my "Master Render" function. 
// It refreshes all grids, updates the stat counters, and saves the current state to the browser.
function renderAll() {
    renderGrid('dashboard-grid', data.boards, 'boards');
    renderGrid('projects-grid', data.projects, 'projects');
    renderGrid('archive-grid', data.archives, 'archives');
    
    // I update the "Board" and "Project" count at the top so the user sees their progress.
    if(document.getElementById('stat-boards')) document.getElementById('stat-boards').textContent = data.boards.length;
    if(document.getElementById('stat-projects')) document.getElementById('stat-projects').textContent = data.projects.length;
    
    // I save my 'data' object as a string so it stays in the browser even if I close the tab.
    localStorage.setItem('cineflow_data', JSON.stringify(data));
}

// --- CORE UTILITIES ---

// 8. I implemented this to handle local file uploads. 
// I use 'FileReader' to convert a physical file into a long string of text (Base64) that my app can store.
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => { uploadedImageBase64 = reader.result; };
    if (file) reader.readAsDataURL(file);
});

// 9. When I click "Edit", I use this function to pop open the modal.
// I use "dataset" attributes to tell the form exactly which item I am currently changing.
function openEditModal(category, index) {
    const item = data[category][index];
    addForm.dataset.mode = "edit";
    addForm.dataset.editIndex = index;
    addForm.dataset.editCategory = category;

    // I pre-fill the form fields with the existing data so I don't have to re-type it.
    document.getElementById('form-title').value = item.title;
    document.getElementById('form-mood').value = item.mood;
    document.getElementById('form-category').value = category;
    document.getElementById('form-imageURL').value = item.image.startsWith('data:') ? '' : item.image;
    document.getElementById('form-note').value = item.note;
    
    document.getElementById('modal-title').textContent = "Edit Item";
    modal.hidden = false;
}

// 10. I built this 'deleteItem' function with a safety 'confirm' box. 
// If the user agrees, I use 'splice' to remove that specific entry from my data array.
function deleteItem(category, index) {
    if(confirm("Are you sure you want to delete this?")) {
        data[category].splice(index, 1);
        renderAll();
    }
}

// 11. This is the logic for my "Save" button. 
// It handles both adding brand-new items and updating existing ones.
addForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const formData = new FormData(addForm);
    const category = formData.get('category');
    const mode = addForm.dataset.mode;

    // I construct a 'newItem' object from whatever the user typed into the form.
    const newItem = {
        title: formData.get('title'),
        mood: formData.get('mood'),
        note: formData.get('note'),
        // I use a logic chain here: use the upload if available, then the URL, then a fallback image.
        image: uploadedImageBase64 || formData.get('imageURL') || (mode === 'edit' ? data[addForm.dataset.editCategory][addForm.dataset.editIndex].image : 'https://picsum.photos/400/300')
    };

    if (mode === "edit") {
        // If I'm editing, I remove the old version and insert the new one into the correct category.
        data[addForm.dataset.editCategory].splice(addForm.dataset.editIndex, 1);
        data[category].push(newItem);
    } else {
        // If I'm adding, I just push it into the chosen array.
        data[category].push(newItem);
    }

    resetModal(); // I clear the form so it's ready for next time.
    renderAll(); // I refresh the entire UI to show the changes.
});

// I wrote this helper to reset my modal variables and hide the popup.
function resetModal() {
    addForm.reset();
    addForm.dataset.mode = "add";
    document.getElementById('modal-title').textContent = "Add to Dashboard";
    uploadedImageBase64 = "";
    modal.hidden = true;
}

// I added these simple listeners to handle the opening and closing of the popup.
document.getElementById('open-add-modal').onclick = () => { resetModal(); modal.hidden = false; };
document.getElementById('close-modal-btn').onclick = () => modal.hidden = true;
document.getElementById('close-modal-bg').onclick = () => modal.hidden = true;

// --- INITIALIZE ---

// 12. Finally, I trigger 'renderAll()' as soon as the page loads. 
// This ensures the user sees their data immediately upon opening the app.
renderAll();