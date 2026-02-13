import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { createItemButton } from './item_ui';

let allItems = [];
function normalizeText(text){ return String(text || '').toLowerCase().trim(); }

export async function loadAllItems() {
    const container = document.getElementById('item-grid');
    if(!container) return;
    try {
        const q = query(collection(db, "inventory"), orderBy("itemName"));
        const querySnapshot = await getDocs(q);
        allItems = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        container.innerHTML = '';

        console.log("Total Items Loaded:", allItems.length);
        console.table(allItems); // Displays your data in a clean table format
        if (allItems.length === 0) { container.innerHTML = '<p>No items in inventory.</p>'; } 
        else { allItems.forEach(item => createItemButton(container, item)); }
    } 
    catch (error) {  console.error("Error pulling data:", error); }
}

export function addSingleItem(item){
    const container = document.getElementById('item-grid');
    if(!container) return;
    createItemButton(container, item);
}


function updateLocalStock(itemId, quantityChange){
    
}

function syncStockToFirestore(itemId, newQuantity){}

function getAllItems(){}

