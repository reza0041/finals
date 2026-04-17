/**
 * CINEFLOW - PRODUCTION SUITE
 * Developer: Ali Rezaie
 */

// --- GLOBAL DATA & STARTER CONTENT ---

const getInitialFallbackData = () => ({
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

    ],
    projects: [],
    archives: []
});
// --- LOCAL MEMORY ---
const loadPersistentDataFromBrowser = () => {
    return JSON.parse(localStorage.getItem('cineflow_data')) || getInitialFallbackData();
};

let data = loadPersistentDataFromBrowser();
let uploadedImageBase64 = "";
let currentSearchTerm = ""; 

// --- SELECTORS ---

const linkJavaScriptToHTMLElements = () => {
    return {
        pages: document.querySelectorAll('.page-content'),
        navItems: document.querySelectorAll('.nav__item'),
        addForm: document.getElementById('app-modal-form'),
        fileInput: document.getElementById('imageFile'),
        modal: document.getElementById('app-modal'),
        searchInput: document.getElementById('global-search')
    };
};

const elements = linkJavaScriptToHTMLElements();

// --- NAVIGATION LOGIC ---

const handleSinglePageNavigation = () => {
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = item.getAttribute('data-page');
            
            elements.navItems.forEach(nav => nav.classList.remove('nav__item--active'));
            item.classList.add('nav__item--active');
            
            elements.pages.forEach(page => page.hidden = (page.id !== `page-${targetPage}`));
            
            document.getElementById('current-page-title').textContent = 
                targetPage.charAt(0).toUpperCase() + targetPage.slice(1);
            
            refreshApplicationView();
        });
    });
};

// --- SEARCH FUNCTIONALITY ---

const activateRealTimeSearchListener = () => {
    elements.searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase(); 
        refreshApplicationView(); 
    });
};

// --- RENDERING --- (The Factory)

function buildAndInjectCardFactory(containerId, list, categoryKey) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 

    const filteredList = list.filter(item => 
        item.title.toLowerCase().includes(currentSearchTerm) || 
        item.note.toLowerCase().includes(currentSearchTerm) ||
        item.mood.toLowerCase().includes(currentSearchTerm)
    );

    if (filteredList.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>${currentSearchTerm ? 'No matches found.' : 'Nothing here yet.'}</p></div>`;
        return;
    }

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
                    <button class="button-secondary" onclick="prepareModalForEditing('${categoryKey}', ${originalIndex})">EDIT</button>
                    <button class="button-danger" onclick="executeItemDeletion('${categoryKey}', ${originalIndex})">REMOVE</button>
                </div>
            </div>
        `;
        container.appendChild(card); 
    });
}

function refreshApplicationView() {
    buildAndInjectCardFactory('dashboard-grid', data.boards, 'boards');
    buildAndInjectCardFactory('projects-grid', data.projects, 'projects');
    buildAndInjectCardFactory('archive-grid', data.archives, 'archives');
    
    updateStatisticsCounters();
    syncDataToBrowserStorage();
}

const updateStatisticsCounters = () => {
    if(document.getElementById('stat-boards')) document.getElementById('stat-boards').textContent = data.boards.length;
    if(document.getElementById('stat-projects')) document.getElementById('stat-projects').textContent = data.projects.length;
};

const syncDataToBrowserStorage = () => {
    localStorage.setItem('cineflow_data', JSON.stringify(data));
};

// --- CORE UTILITIES --- (Upload Image, Modal Logic, Form Handling)

const convertUploadedFileToBase64String = () => {
    elements.fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => { uploadedImageBase64 = reader.result; };
        if (file) reader.readAsDataURL(file);
    });
};

function prepareModalForEditing(category, index) {
    const item = data[category][index];
    elements.addForm.dataset.mode = "edit";
    elements.addForm.dataset.editIndex = index;
    elements.addForm.dataset.editCategory = category;

    document.getElementById('form-title').value = item.title;
    document.getElementById('form-mood').value = item.mood;
    document.getElementById('form-category').value = category;
    document.getElementById('form-imageURL').value = item.image.startsWith('data:') ? '' : item.image;
    document.getElementById('form-note').value = item.note;
    
    document.getElementById('modal-title').textContent = "Edit Item";
    elements.modal.hidden = false;
}

function executeItemDeletion(category, index) {
    if(confirm("Are you sure you want to delete this?")) {
        data[category].splice(index, 1);
        refreshApplicationView();
    }
}
 // Form submission logic for both adding and editing items //
const processFormSubmissionLogic = () => {
    elements.addForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const formData = new FormData(elements.addForm);
        const category = formData.get('category');
        const mode = elements.addForm.dataset.mode;

        const newItem = {
            title: formData.get('title'),
            mood: formData.get('mood'),
            note: formData.get('note'),
            image: uploadedImageBase64 || formData.get('imageURL') || 
                   (mode === 'edit' ? data[elements.addForm.dataset.editCategory][elements.addForm.dataset.editIndex].image : 'https://picsum.photos/400/300')
        };

        if (mode === "edit") {
            data[elements.addForm.dataset.editCategory].splice(elements.addForm.dataset.editIndex, 1);
            data[category].push(newItem);
        } else {
            data[category].push(newItem);
        }

        resetModalState(); 
        refreshApplicationView(); 
    });
};

function resetModalState() {
    elements.addForm.reset();
    elements.addForm.dataset.mode = "add";
    document.getElementById('modal-title').textContent = "Add to Dashboard";
    uploadedImageBase64 = "";
    elements.modal.hidden = true;
}

const setupModalVisibilityControls = () => {
    document.getElementById('open-add-modal').onclick = () => { resetModalState(); elements.modal.hidden = false; };
    document.getElementById('close-modal-btn').onclick = () => elements.modal.hidden = true;
    document.getElementById('close-modal-bg').onclick = () => elements.modal.hidden = true;
};

// --- INITIALIZE --- // Necessary to kickstart the application and bind all event listeners after defining them.

const initializeApplication = () => {
    handleSinglePageNavigation();
    activateRealTimeSearchListener();
    convertUploadedFileToBase64String();
    processFormSubmissionLogic();
    setupModalVisibilityControls();
    refreshApplicationView();
};

initializeApplication();