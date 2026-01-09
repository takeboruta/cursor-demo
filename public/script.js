// APIベースURL
const API_BASE = '/api';

// DOM要素の取得
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput = document.getElementById('dueDateInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
const categoryModal = document.getElementById('categoryModal');
const closeModal = document.getElementById('closeModal');
const categoryNameInput = document.getElementById('categoryNameInput');
const categoryColorInput = document.getElementById('categoryColorInput');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categoryList = document.getElementById('categoryList');
const searchInput = document.getElementById('searchInput');
const filterCategorySelect = document.getElementById('filterCategorySelect');
const listViewBtn = document.getElementById('listViewBtn');
const calendarViewBtn = document.getElementById('calendarViewBtn');
const listView = document.getElementById('listView');
const calendarView = document.getElementById('calendarView');
const calendarGrid = document.getElementById('calendarGrid');
const calendarMonthYear = document.getElementById('calendarMonthYear');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const dateTaskModal = document.getElementById('dateTaskModal');
const closeDateTaskModal = document.getElementById('closeDateTaskModal');
const dateTaskInput = document.getElementById('dateTaskInput');
const dateCategorySelect = document.getElementById('dateCategorySelect');
const datePrioritySelect = document.getElementById('datePrioritySelect');
const dateTaskAddBtn = document.getElementById('dateTaskAddBtn');
const dateTaskModalTitle = document.getElementById('dateTaskModalTitle');
const dateTaskList = document.getElementById('dateTaskList');

// 優先度の変換関数
function getPriorityLabel(priority) {
    const priorityMap = {
        1: '高',
        2: '中',
        3: '低'
    };
    return priorityMap[priority] || '中';
}

function getPriorityClass(priority) {
    const classMap = {
        1: 'priority-high',
        2: 'priority-medium',
        3: 'priority-low'
    };
    return classMap[priority] || 'priority-medium';
}

// データ管理
let tasks = [];
let categories = [];

// カレンダー管理
let currentDate = new Date();
let selectedDate = null;

// API呼び出し関数
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`APIエラー: ${response.statusText}`);
    }
    return response.json();
}

// 分類を読み込む
async function loadCategories() {
    try {
        categories = await apiCall('/categories');
        renderCategorySelect();
        if (categoryModal.style.display === 'block') {
            renderCategoryList();
        }
    } catch (error) {
        console.error('分類の読み込みエラー:', error);
    }
}

// 分類セレクトボックスを描画
function renderCategorySelect() {
    categorySelect.innerHTML = '<option value="">分類なし</option>';
    filterCategorySelect.innerHTML = '<option value="">すべての分類</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
        
        const filterOption = document.createElement('option');
        filterOption.value = category.id;
        filterOption.textContent = category.name;
        filterCategorySelect.appendChild(filterOption);
    });
}

// タスクを読み込む
async function loadTasks() {
    try {
        tasks = await apiCall('/tasks');
        renderTasks();
        // カレンダー表示中の場合、カレンダーも更新
        if (calendarView && !calendarView.classList.contains('hidden')) {
            renderCalendar();
        }
    } catch (error) {
        console.error('タスクの読み込みエラー:', error);
    }
}

// タスクをフィルタリングする関数
function filterTasks() {
    const searchText = searchInput.value.trim().toLowerCase();
    const filterCategoryId = filterCategorySelect.value;
    
    return tasks.filter(task => {
        // 検索テキストでフィルタリング
        const matchesSearch = !searchText || task.text.toLowerCase().includes(searchText);
        
        // 分類でフィルタリング
        const matchesCategory = !filterCategoryId || 
            (filterCategoryId === '' && !task.category_id) ||
            (task.category_id && parseInt(task.category_id) === parseInt(filterCategoryId));
        
        return matchesSearch && matchesCategory;
    });
}

