window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const selectedDate = params.get('date'); 
    if (!selectedDate) {
        alert('日付が選択されていません');
        window.location.href = 'calendar.html';
        return; 
    }

    const dataKey = 'data-' + selectedDate;
    const diaryTextarea = document.getElementById('diary-textarea');
    const saveButton = document.getElementById('save-button');
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const mainTitle = document.getElementById('main-title');
    const dateObj = new Date(selectedDate + 'T00:00:00'); 
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    mainTitle.textContent = `${month}月${date}日の日記 & ToDoリスト`;

    loadData();
    saveButton.addEventListener('click', () => {
        saveData(); 
        showToast('保存しました！');
    });

    addButton.addEventListener('click', () => {
        const taskText = todoInput.value;
        if (taskText === "") return;

        const taskObject = {
            text: taskText,
            completed: false
        };

        createTaskElement(taskObject); 
        todoInput.value = "";
        saveData();
    });

    function createTaskElement(taskObject) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = taskObject.completed;
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskObject.text;
        if (taskObject.completed) {
            taskSpan.classList.add('completed');
        }
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('delete-btn');

        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(deleteButton);
        todoList.appendChild(li);

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                taskSpan.classList.add('completed');
            } else {
                taskSpan.classList.remove('completed');
            }
            saveData(); 
        });

        deleteButton.addEventListener('click', () => {
            li.remove();
            saveData(); 
        });
    }

    function saveData() {
        
        const diaryContent = diaryTextarea.value;
        
        const tasks = [];
        todoList.querySelectorAll('li').forEach(li => {
            const taskSpan = li.querySelector('span');
            const checkbox = li.querySelector('input[type="checkbox"]');
            
            if (taskSpan && checkbox) { 
                tasks.push({
                    text: taskSpan.textContent,
                    completed: checkbox.checked
                });
            }
        });

        const dataToSave = {
            diary: diaryContent,
            todos: tasks
        };

        localStorage.setItem(dataKey, JSON.stringify(dataToSave));
    }

    function loadData() {
        const savedDataString = localStorage.getItem(dataKey);
        if (!savedDataString) {
            return; 
        }

        const data = JSON.parse(savedDataString);

        if (data.diary) {
            diaryTextarea.value = data.diary;
        }
        
        todoList.innerHTML = ""; 
        if (data.todos && data.todos.length > 0) {
            data.todos.forEach(taskObject => {
                createTaskElement(taskObject);
            });
        }
    }

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}); 