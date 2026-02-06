import { eventDelegation } from "./control_wizard";
import { monitorAuthState } from "./firebase";
import { handleNewUser, renderLoggedInState, renderGuestState } from './handle_newUser';

let isUserLoggedIn = false;
export async function initializeWizard(){
    monitorAuthState(
        async (user) => { 
            isUserLoggedIn = true;
            console.log("user signed in");
            await renderLoggedInState(user); 
        },
        async () => {
            isUserLoggedIn = false; 
            console.log("user doesn't sign up yet");
            await renderGuestState();
            eventDelegation('js-wizard__body')
            handleNewUser();
            // controlSignUpWizardPageDirection();
        }
    );
}