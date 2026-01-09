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
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        // 分類バッジ
        if (task.category_name) {
            const categoryBadge = document.createElement('span');
            categoryBadge.className = 'category-badge';
            categoryBadge.textContent = task.category_name;
            categoryBadge.style.backgroundColor = task.category_color || '#007AFF';
            taskContent.appendChild(categoryBadge);
        }
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;
        
        // 完了状態の場合は取り消し線を追加
        if (task.completed) {
            taskTextSpan.classList.add('completed');
            taskItem.classList.add('task-completed');
        }
        
        taskContent.appendChild(taskTextSpan);
        
        // 優先度の表示
        const prioritySpan = document.createElement('span');
        prioritySpan.className = `priority-badge ${getPriorityClass(task.priority || 2)}`;
        prioritySpan.textContent = getPriorityLabel(task.priority || 2);
        taskContent.appendChild(prioritySpan);
        
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
            
            taskContent.appendChild(dueDateSpan);
        }
        
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
        
        taskItem.appendChild(taskContent);
        taskItem.appendChild(buttonContainer);
        taskList.appendChild(taskItem);
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
            } catch (error) {
                console.error('タスク削除エラー:', error);
                alert('タスクの削除に失敗しました');
            }
        }, 300);
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
});

// ページ読み込み時にデータを読み込む
loadCategories();
loadTasks();

// ページ読み込み時にフォーカスを設定
taskInput.focus();