// タスクを表示する関数
function renderTasks() {
    taskList.innerHTML = '';
    
    // フィルタリングされたタスクを取得
    const filteredTasks = filterTasks();
    
    filteredTasks.forEach((task) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.id = task.id;
        
        // アニメーション用のクラスを追加
        taskItem.classList.add('task-item-enter');
        
        const taskHeader = document.createElement('div');
        taskHeader.className = 'task-item-header';
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        // タスクテキスト部分
        const taskTextContainer = document.createElement('div');
        taskTextContainer.className = 'task-text-container';
        
        // 分類バッジ
        if (task.category_name) {
            const categoryBadge = document.createElement('span');
            categoryBadge.className = 'category-badge';
            categoryBadge.textContent = task.category_name;
            categoryBadge.style.backgroundColor = task.category_color || '#007AFF';
            taskTextContainer.appendChild(categoryBadge);
        }
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;
        
        // 完了状態の場合は取り消し線を追加
        if (task.completed) {
            taskTextSpan.classList.add('completed');
            taskItem.classList.add('task-completed');
        }
        
        taskTextContainer.appendChild(taskTextSpan);
        taskContent.appendChild(taskTextContainer);
        
        // バッジ部分（優先度・期限日）
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'badge-container';
        
        // 優先度の表示
        const prioritySpan = document.createElement('span');
        prioritySpan.className = `priority-badge ${getPriorityClass(task.priority || 2)}`;
        prioritySpan.textContent = getPriorityLabel(task.priority || 2);
        badgeContainer.appendChild(prioritySpan);
        
        // 期限日の表示
        if (task.due_date) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'due-date';
            const dueDate = new Date(task.due_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dueDateOnly = new Date(dueDate);
            dueDateOnly.setHours(0, 0, 0, 0);
            
            // 日付フォーマット（YYYY-MM-DD形式から表示用に変換）
            const formattedDate = dueDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            dueDateSpan.textContent = `期限: ${formattedDate}`;
            
            // 期限切れの場合は警告スタイルを適用
            if (!task.completed && dueDateOnly < today) {
                dueDateSpan.classList.add('due-date-overdue');
            } else if (!task.completed && dueDateOnly.getTime() === today.getTime()) {
                dueDateSpan.classList.add('due-date-today');
            }
            
            badgeContainer.appendChild(dueDateSpan);
        }
        
        taskContent.appendChild(badgeContainer);
        
        // 完了ボタン
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = task.completed ? '未完了' : '完了';
        
        // 完了ボタンのイベントリスナー
        completeBtn.addEventListener('click', async () => {
            await toggleComplete(task.id);
        });
        
        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '削除';
        
        // 削除ボタンのイベントリスナー
        deleteBtn.addEventListener('click', async () => {
            await removeTask(task.id);
        });
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(deleteBtn);
        
        taskHeader.appendChild(taskContent);
        taskHeader.appendChild(buttonContainer);
        taskItem.appendChild(taskHeader);
        
        // サブタスクセクション
        const subtaskSection = document.createElement('div');
        subtaskSection.className = 'subtask-section';
        subtaskSection.dataset.taskId = task.id;
        
        // サブタスク一覧
        const subtaskList = document.createElement('ul');
        subtaskList.className = 'subtask-list';
        subtaskList.id = `subtask-list-${task.id}`;
        
        // サブタスク追加フォーム
        const subtaskForm = document.createElement('div');
        subtaskForm.className = 'subtask-form';
        const subtaskInput = document.createElement('input');
        subtaskInput.type = 'text';
        subtaskInput.className = 'subtask-input';
        subtaskInput.placeholder = 'サブタスクを追加...';
        subtaskInput.dataset.taskId = task.id;
        
        const subtaskAddBtn = document.createElement('button');
        subtaskAddBtn.className = 'subtask-add-btn';
        subtaskAddBtn.textContent = '追加';
        subtaskAddBtn.dataset.taskId = task.id;
        
        subtaskAddBtn.addEventListener('click', async () => {
            await addSubtask(task.id);
        });
        
        subtaskInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                await addSubtask(task.id);
            }
        });
        
        subtaskForm.appendChild(subtaskInput);
        subtaskForm.appendChild(subtaskAddBtn);
        
        subtaskSection.appendChild(subtaskList);
        subtaskSection.appendChild(subtaskForm);
        
        taskItem.appendChild(subtaskSection);
        taskList.appendChild(taskItem);
        
        // サブタスクを読み込む
        loadSubtasks(task.id);
    });
}

