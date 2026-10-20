const translations = {
    bg: {
        subtitle: "Днешен преглед",
        "progress-title": "Изпълнение на задачите",
        "input-placeholder": "Какво трябва да се направи?",
        "opt-low": "Нисък",
        "opt-medium": "Среден",
        "opt-high": "Висок",
        "due-date-title": "Краен срок",
        "btn-add": "Добави",
        "tab-active": "Активни",
        "tab-history": "Архив",
        "drag-hint": "Кликнете и влачете задачите за пренареждане",
        "btn-clear": "Изчисти всичко",
        "player-title": "Плейлист",
        "player-toggle-title": "Минимизиране / Разширяване",
        "modal-title": "Редактиране на задача",
        "modal-label-title": "Заглавие:",
        "modal-label-priority": "Приоритет:",
        "modal-label-date": "Краен срок:",
        "btn-cancel": "Отказ",
        "btn-save": "Запази",
        "confirm-delete": "Сигурни ли сте, че искате да изтриете тази задача?",
        "confirm-delete-yes": "Да, изтрий",
        "confirm-delete-no": "Отказ",
        "playlist-placeholder": "Поставете Spotify линк...",
        
        
        
        "tooltip-edit": "Редактиране",
        "tooltip-archive": "Премести в архив",
        "tooltip-delete": "Изтрий",
        "tooltip-restore": "Възстанови в активни",
        "tooltip-delete-perm": "Изтрий завинаги",
        "tooltip-complete": "Кликнете за изпълнение",
        
        
        "toast-empty": "Моля, въведете текст на задачата!",
        'toast-emptyList': 'Няма задачи за изчистване!',
        "toast-added": "Задачата е добавена успешно!",
        "toast-edit-empty": "Заглавието не може да бъде празно!",
        "toast-saved": "Промените бяха запазени!",
        "toast-completed": "Браво! Задачата е изпълнена.",
        "toast-uncompleted": "Задачата е върната в активни.",
        "toast-archived": "Задачата е преместена в архив.",
        "toast-restored": "Задачата е възстановена.",
        "toast-deleted": "Задачата е изтрита.",
        "toast-cleared": "Изгледът е изчистен.",
        "confirm-clear": "Сигурни ли сте, че искате да изчистите задачите в този изглед?"
    },
    en: {
        subtitle: "Today's Overview",
        "progress-title": "Task Completion",
        "input-placeholder": "What needs to be done?",
        "opt-low": "Low",
        "opt-medium": "Medium",
        "opt-high": "High",
        "due-date-title": "Due Date",
        "btn-add": "Add",
        "tab-active": "Active",
        "tab-history": "Archive",
        "drag-hint": "Click and drag tasks to reorder",
        "btn-clear": "Clear All",
        "player-title": "Playlist",
        "player-toggle-title": "Minimize / Expand",
        "modal-title": "Edit Task",
        "modal-label-title": "Task Title:",
        "modal-label-priority": "Priority:",
        "modal-label-date": "Due Date:",
        "btn-cancel": "Cancel",
        "btn-save": "Save Changes",
        "confirm-delete": "Are you sure you want to delete this task?",
        "confirm-delete-yes": "Yes, delete",
        "confirm-delete-no": "Cancel",
        "playlist-placeholder": "Paste Spotify link...",
        
       
        "tooltip-edit": "Edit Task",
        "tooltip-archive": "Move to Archive",
        "tooltip-delete": "Delete",
        "tooltip-restore": "Restore to Active",
        "tooltip-delete-perm": "Delete Permanently",
        "tooltip-complete": "Click to complete/incomplete",
        
        
        "toast-empty": "Please enter a task text!",
        'toast-emptyList': 'No tasks to clear!',
        "toast-added": "Task added successfully!",
        "toast-edit-empty": "Task title cannot be empty!",
        "toast-saved": "Changes saved successfully!",
        "toast-completed": "Great job! Task completed.",
        "toast-uncompleted": "Task moved back to active.",
        "toast-archived": "Task moved to archive.",
        "toast-restored": "Task restored successfully.",
        "toast-deleted": "Task deleted.",
        "toast-cleared": "View cleared.",
        "confirm-clear": "Are you sure you want to clear tasks in this view?"
    }
};


