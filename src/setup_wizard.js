import { monitorAuthState } from "./firebase";
import { handleNewUser, renderLoggedInState, renderGuestState } from './handle_newUser';
const step1Container = document.getElementById('setup-step-1');
const buttonPrev = document.getElementById('js-setup-prev');
const buttonNext = document.getElementById('js-setup-next');
let isUserLoggedIn = false;
export function controlWizardFormPageDirection(){
    let currentStep = 1;
    const totalSteps = 4;

    const changeStep = (direction) => {
        if(currentStep <= 1 && direction < 0) return; // Prevent going before step 1
        if(currentStep >= totalSteps && direction > 0) return; // Prevent going beyond step 4
        if (currentStep === 1 && direction > 0 && !isUserLoggedIn) {
            alert("Please verify your email and sign up to proceed.");
            return;
        }
        document.getElementById(`setup-step-${currentStep}`).classList.remove('is-active');
        currentStep += direction;
        document.getElementById(`setup-step-${currentStep}`).classList.add('is-active');
        document.getElementById('setup-step-current').innerText = currentStep;
        const titles = ["Sign Up as a new user", "Store Identity", "Financial Settings", "Printer Setup"];
        document.getElementById('js-setup-step-title').innerText = titles[currentStep - 1];
        document.getElementById('js-setup-prev').style.visibility = (currentStep > 1) ? 'visible' : 'hidden';
        document.getElementById('js-setup-next').innerText = (currentStep === totalSteps) ? 'Finish Setup' : 'Next Step';
    }
    buttonPrev.addEventListener('click', () => changeStep(-1));
    buttonNext.addEventListener('click', () => changeStep(1));  
}

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
            handleNewUser();
        }
    );
    controlWizardFormPageDirection();
}