// タスクを追加する関数
async function addTask() {
    const taskText = taskInput.value.trim();
    const categoryId = categorySelect.value || null;
    const dueDate = dueDateInput.value || null;
    const priority = prioritySelect.value ? parseInt(prioritySelect.value) : 2;
    
    if (taskText === '') {
        return;
    }
    
    try {
        await apiCall('/tasks', 'POST', {
            text: taskText,
            category_id: categoryId ? parseInt(categoryId) : null,
            due_date: dueDate,
            priority: priority
        });
        
        // 入力欄をクリア
        taskInput.value = '';
        categorySelect.value = '';
        dueDateInput.value = '';
        prioritySelect.value = '2'; // デフォルトに戻す
        taskInput.focus();
        
        // タスクを再読み込み
        await loadTasks();
    } catch (error) {
        console.error('タスク追加エラー:', error);
        alert('タスクの追加に失敗しました');
    }
}

// タスクの完了状態を切り替える関数
async function toggleComplete(id) {
    try {
        await apiCall(`/tasks/${id}/toggle`, 'PATCH');
        await loadTasks();
        // モーダルが開いている場合はタスク一覧を更新
        if (selectedDate && dateTaskModal && dateTaskModal.style.display === 'block') {
            renderDateTaskList(selectedDate);
        }
    } catch (error) {
        console.error('タスク更新エラー:', error);
        alert('タスクの更新に失敗しました');
    }
}

// タスクを削除する関数
async function removeTask(id) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    if (taskItem) {
        taskItem.classList.add('removing');
        setTimeout(async () => {
            try {
                await apiCall(`/tasks/${id}`, 'DELETE');
                await loadTasks();
                // モーダルが開いている場合はタスク一覧を更新
                if (selectedDate && dateTaskModal && dateTaskModal.style.display === 'block') {
                    renderDateTaskList(selectedDate);
                }
            } catch (error) {
                console.error('タスク削除エラー:', error);
                alert('タスクの削除に失敗しました');
            }
        }, 300);
    } else {
        // リスト表示にない場合（モーダル内など）は直接削除
        try {
            await apiCall(`/tasks/${id}`, 'DELETE');
            await loadTasks();
            // モーダルが開いている場合はタスク一覧を更新
            if (selectedDate && dateTaskModal && dateTaskModal.style.display === 'block') {
                renderDateTaskList(selectedDate);
            }
        } catch (error) {
            console.error('タスク削除エラー:', error);
            alert('タスクの削除に失敗しました');
        }
    }
}

// 分類管理モーダルを開く
function openCategoryModal() {
    categoryModal.style.display = 'block';
    renderCategoryList();
}

// 分類管理モーダルを閉じる
function closeCategoryModal() {
    categoryModal.style.display = 'none';
}

// 分類リストを描画
function renderCategoryList() {
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';
        categoryItem.dataset.id = category.id;
        
        const colorBox = document.createElement('span');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = category.color;
        
        const categoryName = document.createElement('span');
        categoryName.className = 'category-name';
        categoryName.textContent = category.name;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-category-btn';
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', async () => {
            await deleteCategory(category.id);
        });
        
        categoryItem.appendChild(colorBox);
        categoryItem.appendChild(categoryName);
        categoryItem.appendChild(deleteBtn);
        categoryList.appendChild(categoryItem);
    });
}

// 分類を追加する関数
async function addCategory() {
    const name = categoryNameInput.value.trim();
    const color = categoryColorInput.value;
    
    if (name === '') {
        return;
    }
    
    try {
        await apiCall('/categories', 'POST', { name, color });
        categoryNameInput.value = '';
        await loadCategories();
    } catch (error) {
        console.error('分類追加エラー:', error);
        alert('分類の追加に失敗しました: ' + (error.message || ''));
    }
}

// 分類を削除する関数
async function deleteCategory(id) {
    if (!confirm('この分類を削除しますか？')) {
        return;
    }
    
    try {
        await apiCall(`/categories/${id}`, 'DELETE');
        await loadCategories();
    } catch (error) {
        console.error('分類削除エラー:', error);
        alert('分類の削除に失敗しました');
    }
}

// サブタスクを読み込む
async function loadSubtasks(taskId) {
    try {
        const subtasks = await apiCall(`/subtasks/task/${taskId}`);
        renderSubtasks(taskId, subtasks);
    } catch (error) {
        console.error('サブタスクの読み込みエラー:', error);
    }
}