let tasks = JSON.parse(localStorage.getItem('tasksflow_tasks')) || [];
let activeTab = 'active';
let currentEditingTaskId = null;
let currentLang = localStorage.getItem('tasksflow_lang') || 'bg';
let taskToDeleteId = null;
let viewToClear = null;


const inputBox = document.getElementById('input-box');
const prioritySelect = document.getElementById('priority-select');
const dateBox = document.getElementById('date-box');
const inputSection = document.getElementById('input-section');
const activeList = document.getElementById('list-container');
const historyList = document.getElementById('history-container');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const activeCount = document.getElementById('active-count');
const historyCount = document.getElementById('history-count');


const editModal = document.getElementById('edit-modal');
const editTextInput = document.getElementById('edit-text-input');
const editPrioritySelect = document.getElementById('edit-priority-select');
const editDateInput = document.getElementById('edit-date-input');
const deleteModal = document.getElementById('delete-confirm-modal');
const confirmDeleteYes = document.getElementById('btn-confirm-yes');
const confirmDeleteNo = document.getElementById('btn-confirm-no');



document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    const savedPlaylist = localStorage.getItem('tasksflow_spotify_playlist');
    if (savedPlaylist) {
        const iframe = document.getElementById('spotify-iframe');
        if (iframe) iframe.src = savedPlaylist;
    }
    const clearYesBtn = document.getElementById('btn-clear-yes');
    const clearNoBtn = document.getElementById('btn-clear-no');
    const clearModal = document.getElementById('clear-confirm-modal');

    if (clearYesBtn && clearModal) {
        clearYesBtn.addEventListener('click', () => {
            if (viewToClear === 'active') {
                tasks = tasks.filter(task => task.archived);
            } else {
                tasks = tasks.filter(task => !task.archived);
            }
            saveAndRender();
            clearModal.classList.add('hidden');
            showToast('toast-cleared', 'info');
        });
    }

    if (clearNoBtn && clearModal) {
        clearNoBtn.addEventListener('click', () => {
            clearModal.classList.add('hidden');
        });
    }
});

const clearYesBtn = document.getElementById('btn-clear-yes');
    const clearNoBtn = document.getElementById('btn-clear-no');
    const clearModal = document.getElementById('clear-confirm-modal');

    if (clearYesBtn && clearModal) {
        clearYesBtn.addEventListener('click', () => {
            if (viewToClear === 'active') {
                tasks = tasks.filter(task => task.archived);
            } else {
                tasks = tasks.filter(task => !task.archived);
            }
            saveAndRender();
            clearModal.classList.add('hidden');
            
        });
    }

    if (clearNoBtn && clearModal) {
        clearNoBtn.addEventListener('click', () => {
            clearModal.classList.add('hidden');
        });
    }

    
    
    inputBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });


    confirmDeleteYes.addEventListener('click', () => {
        if (taskToDeleteId === null) return;

        tasks = tasks.filter(task => task.id !== taskToDeleteId);

        saveAndRender();

        deleteModal.classList.add('hidden');
        taskToDeleteId = null;

        showToast('toast-deleted', 'success');
    });

    confirmDeleteNo.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
        taskToDeleteId = null;
    });

    renderTasks();
    setupDragAndDrop();




function toggleLanguage() {
    currentLang = currentLang === 'bg' ? 'en' : 'bg';
    localStorage.setItem('tasksflow_lang', currentLang);
    applyLanguage();
    renderTasks();
}


function applyLanguage() {
    document.getElementById('html-root').lang = currentLang;
    document.getElementById('lang-label').textContent = currentLang === 'bg' ? 'EN' : 'BG';
     
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });

    
    document.querySelectorAll('[data-translate-title]').forEach(el => {
        const key = el.getAttribute('data-translate-title');
        if (translations[currentLang][key]) {
            el.title = translations[currentLang][key];
        }
    });

    
    const dateOptions = { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
    };
    const localeStr = currentLang === 'bg' ? 'bg-BG' : 'en-US';
    document.getElementById('current-date').textContent = new Date().toLocaleDateString(localeStr, dateOptions);
}


