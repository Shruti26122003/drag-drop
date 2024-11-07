const item = document.querySelector('.item');
const boxes = document.querySelectorAll('.box');
const deleteZone = document.getElementById('deleteZone');
const modal = document.getElementById('modal');
const bringBackButton = document.getElementById('bringBackButton');
const listItems = document.querySelectorAll('.list-item'); 
let draggedItem = null;

// Drag functionality for main item
item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => e.target.classList.add('hide'), 0);
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
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => e.target.classList.add('hide'), 0);
}

// Delete drop event
function deleteDrop(e) {
    e.target.classList.remove('drag-over');

    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    // Delete the draggable item and show modal
    draggable.remove();
    showModal();
}

// Show modal function
function showModal() {
    modal.style.display = 'flex';
}

// Hide modal and bring back the draggable item
bringBackButton.addEventListener('click', () => {
    modal.style.display = 'none';

    // Recreate and re-append the draggable item below the heading
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.id = 'draggableItem';
    newItem.draggable = true;
    newItem.textContent = 'Drag me';
    document.body.insertBefore(newItem, document.querySelector('.container'));

    // Re-attach drag events to the new item
    newItem.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => e.target.classList.add('hide'), 0);
    });
});

// Drag events
function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e, targetBox) {
    e.target.classList.remove('drag-over');
    
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    // Move the item to the target box with animation
    moveToTarget(draggable, targetBox);

    // Clear the text of the drop zone (targetBox)
    targetBox.textContent = ''; // Remove the text from the target drop zone
}

// Move the item to the target position smoothly
function moveToTarget(draggable, targetBox) {
    draggable.classList.remove('hide');

    // Clone the draggable to create a running effect and animate it
    const clone = draggable.cloneNode(true);
    document.body.appendChild(clone);

    // Position clone at the original location of draggable
    const draggableRect = draggable.getBoundingClientRect();
    const targetRect = targetBox.getBoundingClientRect();
    
    clone.style.position = 'absolute';
    clone.style.left = `${draggableRect.left}px`;
    clone.style.top = `${draggableRect.top}px`;
    clone.style.transition = 'left 0.5s ease, top 0.5s ease';
    
    // Set target position for the clone
    setTimeout(() => {
        clone.style.left = `${targetRect.left}px`;
        clone.style.top = `${targetRect.top}px`;
    }, 0);

    // Remove the clone after animation completes
    setTimeout(() => {
        clone.remove();
        targetBox.appendChild(draggable);
    }, 500); // Match transition duration
}

// Reorderable list drop event
function listDrop(e) {
    e.target.classList.remove('drag-over');
    
    // Only swap if the dropped target is not the same as the dragged item
    if (e.target !== draggedItem) {
        const list = draggedItem.parentNode;
        list.insertBefore(draggedItem, e.target.nextSibling);
    }
}
