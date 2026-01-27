import '../styles/variables.css';
import '../styles/setupWizard.css';
import '../styles/container.css';
import '../styles/add_item_modal.css';
import '../styles/features_modal.css';
import '../styles/item_button.css';
import { initializeWizard } from "./setup_wizard";
import { modal_handler } from './modal-handler';
// import { handleNewUser, renderLoggedInState, renderGuestState } from './handle_newUser';
// import { monitorAuthState } from "./firebase";

document.addEventListener('DOMContentLoaded', function(){

    initializeWizard();
    // controlWizardFormPageDirection();
    modal_handler();// Open and close modal controller
});