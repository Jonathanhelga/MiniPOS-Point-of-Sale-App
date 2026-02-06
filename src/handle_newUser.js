import { SignUpNewUser, LogOutUser } from "./firebase";

let emailFinal = '';
let passFinal = '';
let usernameFinal = '';
export function renderLoggedInState(user) {
    const container = document.getElementById('js-wizard__body');
    const loggedInTemplate = document.getElementById('logged-in-wizard-template');
    const clone = loggedInTemplate.content.cloneNode(true);
    
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
export function renderGuestState(){
    const container = document.getElementById('js-wizard__body');
    const GuestTemplate = document.getElementById('guest-wizard-template');
    const clone = GuestTemplate.content.cloneNode(true);
    container.innerHTML = ''; 
    container.appendChild(clone);
}

function checkVerificationButton() {
    const username = document.getElementById('js-username').value.trim();
    const email = document.getElementById('js-email').value.trim();
    const pass = document.getElementById('js-password').value.trim();
    const buttonVerification = document.getElementById('js-email-verify');
    const buttonSignUp = document.getElementById('js-signup-submit');
    if(buttonSignUp.classList.contains('is-active')){
        buttonSignUp.classList.remove('is-active')
        buttonVerification.classList.add('is-active')
        buttonVerification.disabled = true;
        buttonSignUp.disabled = true;
    }
    if (username && email && pass){ buttonVerification.disabled = false; }
    else { buttonVerification.disabled = true; }
}

function checkSignInButton(){
    const verification = document.getElementById('js-verification-code').value.trim();
    const buttonSignUp = document.getElementById('js-signup-submit');
    if(verification){  buttonSignUp.disabled = false; }
    else{ buttonSignUp.disabled = true; }
}

function ifButtonIsClicked(){
    const buttonVerification = document.getElementById('js-email-verify');
    const buttonSignUp = document.getElementById('js-signup-submit');
    let generatedOtp = null;
    buttonVerification.addEventListener('click', async function (event){
        buttonVerification.disabled = true;
        buttonVerification.textContent = "sending verification...PLS check your Email";
        emailFinal =  document.getElementById('js-email').value.trim();
        passFinal = document.getElementById('js-password').value.trim();
        usernameFinal = document.getElementById('js-username').value.trim();
        console.log("Requesting OTP for:", emailFinal);
        try {
            const response = await fetch('http://localhost:3000/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailFinal })
            });
            const data = await response.json();
            if(response.ok){
                console.log("Server says:", data.message);
                buttonSignUp.classList.add('is-active');
                buttonSignUp.disabled = true;
                // IMPORTANT: In a real app, don't return the OTP to the frontend here.
                // The verification should happen on the server.
                generatedOtp = data.otp;
                buttonVerification.classList.remove('is-active');
            }
            else{ 
                console.log("Server says error:", data.error); 
                buttonVerification.disabled = false; // Let them try again
                buttonVerification.classList.add('is-active');
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Could not connect to server.");
            buttonVerification.disabled = false;
            buttonVerification.classList.add('is-active');
        }
    })
    buttonSignUp.addEventListener('click', async function(event){
        const verificationInput = document.getElementById('js-verification-code').value.trim();
        if(Number(verificationInput) == generatedOtp){ 
            console.log("OTP Match! Proceeding..."); 
            const userCredential = await SignUpNewUser(emailFinal, passFinal, usernameFinal);
            console.log("User Created:", userCredential);
            buttonSignUp.disabled = true;
            buttonSignUp.textContent = "Account Successfully Created.";
        } else { 
            console.log("Wrong OTP.");
            alert("Incorrect Code");
        }
    })
}
export function handleNewUser(){
    const inputs = ['js-username', 'js-email', 'js-password'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', checkVerificationButton);
    });
    document.getElementById('js-verification-code').addEventListener('input', checkSignInButton);
    checkVerificationButton();
    ifButtonIsClicked();
}

export async function addUsername(user, username){
    try{
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            tax_rate: 0,
            invoice_prefix: "INV-",
            printer_size: 80,
            created_at: new Date().toISOString(),
            ownerId: user.uid
        }, { merge: true });

        console.log("Firestore Profile Created for UID:", user.uid);
    }catch(error){
        console.error("Database Write Failed:", error.message);
    }
}
