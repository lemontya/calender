window.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('calendar-container');
    if (!container) {
        console.error('エラー: class="calendar-container" が見つかりません。');
        return;
    }

    const h1 = container.querySelector('h1');
    if (!h1) {
        console.error('エラー: h1 タグが見つかりません。');
        return;
    }

    const [monthName, yearStr] = h1.innerText.split(' '); 
    const year = parseInt(yearStr, 10);

    const monthMap = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04', 
        'May': '05', 'June': '06', 'July': '07', 'August': '08', 
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    const month = monthMap[monthName]; 

    if (!year || !month) {
        console.error('エラー: h1 から年または月を正しく取得できませんでした。');
        return;
    }

    const dateCells = container.querySelectorAll('.day td');

    dateCells.forEach(cell => {
        const day = cell.innerText.trim(); 
        if (day === '') {
            return;
        }
        const dateStr = `${year}-${month}-${day.padStart(2, '0')}`;

        const holidays = []; 
        if (holidays.includes(day)) {
            cell.classList.add('holiday'); 
        }


        const dataKey = 'data-' + dateStr;
        const savedDataString = localStorage.getItem(dataKey);

        if (savedDataString) {
            try {
                const data = JSON.parse(savedDataString);
                const hasTasks = data.todos && data.todos.length > 0;
                const hasDiary = data.diary && data.diary.length > 0;
                
                let hasIncompleteTasks = false;
                if (hasTasks) {
                    hasIncompleteTasks = data.todos.some(task => !task.completed);
                }

                if (hasTasks || hasDiary) {
                    const dot = document.createElement('span');
                    dot.classList.add('day-dot');

                    if (hasTasks) {
                        if (hasIncompleteTasks) {
                            dot.classList.add('yellow'); 
                        } else {
                            dot.classList.add('blue'); 
                        }
                    } else if (hasDiary) {
                        dot.classList.add('green'); 
                    }
                    
                    cell.appendChild(dot);
                }

            } catch (e) {
                console.error('LocalStorageのデータ解析エラー (datakey: ' + dataKey + ')', e);
            }
        }
        cell.addEventListener('click', () => {
            window.location.href = 'index.html?date=' + dateStr;
        });
    });
});