// サブタスクを表示する関数
function renderSubtasks(taskId, subtasks) {
    const subtaskList = document.getElementById(`subtask-list-${taskId}`);
    if (!subtaskList) return;
    
    subtaskList.innerHTML = '';
    
    subtasks.forEach((subtask) => {
        const subtaskItem = document.createElement('li');
        subtaskItem.className = 'subtask-item';
        subtaskItem.dataset.id = subtask.id;
        
        const subtaskCheckbox = document.createElement('input');
        subtaskCheckbox.type = 'checkbox';
        subtaskCheckbox.className = 'subtask-checkbox';
        subtaskCheckbox.checked = subtask.completed;
        subtaskCheckbox.addEventListener('change', async () => {
            await toggleSubtaskComplete(subtask.id, taskId);
        });
        
        const subtaskText = document.createElement('span');
        subtaskText.className = 'subtask-text';
        subtaskText.textContent = subtask.text;
        if (subtask.completed) {
            subtaskText.classList.add('completed');
        }
        
        const subtaskDeleteBtn = document.createElement('button');
        subtaskDeleteBtn.className = 'subtask-delete-btn';
        subtaskDeleteBtn.textContent = '削除';
        subtaskDeleteBtn.addEventListener('click', async () => {
            await deleteSubtask(subtask.id, taskId);
        });
        
        subtaskItem.appendChild(subtaskCheckbox);
        subtaskItem.appendChild(subtaskText);
        subtaskItem.appendChild(subtaskDeleteBtn);
        subtaskList.appendChild(subtaskItem);
    });
}

// サブタスクを追加する関数
async function addSubtask(taskId) {
    const subtaskInput = document.querySelector(`.subtask-input[data-task-id="${taskId}"]`);
    const text = subtaskInput.value.trim();
    
    if (text === '') {
        return;
    }
    
    try {
        await apiCall('/subtasks', 'POST', {
            task_id: taskId,
            text: text
        });
        subtaskInput.value = '';
        await loadSubtasks(taskId);
    } catch (error) {
        console.error('サブタスク追加エラー:', error);
        alert('サブタスクの追加に失敗しました');
    }
}

// サブタスクの完了状態を切り替える関数
async function toggleSubtaskComplete(subtaskId, taskId) {
    try {
        await apiCall(`/subtasks/${subtaskId}/toggle`, 'PATCH');
        await loadSubtasks(taskId);
    } catch (error) {
        console.error('サブタスク更新エラー:', error);
        alert('サブタスクの更新に失敗しました');
    }
}

// サブタスクを削除する関数
async function deleteSubtask(subtaskId, taskId) {
    try {
        await apiCall(`/subtasks/${subtaskId}`, 'DELETE');
        await loadSubtasks(taskId);
    } catch (error) {
        console.error('サブタスク削除エラー:', error);
        alert('サブタスクの削除に失敗しました');
    }
}

// イベントリスナー
addBtn.addEventListener('click', addTask);
manageCategoriesBtn.addEventListener('click', openCategoryModal);
closeModal.addEventListener('click', closeCategoryModal);
addCategoryBtn.addEventListener('click', addCategory);

// 検索・フィルターのイベントリスナー
searchInput.addEventListener('input', () => {
    renderTasks();
});

filterCategorySelect.addEventListener('change', () => {
    renderTasks();
});

// Enterキーでタスクを追加
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Enterキーで分類を追加
categoryNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addCategory();
    }
});

// モーダル外をクリックで閉じる
window.addEventListener('click', function(e) {
    if (e.target === categoryModal) {
        closeCategoryModal();
    }
    if (e.target === dateTaskModal) {
        closeDateTaskModalFunc();
    }
});

