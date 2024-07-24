document.getElementById('start-challenge').addEventListener('click', function () {
    const name = document.getElementById('name').value;
    const goal = document.getElementById('goal').value;
    const startDate = new Date(document.getElementById('start').value);
    const endDate = new Date(document.getElementById('end').value);
    const dailyDeposit = parseFloat(document.getElementById('daily-deposit').value);
    const todayDateElement = document.getElementById('today-date');
    const totalSavingsElement = document.getElementById('total-savings');

    // Validate form inputs
    if (!name || !goal || isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || isNaN(dailyDeposit)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    // Initialize total savings
    let totalSavings = parseFloat(localStorage.getItem('totalSavings')) || 0;
    totalSavingsElement.textContent = totalSavings.toFixed(2);

    // Get today's date
    const today = new Date();
    todayDateElement.textContent = `Today's Date: ${today.toDateString()}`;

    // Save user data to localStorage
    localStorage.setItem('name', name);
    localStorage.setItem('goal', goal);
    localStorage.setItem('startDate', startDate.toISOString());
    localStorage.setItem('endDate', endDate.toISOString());
    localStorage.setItem('dailyDeposit', dailyDeposit);

    // Check if today's date is within the savings period
    if (today >= startDate && today <= endDate) {
        const checkButton = document.createElement('button');
        checkButton.textContent = 'Check if Deposited Today';
        checkButton.addEventListener('click', function () {
            const lastCheckedDate = localStorage.getItem('lastCheckedDate');
            if (lastCheckedDate === today.toDateString()) {
                alert('You have already deposited today. Come back tomorrow!');
            } else {
                totalSavings += dailyDeposit;
                totalSavingsElement.textContent = totalSavings.toFixed(2);
                localStorage.setItem('totalSavings', totalSavings);
                localStorage.setItem('lastCheckedDate', today.toDateString());
                
                // Update history
                const historyList = JSON.parse(localStorage.getItem('historyList')) || [];
                historyList.push(`Deposited ${dailyDeposit} on ${today.toDateString()}`);
                localStorage.setItem('historyList', JSON.stringify(historyList));
                updateHistory();
                
                updateProgressBar();
                alert('Deposit successful! Come back tomorrow to deposit again.');
            }
        });
        todayDateElement.appendChild(checkButton);
    } else {
        todayDateElement.textContent = 'The savings period is not active today.';
    }
});

document.getElementById('reset-challenge').addEventListener('click', function () {
    localStorage.clear();
    document.getElementById('name').value = '';
    document.getElementById('goal').value = '';
    document.getElementById('start').value = '';
    document.getElementById('end').value = '';
    document.getElementById('daily-deposit').value = '';
    document.getElementById('total-savings').textContent = '0';
    document.getElementById('today-date').textContent = '';
    document.getElementById('progress-bar').style.width = '0%';
    updateHistory();
});

function updateProgressBar() {
    const goal = parseFloat(localStorage.getItem('goal'));
    const totalSavings = parseFloat(localStorage.getItem('totalSavings')) || 0;
    const progress = (totalSavings / goal) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function updateHistory() {
    const historyList = JSON.parse(localStorage.getItem('historyList')) || [];
    const historyElement = document.getElementById('history-list');
    historyElement.innerHTML = '';
    historyList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyElement.appendChild(li);
    });
}

window.onload = function () {
    const name = localStorage.getItem('name');
    const goal = localStorage.getItem('goal');
    const startDate = localStorage.getItem('startDate');
    const endDate = localStorage.getItem('endDate');
    const dailyDeposit = localStorage.getItem('dailyDeposit');
    const totalSavings = localStorage.getItem('totalSavings') || 0;

    if (name) document.getElementById('name').value = name;
    if (goal) document.getElementById('goal').value = goal;
    if (startDate) document.getElementById('start').value = new Date(startDate).toISOString().substring(0, 10);
    if (endDate) document.getElementById('end').value = new Date(endDate).toISOString().substring(0, 10);
    if (dailyDeposit) document.getElementById('daily-deposit').value = dailyDeposit;
    document.getElementById('total-savings').textContent = parseFloat(totalSavings).toFixed(2);

    updateProgressBar();
    updateHistory();
};
