import '../styles/variables.css';
import '../styles/setupWizard.css';
import '../styles/container.css';
import '../styles/add_item_modal.css';
import '../styles/features_modal.css';
import '../styles/item_button.css';
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { switchView, eventDelegation } from "./control_wizard";
import { renderLoggedInState } from "./loggedIn-user";
import { modal_handler } from './modal-handler';


document.addEventListener('DOMContentLoaded', function(){
    eventDelegation('js-wizard__body');
    onAuthStateChanged(auth, (user) => {
        if (user) {
            renderLoggedInState(user);
        } else {
            switchView('signUp');
        }
    });
    modal_handler();// Open and close modal controller
});