// カレンダー機能
function renderCalendar() {
    if (!calendarGrid || !calendarMonthYear) {
        console.error('カレンダー要素が見つかりません');
        return;
    }
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 月と年の表示を更新
    calendarMonthYear.textContent = `${year}年${month + 1}月`;
    
    // カレンダーグリッドをクリア
    calendarGrid.innerHTML = '';
    
    // 曜日ヘッダー
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    weekdays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // 月の最初の日と最後の日を取得
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    // 前月の残り日数を表示
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const dayCell = createDayCell(prevMonthLastDay - i, year, month - 1, true);
        calendarGrid.appendChild(dayCell);
    }
    
    // 今月の日付を表示
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = createDayCell(day, year, month, false);
        calendarGrid.appendChild(dayCell);
    }
    
    // 次月の最初の日を表示（グリッドを埋めるため）
    const totalCells = calendarGrid.children.length - 7; // 曜日ヘッダーを除く
    const remainingCells = 42 - totalCells; // 6週分（7列×6行）
    if (remainingCells > 0) {
        for (let day = 1; day <= remainingCells && day <= 14; day++) {
            const dayCell = createDayCell(day, year, month + 1, true);
            calendarGrid.appendChild(dayCell);
        }
    }
}

function createDayCell(day, year, month, isOtherMonth) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    if (isOtherMonth) {
        dayCell.classList.add('other-month');
    }
    
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    const isToday = isTodayDate(date);
    
    if (isToday) {
        dayCell.classList.add('today');
    }
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayCell.appendChild(dayNumber);
    
    // その日のタスクを表示
    const tasksForDay = tasks.filter(task => {
        if (!task.due_date) return false;
        // 日付文字列を直接比較（YYYY-MM-DD形式）
        let taskDateStr = task.due_date;
        if (taskDateStr.includes('T')) {
            taskDateStr = taskDateStr.split('T')[0]; // DATETIME形式の場合、Tで分割して日付部分のみ取得
        }
        if (taskDateStr.includes(' ')) {
            taskDateStr = taskDateStr.split(' ')[0]; // スペースで区切られている場合
        }
        return taskDateStr === dateStr;
    });
    
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'day-tasks';
    
    tasksForDay.slice(0, 3).forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `day-task ${task.completed ? 'completed' : ''}`;
        taskItem.textContent = task.text.length > 10 ? task.text.substring(0, 10) + '...' : task.text;
        taskItem.title = task.text;
        if (task.category_color) {
            taskItem.style.borderLeft = `3px solid ${task.category_color}`;
        }
        tasksContainer.appendChild(taskItem);
    });
    
    if (tasksForDay.length > 3) {
        const moreTasks = document.createElement('div');
        moreTasks.className = 'day-task-more';
        moreTasks.textContent = `+${tasksForDay.length - 3}`;
        tasksContainer.appendChild(moreTasks);
    }
    
    dayCell.appendChild(tasksContainer);
    
    // 日付セルクリックイベント
    dayCell.addEventListener('click', () => {
        selectedDate = dateStr;
        openDateTaskModal(dateStr);
    });
    
    return dayCell;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function isTodayDate(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
}

function openDateTaskModal(dateStr) {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    dateTaskModalTitle.textContent = `${formattedDate}のタスク`;
    dateTaskModal.style.display = 'block';
    
    // 分類セレクトボックスを更新
    dateCategorySelect.innerHTML = '<option value="">分類なし</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        dateCategorySelect.appendChild(option);
    });
    
    // その日のタスク一覧を表示
    renderDateTaskList(dateStr);
}

function closeDateTaskModalFunc() {
    dateTaskModal.style.display = 'none';
    dateTaskInput.value = '';
    dateCategorySelect.value = '';
    datePrioritySelect.value = '2';
    selectedDate = null;
    if (dateTaskList) {
        dateTaskList.innerHTML = '';
    }
}

