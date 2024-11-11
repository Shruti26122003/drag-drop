const item = document.querySelector('.item');
const boxes = document.querySelectorAll('.box');
const deleteZone = document.getElementById('deleteZone');
const modal = document.getElementById('modal');
const bringBackButton = document.getElementById('bringBackButton');
const listItems = document.querySelectorAll('.list-item');
const previewButton = document.getElementById('previewButton');
let draggedItem = null;
let draggedTarget = null;

// Store the original parent and position index of the "Drag me" button
let originalParent = item.parentElement;
let originalIndex = Array.from(originalParent.children).indexOf(item);

// Drag functionality for main item
item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => e.target.classList.add('hide'), 0);
});

item.addEventListener('dragend', () => {
    previewButton.style.visibility = 'visible';  // Ensure preview button is visible after drag ends
});

// Add events to each box
boxes.forEach((box) => {
    box.addEventListener('dragenter', dragEnter);
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', (e) => drop(e, box));
});

// Delete Zone drag events
deleteZone.addEventListener('dragenter', dragEnter);
deleteZone.addEventListener('dragover', dragOver);
deleteZone.addEventListener('dragleave', dragLeave);
deleteZone.addEventListener('drop', deleteDrop);

// Drag events for reorderable list items
listItems.forEach((listItem) => {
    listItem.addEventListener('dragstart', listDragStart);
    listItem.addEventListener('dragenter', dragEnter);
    listItem.addEventListener('dragover', dragOver);
    listItem.addEventListener('dragleave', dragLeave);
    listItem.addEventListener('drop', listDrop);
});

// List item drag start
function listDragStart(e) {
    draggedItem = e.target;
}

// Delete drop event
function deleteDrop(e) {
    e.target.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    // Hide the draggable item and show modal
    draggable.style.display = 'none';
    showModal();
}

// Show modal function
function showModal() {
    modal.style.display = 'flex';
}

// Hide modal and bring back the draggable item
bringBackButton.addEventListener('click', () => {
    modal.style.display = 'none';
    
    // Restore the "Drag me" button to its original parent and position
    const children = Array.from(originalParent.children);
    if (children[originalIndex]) {
        originalParent.insertBefore(item, children[originalIndex]);
    } else {
        originalParent.appendChild(item);
    }
    item.style.display = 'inline-block';

    // Make sure the preview button is visible
    previewButton.style.visibility = 'visible';
});

// Drag events
function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

// Drop event for boxes
function drop(e, box) {
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    // Add the draggable item to the drop zone
    box.appendChild(draggable);
    draggable.classList.remove('hide');
}

// Drop event for list items
function listDrop(e) {
    e.target.classList.remove('drag-over');

    if (e.target !== draggedItem) {
        const parent = draggedItem.parentNode;

        // Clone items for swap
        const draggedClone = draggedItem.cloneNode(true);
        const targetClone = e.target.cloneNode(true);

        // Track the dragged and target items
        draggedTarget = [draggedItem.textContent, e.target.textContent];

        // Swap positions
        parent.replaceChild(targetClone, draggedItem);
        parent.replaceChild(draggedClone, e.target);

        reattachListeners(draggedClone);
        reattachListeners(targetClone);
    }
}

// Reattach listeners after swap
function reattachListeners(item) {
    item.addEventListener('dragstart', listDragStart);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('dragleave', dragLeave);
    item.addEventListener('drop', listDrop);
}

// Event listener for preview button
previewButton.addEventListener('click', () => {
    if (draggedTarget && draggedTarget.length) {
        alert(`Swapped: ${draggedTarget[0]} with ${draggedTarget[1]}`);
    } else {
        alert('No recent swap made!');
    }
});
