import '../styles/variables.css';
import '../styles/setupWizard.css';
import '../styles/container.css';
import '../styles/add_item_modal.css';
import '../styles/features_modal.css';
import '../styles/item_button.css';
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { switchView, eventDelegation } from "./control_wizard";
import { renderLoggedInState2 } from "./loggedIn-user";
import { modal_handler } from './modal-handler';

document.addEventListener('DOMContentLoaded', function(){
    eventDelegation('js-wizard__body');
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const wizard = document.getElementById('setup-wizard');
            const container = document.getElementById('pos-app');
            container.classList.add('is-active');
            wizard.classList.add('is-hidden');
            renderLoggedInState2(user);
        } else {
            const wizard = document.getElementById('setup-wizard');
            wizard.classList.add('is-active');
            setTimeout(()=> {console.log('wait for wizard rendering');}, 300);
            switchView('signUp');
        }
    });
    modal_handler();// Open and close modal controller
});