function showToast(key, type = 'success') {
    const container = document.getElementById('toast-container');

    if (!container) {
        console.error('Не е намерен елементът #toast-container');
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = './images/mark.png';

    if (type === 'info') icon = './images/information.png';
    if (type === 'warning') icon = './images/alert.png';
    if (type === 'error') icon = './images/close.png';

    const message = translations?.[currentLang]?.[key] ?? key;

    const img = document.createElement('img');
    img.src = icon;
    img.className = 'toast-icon';
    img.width = 30;
    img.height = 30;
    img.alt = '';

    const span = document.createElement('span');
    span.textContent = message;

    toast.append(img, span);

    toast.onclick = () => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 200);
    };

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.isConnected) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 2000);
}


function addTask() {
    const text = inputBox.value.trim();
    if (!text) {
        showToast('toast-empty', 'warning');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        priority: prioritySelect.value,
        dueDate: dateBox.value,
        completed: false,
        archived: false
    };

    tasks.push(newTask);
    
  
    inputBox.value = '';
    dateBox.value = '';
    prioritySelect.value = 'low'; 

    saveAndRender();
    showToast('toast-added', 'success');
}


function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentEditingTaskId = id;
    editTextInput.value = task.text;
    editPrioritySelect.value = task.priority;
    editDateInput.value = task.dueDate || '';

    editModal.classList.remove('hidden');
}

function closeEditModal() {
    editModal.classList.add('hidden');
    currentEditingTaskId = null;
}

function saveTaskEdit() {
    const newText = editTextInput.value.trim();
    if (!newText) {
        showToast('toast-edit-empty', 'warning');
        return;
    }
    if (!currentEditingTaskId) return;

    tasks = tasks.map(task => {
        if (task.id === currentEditingTaskId) {
            return {
                ...task,
                text: newText,
                priority: editPrioritySelect.value,
                dueDate: editDateInput.value
            };
        }
        return task;
    });

    saveAndRender();
    closeEditModal();
    showToast('toast-saved', 'success');
}


function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            const updated = { ...task, completed: !task.completed };
            if (updated.completed) {
                playCompletionSound();
                showToast('toast-completed', 'success');
            } else {
                showToast('toast-uncompleted', 'info');
            }
            return updated;
        }
        return task;
    });
    saveAndRender();
}


function archiveTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, archived: true };
        }
        return task;
    });
    saveAndRender();
    showToast('toast-archived', 'info');
}


function restoreTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, archived: false, completed: false };
        }
        return task;
    });
    saveAndRender();
    showToast('toast-restored', 'success');
}


function deleteTask(id) {
    taskToDeleteId = id;
    const modal = document.getElementById('delete-confirm-modal');
    const textEl = document.getElementById('delete-confirm-text');
    const yesBtn = document.getElementById('btn-confirm-yes');
    const noBtn = document.getElementById('btn-confirm-no');

    if (!modal) return;

    textEl.textContent = translations[currentLang]['confirm-delete'];
    yesBtn.textContent = translations[currentLang]['confirm-delete-yes'];
    noBtn.textContent = translations[currentLang]['confirm-delete-no'];

    modal.classList.remove('hidden');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const localeStr = currentLang === 'bg' ? 'bg-BG' : 'en-US';
    
    return date.toLocaleDateString(localeStr, options);
}


function switchTab(tab) {
    activeTab = tab;
    document.getElementById('tab-active').classList.toggle('active', tab === 'active');
    document.getElementById('tab-history').classList.toggle('active', tab === 'history');
    
    if (tab === 'active') {
        activeList.classList.remove('hidden-view');
        historyList.classList.add('hidden-view');
        inputSection.classList.remove('hidden');
    } else {
        activeList.classList.add('hidden-view');
        historyList.classList.remove('hidden-view');
        inputSection.classList.add('hidden');
    }
}


