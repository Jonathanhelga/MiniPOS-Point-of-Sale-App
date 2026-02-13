import { loginUser, registerUser, submitSettingsData } from "./firebase";
let emailFinal = '';
let passFinal = '';
let usernameFinal = '';

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
        buttonVerification.textContent = "Sending Verification Check Your Email";
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
                buttonVerification.disabled = false;
                buttonVerification.classList.add('is-active');
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Could not connect to server.");
            buttonVerification.disabled = false;
            buttonVerification.classList.add('is-active');
        }
    })
    buttonSignUp.addEventListener('click', async function(){
        e.preventDefault();
        const verificationInput = document.getElementById('js-verification-code').value.trim();
        if(Number(verificationInput) == generatedOtp){ 
            console.log("OTP Match! Proceeding..."); 
            try {
                buttonSignUp.disabled = true;
                buttonSignUp.textContent = "Creating Account...";
                const userCredential = await registerUser(emailFinal, passFinal, usernameFinal);
                console.log("User Created:", userCredential);
            } catch (error) {
                alert(error.message);
                buttonSignUp.disabled = false;
            }
        } else { 
            console.log("Wrong OTP.");
            alert("Incorrect Code");
        }
        buttonSignUp.textContent = "Account Successfully Created.";
    })
}
export function initSignUpLogic(){
    checkVerificationButton();
    ifButtonIsClicked();
    const inputs = ['js-username', 'js-email', 'js-password'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', checkVerificationButton);
    });
    document.getElementById('js-verification-code').addEventListener('input', checkSignInButton);

    const submitSettingButton = document.getElementById('js-submit-setting');
    if(submitSettingButton){
        submitSettingButton.addEventListener('click', submitSettingForm);
    }
}

async function submitSettingForm(){
    const submitSettingButton = document.getElementById('js-submit-setting');

    const formData = {
        username: document.getElementById('js-username').value,
        businessName: document.getElementById('business-name').value,
        businessAddress: document.getElementById('business-address').value,
        businessPhone: document.getElementById('business-phone').value,
        businessInst: document.getElementById('business-instagram').value,
        businessEmail: document.getElementById('business-email').value,
        tax_rate: document.getElementById('tax-rate').value,
        invoice_prefix: document.getElementById('invoice-prefix').value,
        paper_size: document.getElementById('paper-size').value,
        receipt_footer: document.getElementById('receipt-footer-message').value,
    }
    const originalText = submitSettingButton.textContent;
    submitSettingButton.textContent = "saving...";
    submitSettingButton.disabled = true;

    try {
        await submitSettingsData(formData);
        submitSettingButton.textContent = "Submit Successfully";
        
    } catch (error) {
        console.error("Submitting failed:", error);
        alert(error?.message || 'Submitting failed');
        submitSettingButton.disabled = false;
        submitSettingButton.textContent = originalText;
    }
}

export function initUserLogin() {
    const loginButton = document.getElementById('js-login-submit');
    const emailInput = document.getElementById('js-login-identifier');
    const passwordInput = document.getElementById('js-login-password');
    
    if (!loginButton || !emailInput || !passwordInput) return;

    const validate = () => {
        const hasValues = emailInput.value.trim() && passwordInput.value.trim();
        loginButton.disabled = !hasValues;
    };

    emailInput.addEventListener('input', validate);
    passwordInput.addEventListener('input', validate);
    validate(); 

    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const originalText = loginButton.textContent;
        loginButton.textContent = "Verifying...";
        loginButton.disabled = true;

        try {
            await loginUser(email, password);
        } catch (error) {
            console.error("Sign in failed:", error);
            alert(error?.message || 'Sign in failed');
            loginButton.disabled = false;
            loginButton.textContent = originalText;
        }
    });
}