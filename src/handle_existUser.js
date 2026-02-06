function checkInputColumns(){
    const email = document.getElementById('js-login-identifier');
    const password = document.getElementById('js-login-password');
    if (email && password ){ buttonVerification.disabled = false; }
    else { buttonVerification.disabled = true; }
}