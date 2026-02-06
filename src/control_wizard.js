import { initUserLogin, initSignUpLogic } from "./auth-handler";

function controlSignUpWizardPageDirection(){
    const buttonPrev = document.getElementById('js-setup-prev');
    const buttonNext = document.getElementById('js-setup-next');
    let currentStep = 1;
    const totalSteps = 4;

    const changeStep = (direction) => {
        if(currentStep <= 1 && direction < 0) return; // Prevent going before step 1
        if(currentStep >= totalSteps && direction > 0) return; // Prevent going beyond step 4
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

function controlLogInWizard(){
    document.getElementById('js-wizard-step-indicator').style.display = 'none';
    document.getElementById('js-wizard-login-header').style.display = 'block';
    document.getElementById('js-setup-step-title').style.display = 'none';
}

function controlSignUpWizard(){
    document.getElementById('js-wizard-step-indicator').style.display = 'block';
    document.getElementById('js-wizard-login-header').style.display = 'none';
    document.getElementById('js-setup-step-title').style.display = 'block';
}

export function switchView(targetView){
    const container = document.getElementById('js-wizard__body');
    const footer = document.getElementById('js-wizard__footer');
    let template = null;
    if(targetView === 'logIn'){
        template = document.getElementById('login-wizard-template');
        footer.classList.add('is-hidden')
        controlLogInWizard();
        // initUserLogin();
    }
    else if(targetView === 'signUp'){
        template = document.getElementById('guest-wizard-template');
        footer.classList.remove('is-hidden');
        controlSignUpWizard();
        controlSignUpWizardPageDirection();
        // initSignUpLogic();
    }
    if (!template) {
        console.warn('switchView: no template found for', targetView);
        return;
    }
    const clone = template.content.cloneNode(true);
    container.innerHTML = '';
    container.appendChild(clone);
    if(targetView === 'logIn'){ initUserLogin(); }
    else if(targetView === 'signUp'){ initSignUpLogic();    }
}

export function eventDelegation(containerID){
    const mainContainer = document.getElementById(containerID);
    switchView('signUp');
    mainContainer.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'js-to-signUp') {
            e.preventDefault();
            console.log("Switching to Sign Up...");
            switchView('signUp');
        }
        else if (e.target && e.target.id === 'js-to-logIn') {
            e.preventDefault();
            console.log("Switching to Log In...");
            switchView('logIn');
        }
    })
}