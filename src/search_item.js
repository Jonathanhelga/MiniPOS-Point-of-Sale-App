import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { renderItemGrid } from './item_ui';

let allItems = [];
function normalizeText(text){ return String(text || '').toLowerCase().trim(); }

export async function loadAllItems() {
    try {
        const q = query(collection(db, "inventory"), orderBy("itemName"));
        const querySnapshot = await getDocs(q);
        allItems = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Total Items Loaded:", allItems.length);
        console.table(allItems); // Displays your data in a clean table format
        
        renderItemGrid(allItems);
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

