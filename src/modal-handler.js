export function toggleModal(idName){
    const modal = document.getElementById(idName);
    const handleBackdropClick = (event) => { 
        if (event.target === modal) toggleModal(idName); 
    };

    if(modal.classList.contains('is-hidden')){  
        modal.classList.remove('is-hidden'); 
        modal.addEventListener('click', handleBackdropClick);
    }

    else { 
        modal.classList.add('is-closing-rightModal');
        modal.addEventListener('animationend', function() {
            modal.classList.add('is-hidden');
            modal.classList.remove('is-closing-rightModal');
            modal.onclick = null;
        }, { once: true });
        modal.removeEventListener('click', handleBackdropClick);
    }
}

export function modal_handler(){
    document.getElementById('js-item-create-open').addEventListener('click', function (){
        toggleModal('item-create-modal');
        console.log("button is clicked");
    });

    document.getElementById('js-features-open').addEventListener('click', function (){
        toggleModal('features-modal');
        console.log("button is clicked");
    });

    const closeButtons = document.querySelectorAll('.c-modal__close');
    closeButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            // Get the specific ID for this specific button
            const modalId = e.target.getAttribute('data-modal-close');
            toggleModal(modalId);
        });
    });
}   
    
