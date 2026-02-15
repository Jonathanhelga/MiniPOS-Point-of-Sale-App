import { LogOutUser } from "./firebase";
import { initInventoryForm } from './add_item_ui';
import { loadAllItems, initializeSearch } from './search_item';

export function renderLoggedInState(user) {
    const container = document.getElementById('js-wizard__body');
    const loggedInTemplate = document.getElementById('logged-in-wizard-template');
    const wizardFooter = document.getElementById('js-wizard__footer');
    
    const stepTitle = document.getElementById('js-wizard-step-indicator');
    if (stepTitle) { stepTitle.classList.add('is-hidden');} 
    else { console.warn('Element js-wizard-step-indicator not found'); }
    const titleEl = document.getElementById('js-setup-step-title');
    titleEl.innerText = "Hi New User"
    
    const clone = loggedInTemplate.content.cloneNode(true);
    wizardFooter.classList.add('is-hidden');

    const emailDisplay = clone.querySelector('.js-user-email-display');
    if(emailDisplay) { emailDisplay.textContent = user.email; }
    
    const logoutBtn = clone.querySelector('.js-logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await LogOutUser(); 
            window.location.reload();
        });
    }
    container.innerHTML = ''; 
    container.appendChild(clone);
}


export function renderLoggedInState2(user) {
    initInventoryForm();
    loadAllItems();
    initializeSearch();
}