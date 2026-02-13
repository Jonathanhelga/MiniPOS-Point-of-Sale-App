function renderItemGrid(items){}
export function createItemButton(container, item){
    // let container = document.getElementById('item-grid');
    let template = document.getElementById('item-button-template');

    if (!template) return;

    const clone = template.content.cloneNode(true);
    const button = clone.querySelector('.c-item-button');
    const label = clone.querySelector('.c-item-button__label');
    label.textContent = item.itemName;

    if (item.tagColor) { button.classList.add(`btn--${item.tagColor}`);} 
    else { button.classList.add('btn--neutral'); }
    container.appendChild(clone);
}

function handleSearchInput(event){}
function updateSearchStats(count, query){}
function openOrderPanel(item){}