let logs = JSON.parse(localStorage.getItem('budgetLogs')) || [];

document.getElementById('save-log').addEventListener('click', () => {
    const date = document.getElementById('entry-date').value;
    const category = document.getElementById('entry-category').value;
    const type = document.getElementById('entry-type').value;
    const amount = document.getElementById('entry-amount').value;

    if (!date || !amount) return alert("Please fill in all fields");

    const entry = { date, category, type, amount: parseFloat(amount) };
    logs.push(entry);
    saveAndRender();
});

function saveAndRender() {
    localStorage.setItem('budgetLogs', JSON.stringify(logs));
    renderLogs(logs);
}

function renderLogs(data) {
    const tbody = document.getElementById('log-body');
    tbody.innerHTML = '';
    data.forEach(item => {
        const row = `<tr>
            <td>${item.date}</td>
            <td>${item.category}</td>
            <td>${item.type}</td>
            <td>$${item.amount.toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function filterBy(range) {
    const now = new Date();
    let filtered = logs;

    if (range === 'month') {
        filtered = logs.filter(l => new Date(l.date).getMonth() === now.getMonth() && new Date(l.date).getFullYear() === now.getFullYear());
    } else if (range === 'year') {
        filtered = logs.filter(l => new Date(l.date).getFullYear() === now.getFullYear());
    }
    renderLogs(filtered);
}

document.getElementById('manual-search').addEventListener('click', () => {
    const start = document.getElementById('filter-start').value;
    const end = document.getElementById('filter-end').value;
    const cat = document.getElementById('filter-category').value;

    let filtered = logs;
    if (start && end) {
        filtered = filtered.filter(l => l.date >= start && l.date <= end);
    }
    if (cat !== 'All') {
        filtered = filtered.filter(l => l.category === cat);
    }
    renderLogs(filtered);
});

// JSON Export/Import
function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "budget_data.json");
    downloadAnchor.click();
}

function importJSON(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        logs = JSON.parse(e.target.result);
        saveAndRender();
    };
    reader.readAsText(file);
}

// Initial Render
renderLogs(logs);