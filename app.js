const item = document.querySelector('.item');
const boxes = document.querySelectorAll('.box');
const deleteZone = document.getElementById('deleteZone');
const modal = document.getElementById('modal');
const bringBackButton = document.getElementById('bringBackButton');
const listItems = document.querySelectorAll('.list-item'); 
const previewButton = document.getElementById('previewButton');
let draggedItem = null;

// Drag functionality for main item
item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => e.target.classList.add('hide'), 0);


        // Show a preview on the previewButton
        previewButton.textContent = `Preview: ${e.target.textContent}`;
        previewButton.style.visibility = 'visible';
    });

    item.addEventListener('dragend', () => {
        previewButton.style.visibility = 'hidden';
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


        // Show a preview on the previewButton
        previewButton.textContent = `Preview: ${e.target.textContent}`;
        previewButton.style.visibility = 'visible';
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

// Reorderable list drop event with swap functionality
function listDrop(e) {
    e.target.classList.remove('drag-over');
    
    // Only swap if the dropped target is not the same as the dragged item
    if (e.target !== draggedItem) {
        const parent = draggedItem.parentNode;
        
        // Clone both items for swap
        const draggedClone = draggedItem.cloneNode(true);
        const targetClone = e.target.cloneNode(true);
        
        // Replace dragged item with targetClone
        parent.replaceChild(targetClone, draggedItem);
        
        // Replace target item with draggedClone
        parent.replaceChild(draggedClone, e.target);
        
        // Reattach event listeners
        reattachListeners(draggedClone);
        reattachListeners(targetClone);
    }
}

// Reattach drag event listeners to the swapped items
function reattachListeners(item) {
    item.addEventListener('dragstart', listDragStart);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('dragleave', dragLeave);
    item.addEventListener('drop', listDrop);
}

// Drop Preview functionality
function createDropPreview(box) {
    const preview = document.createElement('div');
    preview.className = 'drop-preview';
    preview.textContent = draggedItem ? draggedItem.textContent : 'Preview';
    box.appendChild(preview);
    return preview;
}

function showDropPreview(box) {
    if (!box.querySelector('.drop-preview')) {
        createDropPreview(box);
    }
}

function removeDropPreview(box) {
    const preview = box.querySelector('.drop-preview');
    if (preview) {
        box.removeChild(preview);
    }
}

// Drop Indicator functionality
function addDropIndicator(box) {
    box.classList.add('drop-indicator');
}

function removeDropIndicator(box) {
    box.classList.remove('drop-indicator');
}

// Apply updated drag events to boxes to show preview and indicator
boxes.forEach((box) => {
    box.addEventListener('dragenter', (e) => {
        dragEnter(e);
        addDropIndicator(box);
        showDropPreview(box);
    });

    box.addEventListener('dragleave', (e) => {
        dragLeave(e);
        removeDropIndicator(box);
        removeDropPreview(box);
    });

    box.addEventListener('drop', (e) => {
        drop(e, box);
        removeDropIndicator(box);
        removeDropPreview(box);
    });
});

