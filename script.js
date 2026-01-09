// DOM要素の取得
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// タスクデータの管理
let tasks = [];

// LocalStorageからタスクを読み込む
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// LocalStorageにタスクを保存する
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// タスクを表示する関数
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.index = index;
        
        // アニメーション用のクラスを追加
        taskItem.classList.add('task-item-enter');
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;
        
        // 完了状態の場合は取り消し線を追加
        if (task.completed) {
            taskTextSpan.classList.add('completed');
            taskItem.classList.add('task-completed');
        }
        
        // 完了ボタン
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = task.completed ? '未完了' : '完了';
        
        // 完了ボタンのイベントリスナー
        completeBtn.addEventListener('click', function() {
            toggleComplete(index);
        });
        
        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '削除';
        
        // 削除ボタンのイベントリスナー
        deleteBtn.addEventListener('click', function() {
            removeTask(index);
        });
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(deleteBtn);
        
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(buttonContainer);
        taskList.appendChild(taskItem);
    });
}

// タスクを追加する関数
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        return;
    }
    
    // 新しいタスクを配列に追加
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    // 入力欄をクリア
    taskInput.value = '';
    taskInput.focus();
}

// タスクの完了状態を切り替える関数
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// タスクを削除する関数
function removeTask(index) {
    const taskItem = document.querySelector(`[data-index="${index}"]`);
    if (taskItem) {
        taskItem.classList.add('removing');
        setTimeout(() => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }, 300);
    }
}

// 追加ボタンのクリックイベント
addBtn.addEventListener('click', addTask);

// Enterキーでタスクを追加
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// ページ読み込み時にタスクを読み込む
loadTasks();

// ページ読み込み時にフォーカスを設定
taskInput.focus();
