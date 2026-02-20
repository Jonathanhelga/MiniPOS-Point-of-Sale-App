import { formatRupiah } from "./formatRupiah";
import { allItems } from "./search_item";
import { toggleModal } from './modal-handler';
export function createItemButton(container, item){
    let template = document.getElementById('item-button-template');
    if (!template) return;

    const clone = template.content.cloneNode(true);
    const button = clone.querySelector('.c-item-button');
    if (button.hasAttribute('id')) button.removeAttribute('id');

    button.setAttribute('data-id', item.id);

    const label = clone.querySelector('.c-item-button__label');
    label.textContent = item.itemName;
    button.addEventListener('click', () => { 
        const buttonID = button.getAttribute('data-id');
        openOrderItemModal(buttonID);
        toggleModal('order-item-modal');
    });

    if (item.tagColor) { button.classList.add(`btn--${item.tagColor}`);} 
    else { button.classList.add('btn--neutral'); }

    container.appendChild(clone);
}

function openOrderItemModal(buttonID) {
    const selectedItem = allItems.find(item => item.id === buttonID); 

    if (!selectedItem) {
        console.error("Item data not found for ID:", buttonID);
        return;
    }

    console.log("Opening modal for:", selectedItem.itemName); 
    
    document.getElementById('order-item-name').textContent = selectedItem.itemName;
    document.getElementById('order-item-stock').textContent = selectedItem.stockLevel;
    document.getElementById('order-item-price').textContent = formatRupiah(selectedItem.sellPrice);
    document.getElementById('order-item-unit').textContent = ' ' + selectedItem.unit;
}

export function renderItemGrid(items){
    const container = document.getElementById('item-grid');
    if(!container) return;
    container.innerHTML = '';

    if (items.length === 0) { container.innerHTML = '<p>No items in inventory.</p>'; } 
    else { items.forEach(item => createItemButton(container, item)); }
}


function handleSearchInput(event){}
function updateSearchStats(count, query){}
function openOrderPanel(item){}