function togglePlayer() {
    const playerCard = document.getElementById('music-player-card');
    const appLayout = document.querySelector('.app-layout');
    const playlistInputContainer = document.getElementById('playlist-input-container');
    const gearBtn = document.getElementById('change-playlist-btn');

    if (!playerCard || !appLayout) return;

    const minimized = playerCard.classList.toggle('minimized');
    appLayout.classList.toggle('player-minimized', minimized);

    if (minimized) {
        if (gearBtn) gearBtn.style.display = 'none';
        if (playlistInputContainer) playlistInputContainer.style.display = 'none';
    } else {
        if (gearBtn) gearBtn.style.display = 'flex';
    }
}


function renderTasks() {
    activeList.innerHTML = '';
    historyList.innerHTML = '';

    const activeTasks = tasks.filter(t => !t.archived);
    const archivedTasks = tasks.filter(t => t.archived);

    
    if (activeTasks.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-state';
    emptyLi.innerHTML = `
        <img src="./images/active-empty.png" width="80px" height="80px" style="opacity: 0.3;">
        <p style="margin-top: 20px">${currentLang === 'bg' ? 'Няма активни задачи засега!' : 'No active tasks yet!'}</p>
    `;
    activeList.appendChild(emptyLi);

    } else {
        activeTasks.forEach(task => activeList.appendChild(createActiveTaskElement(task)));
    }

   
    if (archivedTasks.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'empty-state';
        emptyLi.innerHTML = `
            <img src="./images/archive-empty.png" width="80px" height="80px" style="opacity: 0.3;">
            <p style="margin-top: 20px">${currentLang === 'bg' ? 'Архивът е празен.' : 'Archive is empty.'}</p>
        `;
        historyList.appendChild(emptyLi);
    } else {
        archivedTasks.forEach(task => historyList.appendChild(createHistoryTaskElement(task)));
    }

    activeCount.textContent = activeTasks.length;
    historyCount.textContent = archivedTasks.length;

    const total = activeTasks.length;
    const completedCount = activeTasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
}


function translatePriority(p) {
    if (p === 'low') return currentLang === 'bg' ? 'нисък' : 'low';
    if (p === 'medium') return currentLang === 'bg' ? 'среден' : 'medium';
    if (p === 'high') return currentLang === 'bg' ? 'висок' : 'high';
    return p;
}


function createActiveTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
    li.draggable = true;
    li.dataset.id = task.id;

    const tEdit = translations[currentLang]['tooltip-edit'];
    const tArch = translations[currentLang]['tooltip-archive'];
    const tDel = translations[currentLang]['tooltip-delete'];
    const tComp = translations[currentLang]['tooltip-complete'];

    li.innerHTML = `
        <div class="task-content" title="${tComp}">
            <div class="custom-checkbox">
                ${task.completed ? '<img src="./images/check.png" "width=30px" height="30px">' : ''}
            </div>
            <div class="task-text-group">
                <span class="task-title">${escapeHTML(task.text)}</span>
                <div class="task-meta">
                    <span class="badge badge-${task.priority}">${translatePriority(task.priority)}</span>
                    ${task.dueDate ? `<span class="due-date-display"><img src="./images/calendar-solid.png" "width=15px" height="15px"> ${formatDate(task.dueDate)}</span>` : ''}
                </div>
            </div>
        </div>
        <div class="task-actions">
            <button type="button" class="action-btn edit" title="${tEdit}">
                <img src="./images/blue-pen.png" width="15px" height="15x">
            </button>
            <button type="button" class="action-btn archive" title="${tArch}">
                <img src="./images/yellow-folder.png" width="15px" height="15px">
            </button>
            <button type="button" class="action-btn delete" title="${tDel}">
                <img src="./images/red-trashcan.png" width="15px" height="15px">
            </button>
        </div>
    `;

    
    li.querySelector('.task-content').addEventListener('click', () => {
        toggleComplete(task.id);
    });

    li.querySelector('.action-btn.edit').addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(task.id);
    });

    li.querySelector('.action-btn.archive').addEventListener('click', (e) => {
        e.stopPropagation();
        archiveTask(task.id);
    });

    li.querySelector('.action-btn.delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });

    return li;
}


function createHistoryTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item completed';
    li.dataset.id = task.id;

    const tRest = translations[currentLang]['tooltip-restore'];
    const tDelPerm = translations[currentLang]['tooltip-delete-perm'];

    li.innerHTML = `
        <div class="task-content">
            <span class="task-title">${escapeHTML(task.text)}</span>
            ${task.dueDate ? `<span class="due-date-display" style="margin-left: 12px;"><img src="./images/calendar-solid.png" "width=15px" height="15px" > ${formatDate(task.dueDate)}</span>` : ''}
        <div class="task-actions" style="margin-left: auto;">
            <button class="action-btn restore" onclick="restoreTask(${task.id})" title="${tRest}">
                <img src="./images/restore.png" width="23px" height="23px">
            </button>
            <button class="action-btn delete" onclick="deleteTask(${task.id})" title="${tDelPerm}">
                <img src="./images/red-trashcan.png" width="14px" height="14px">
            </button>
        </div>
    `;

    return li;
}



function saveAndRender() {
    localStorage.setItem('tasksflow_tasks', JSON.stringify(tasks));
    renderTasks();
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function playCompletionSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
}

function promptPlaylistChange() {
    const container = document.getElementById('playlist-input-container');
    if (!container) return;
    
    
    if (container.style.display === 'none') {
        container.style.display = 'flex';
        document.getElementById('playlist-url-input').focus();
    } else {
        container.style.display = 'none';
    }
}


function saveNewPlaylist() {
    const userInput = document.getElementById('playlist-url-input').value.trim();
    if (!userInput) return;

    let playlistId = "";
    if (userInput.includes("playlist/")) {
        const parts = userInput.split("playlist/");
        playlistId = parts[1].split("?")[0];
    } else {
        playlistId = userInput;
    }

    if (playlistId) {
        const newSrc = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
        document.getElementById('spotify-iframe').src = newSrc;
        localStorage.setItem('tasksflow_spotify_playlist', newSrc);
        
        
        document.getElementById('playlist-input-container').style.display = 'none';
        document.getElementById('playlist-url-input').value = '';

        showToast('toast-saved', 'success');
    }
}


function setupDragAndDrop() {
    let draggedItem = null;

    activeList.addEventListener('dragstart', e => {
        if (e.target.classList.contains('task-item')) {
            draggedItem = e.target;
            e.target.classList.add('dragging');
        }
    });

    activeList.addEventListener('dragend', e => {
        if (e.target.classList.contains('task-item')) {
            e.target.classList.remove('dragging');
            
            const newOrderIds = [...activeList.querySelectorAll('.task-item')].map(el => Number(el.dataset.id));
            tasks.sort((a, b) => newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id));
            localStorage.setItem('tasksflow_tasks', JSON.stringify(tasks));
        }
    });

    activeList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(activeList, e.clientY);
        if (afterElement == null) {
            activeList.appendChild(draggedItem);
        } else {
            activeList.insertBefore(draggedItem, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


function clearData() {
    const hasItemsToClear = tasks.some(task => activeTab === 'active' ? !task.archived : task.archived);

    if (!hasItemsToClear) {
        showToast('toast-emptyList', 'info')
        return;
    }

    viewToClear = activeTab;
    
    const modal = document.getElementById('clear-confirm-modal');
    const textEl = document.getElementById('clear-confirm-text');
    const yesBtn = document.getElementById('btn-clear-yes');
    const noBtn = document.getElementById('btn-clear-no');

    if (!modal) return;

    
    textEl.textContent = translations[currentLang]['confirm-clear'];
    yesBtn.textContent = currentLang === 'bg' ? 'Да, изчисти' : 'Yes, clear';
    noBtn.textContent = translations[currentLang]['confirm-cancel'] || (currentLang === 'bg' ? 'Отказ' : 'Cancel');

    modal.classList.remove('hidden');
}