function renderDateTaskList(dateStr) {
    if (!dateTaskList) return;
    
    // その日のタスクを取得
    const tasksForDay = tasks.filter(task => {
        if (!task.due_date) return false;
        let taskDateStr = task.due_date;
        if (taskDateStr.includes('T')) {
            taskDateStr = taskDateStr.split('T')[0];
        }
        if (taskDateStr.includes(' ')) {
            taskDateStr = taskDateStr.split(' ')[0];
        }
        return taskDateStr === dateStr;
    });
    
    dateTaskList.innerHTML = '';
    
    if (tasksForDay.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'この日にタスクはありません';
        dateTaskList.appendChild(emptyMessage);
        return;
    }
    
    tasksForDay.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'date-task-item';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        
        const taskContent = document.createElement('div');
        taskContent.className = 'date-task-content';
        
        // 分類バッジ
        if (task.category_name) {
            const categoryBadge = document.createElement('span');
            categoryBadge.className = 'category-badge';
            categoryBadge.textContent = task.category_name;
            categoryBadge.style.backgroundColor = task.category_color || '#007AFF';
            taskContent.appendChild(categoryBadge);
        }
        
        // タスクテキスト
        const taskText = document.createElement('span');
        taskText.className = 'date-task-text';
        taskText.textContent = task.text;
        if (task.completed) {
            taskText.classList.add('completed');
        }
        taskContent.appendChild(taskText);
        
        // 優先度バッジ
        const priorityBadge = document.createElement('span');
        priorityBadge.className = `priority-badge ${getPriorityClass(task.priority || 2)}`;
        priorityBadge.textContent = getPriorityLabel(task.priority || 2);
        taskContent.appendChild(priorityBadge);
        
        // 完了ボタン
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = task.completed ? '未完了' : '完了';
        completeBtn.addEventListener('click', async () => {
            await toggleComplete(task.id);
            renderDateTaskList(dateStr);
        });
        
        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', async () => {
            if (confirm('このタスクを削除しますか？')) {
                await removeTask(task.id);
                renderDateTaskList(dateStr);
            }
        });
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(deleteBtn);
        
        taskItem.appendChild(taskContent);
        taskItem.appendChild(buttonContainer);
        dateTaskList.appendChild(taskItem);
    });
}

async function addDateTask() {
    const taskText = dateTaskInput.value.trim();
    const categoryId = dateCategorySelect.value || null;
    const priority = datePrioritySelect.value ? parseInt(datePrioritySelect.value) : 2;
    
    if (taskText === '') {
        return;
    }
    
    if (!selectedDate) {
        alert('日付が選択されていません');
        return;
    }
    
    try {
        await apiCall('/tasks', 'POST', {
            text: taskText,
            category_id: categoryId ? parseInt(categoryId) : null,
            due_date: selectedDate,
            priority: priority
        });
        
        closeDateTaskModalFunc();
        await loadTasks();
        renderCalendar();
        // モーダルが開いている場合はタスク一覧を更新
        if (selectedDate) {
            renderDateTaskList(selectedDate);
        }
    } catch (error) {
        console.error('タスク追加エラー:', error);
        alert('タスクの追加に失敗しました');
    }
}

function showListView() {
    listView.classList.remove('hidden');
    calendarView.classList.add('hidden');
    listViewBtn.classList.add('active');
    calendarViewBtn.classList.remove('active');
    document.querySelector('.container').classList.remove('calendar-mode');
}

function showCalendarView() {
    listView.classList.add('hidden');
    calendarView.classList.remove('hidden');
    listViewBtn.classList.remove('active');
    calendarViewBtn.classList.add('active');
    document.querySelector('.container').classList.add('calendar-mode');
    renderCalendar();
}

// カレンダーのイベントリスナー
if (listViewBtn) {
    listViewBtn.addEventListener('click', showListView);
}
if (calendarViewBtn) {
    calendarViewBtn.addEventListener('click', showCalendarView);
}
if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
}
if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}
if (closeDateTaskModal) {
    closeDateTaskModal.addEventListener('click', closeDateTaskModalFunc);
}
if (dateTaskAddBtn) {
    dateTaskAddBtn.addEventListener('click', addDateTask);
}
if (dateTaskInput) {
    dateTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addDateTask();
        }
    });
}

// ページ読み込み時にデータを読み込む
loadCategories();
loadTasks();

// 初期表示をカレンダー表示に設定
if (listView && calendarView) {
    listView.classList.add('hidden');
    calendarView.classList.remove('hidden');
    if (listViewBtn) listViewBtn.classList.remove('active');
    if (calendarViewBtn) calendarViewBtn.classList.add('active');
    document.querySelector('.container').classList.add('calendar-mode');
    // カレンダーを初期表示
    if (calendarGrid) {
        renderCalendar();
    }
}

// ページ読み込み時にフォーカスを設定
if (taskInput) {
    taskInput.focus();
}
