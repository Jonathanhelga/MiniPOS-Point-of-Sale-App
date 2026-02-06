export function pressAddItemButton(){
    document.getElementById('js-item-create-open').addEventListener('click', function (){
        OpenCloseModal('item-create-modal');
        console.log("open item create button is clicked");
    })
    
}