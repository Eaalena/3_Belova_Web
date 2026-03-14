const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function startGame() {
    let stats = {
        wins: 0, losses: 0, draws: 0,
        totalGames: 0, bestStreak: 0, currentStreak: 0
    };

    try {
        const savedStats = localStorage.getItem('tictactoe_stats');
        if (savedStats) stats = JSON.parse(savedStats);
    } catch (e) { console.log('LocalStorage недоступен'); }

    let playerName = prompt(
        '🎮 ══════════════════════════\n' +
        '   ДОБРО ПОЖАЛОВАТЬ В ИГРУ!\n' +
        '═══════════════════════════\n\n' +
        'Введите ваше имя (или нажмите Enter):'
    );
    
    if (playerName === null) { alert('👋 До встречи! Заходите ещё!'); return; }
    playerName = playerName.trim() || 'Игрок';
    
    let difficulty = prompt(
        '👋 Привет, ' + playerName + '!\n\n' +
        '═══ УРОВНИ СЛОЖНОСТИ ═══\n\n' +
        '1 - ЛЁГКИЙ (компьютер ходит случайно)\n' +
        '2 - СРЕДНИЙ (компьютер блокирует и атакует)\n' +
        '3 - СЛОЖНЫЙ (умный ИИ)\n\n' +
        '─────────────────────────\n' +
        'Введите число 1, 2 или 3:'
    );
    
    if (difficulty === null) { alert('👋 До встречи!'); return; }
    difficulty = parseInt(difficulty);
    if (isNaN(difficulty) || difficulty < 1 || difficulty > 3) {
        alert('⚠️ Неверный уровень!\nУстановлен средний (2)');
        difficulty = 2;
    }
    
    const difficultyNames = { 1: '🟢 Лёгкий', 2: '🟡 Средний', 3: '🔴 Сложный' };
    
    let winRate = stats.totalGames > 0 ? ((stats.wins / stats.totalGames) * 100).toFixed(1) : 0;
    
    let statsMessage = 
        '📊 ═══ ВАША СТАТИСТИКА ═══\n\n' +
        '🏆 Побед: ' + stats.wins + '\n' +
        '😔 Поражений: ' + stats.losses + '\n' +
        '🤝 Ничьих: ' + stats.draws + '\n' +
        '🎮 Всего игр: ' + stats.totalGames + '\n' +
        '📈 Процент побед: ' + winRate + '%\n' +
        '🔥 Лучшая серия: ' + stats.bestStreak + '\n\n' +
        '═══════════════════════════';
    
    alert(statsMessage);
    
    let playAgain = true;
    
    while (playAgain) {
        playOneGame(playerName, difficulty, stats);
        playAgain = confirm(
            '🎮 Хочешь ещё раз, ' + playerName + '?\n\n' +
            '📊 Текущий счёт:\n' +
            '❌ Побед: ' + stats.wins + '\n' +
            '⭕ Поражений: ' + stats.losses + '\n' +
            '🤝 Ничьих: ' + stats.draws
        );
    }
    
    showFinalStats(playerName, stats);
    
    try { localStorage.setItem('tictactoe_stats', JSON.stringify(stats)); }
    catch (e) { console.log('Не удалось сохранить статистику'); }
    
    alert('🎉 Спасибо за игру, ' + playerName + '!\nДо новых встреч! 👋');
}

function playOneGame(playerName, difficulty, stats) {
    let board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let moves = 0;
    let startTime = new Date();
    let gameOver = false;

    const difficultyNames = { 1: '🟢 Лёгкий', 2: '🟡 Средний', 3: '🔴 Сложный' };

    alert(
        '🎮 ═══ ИГРА НАЧАЛАСЬ ═══\n\n' +
        'Игрок: ' + playerName + '\n' +
        'Сложность: ' + difficultyNames[difficulty] + '\n\n' +
        'Вы: ❌ | Компьютер: ⭕\n\n' +
        drawBoard(board) +
        '\n💡 Вводите цифры 1-9 для хода\n\n' +
        '══════════════════════════'
    );

    while (!gameOver) {
        let input = prompt(
            playerName + ', ваш ход! (❌)\n\n' +
            drawBoard(board) +
            '\n📊 Ходов: ' + moves + '/9\n\n' +
            'Введите цифру (1-9):'
        );

        if (input === null) {
            if (confirm('❓ Вы уверены, что хотите выйти?')) {
                alert('👋 Игра прервана. До встречи!'); return;
            }
            continue;
        }

        input = input.trim().toLowerCase();
        
        if (input === '') { alert('⚠️ ОШИБКА!\n\nВведите цифру от 1 до 9!'); continue; }

        let cell = Number(input);
        if (isNaN(cell)) { alert('⚠️ ОШИБКА!\n\n"' + input + '" — это не число!\nВведите цифру от 1 до 9.'); continue; }

        if (!Number.isInteger(cell)) { alert('⚠️ ОШИБКА!\n\nВведите целое число, а не дробное!'); continue; }

        if (cell < 1 || cell > 9) { alert('⚠️ ОШИБКА!\n\nЧисло ' + cell + ' вне диапазона!\nВведите от 1 до 9.'); continue; }

        let index = cell - 1;
        if (board[index] === 'X' || board[index] === 'O') {
            alert('⚠️ ОШИБКА!\n\nКлетка ' + cell + ' уже занята!\nВыберите другую.'); continue;
        }

        board[index] = 'X'; moves++;

        if (checkWin(board, 'X')) {
            let endTime = new Date();
            let timeSec = Math.floor((endTime - startTime) / 1000);
            alert(
                '🏆 ═══ ПОБЕДА! ═══\n\n' +
                'Поздравляем, ' + playerName.toUpperCase() + '!\n\n' +
                drawBoard(board) +
                '\n⏱️ Время: ' + timeSec + ' сек.\n' +
                '📊 Ходов: ' + moves + '\n\n' +
                '══════════════════════════'
            );
            stats.wins++; stats.currentStreak++;
            if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;
            stats.totalGames++; gameOver = true; break;
        }

        if (moves === 9) {
            alert('🤝 ══ НИЧЬЯ ══ 🤝\n\n' + drawBoard(board) + '\nОтличная игра с обеих сторон!\n\n══════════════════════════');
            stats.draws++; stats.currentStreak = 0; stats.totalGames++; gameOver = true; break;
        }

        computerMove(board, difficulty); moves++;

        if (checkWin(board, 'O')) {
            let endTime = new Date();
            let timeSec = Math.floor((endTime - startTime) / 1000);
            const messages = [
                '🤖 Компьютер оказался сильнее!',
                '💪 Не расстраивайтесь, повезёт в следующий раз!',
                '🤖 Компьютер: 1 - ' + playerName + ': 0',
                '🧠 Искусственный интеллект побеждает!'
            ];
            let randomMsg = messages[Math.floor(Math.random() * messages.length)];
            alert(
                '😔 ═══ ПОРАЖЕНИЕ ═══\n\n' +
                randomMsg + '\n\n' +
                drawBoard(board) +
                '\n⏱️ Время: ' + timeSec + ' сек.\n' +
                'Попробуйте ещё раз!\n\n' +
                '══════════════════════════'
            );
            stats.losses++; stats.currentStreak = 0; stats.totalGames++; gameOver = true; break;
        }

        if (moves === 9) {
            alert('🤝 НИЧЬЯ!\n\n' + drawBoard(board) + '\nОтличная игра!');
            stats.draws++; stats.currentStreak = 0; stats.totalGames++; gameOver = true; break;
        }
    }
}

function drawBoard(board) {
    let line = '╔═══════╦═══════╦═══════╗\n';
    let mid = '╠═══════╬═══════╬═══════╣\n';
    let end = '╚═══════╩═══════╩═══════╝\n';
    let result = line;
    for (let i = 0; i < 9; i += 3) {
        let cell1 = getSymbol(board[i]);
        let cell2 = getSymbol(board[i + 1]);
        let cell3 = getSymbol(board[i + 2]);
        result += '║   ' + cell1 + '   ║   ' + cell2 + '   ║   ' + cell3 + '   ║\n';
        if (i < 6) result += mid;
    }
    result += end;
    return result;
}

function getSymbol(cell) {
    if (cell === 'X') return '❌';
    if (cell === 'O') return '⭕';
    return ' ' + cell + ' ';
}

function checkWin(board, symbol) {
    for (let i = 0; i < WIN_COMBOS.length; i++) {
        let combo = WIN_COMBOS[i];
        if (board[combo[0]] === symbol && board[combo[1]] === symbol && board[combo[2]] === symbol) {
            return true;
        }
    }
    return false;
}

function computerMove(board, difficulty) {
    if (difficulty === 1) randomMove(board);
    else if (difficulty === 2) basicAI(board);
    else smartAI(board);
}

function randomMove(board) {
    let available = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] !== 'X' && board[i] !== 'O') available.push(i);
    }
    if (available.length > 0) {
        let randomIndex = available[Math.floor(Math.random() * available.length)];
        board[randomIndex] = 'O';
    }
}

function basicAI(board) {
    for (let i = 0; i < 9; i++) {
        if (board[i] !== 'X' && board[i] !== 'O') {
            let saved = board[i]; board[i] = 'O';
            if (checkWin(board, 'O')) return;
            board[i] = saved;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i] !== 'X' && board[i] !== 'O') {
            let saved = board[i]; board[i] = 'X';
            if (checkWin(board, 'X')) { board[i] = 'O'; return; }
            board[i] = saved;
        }
    }
    if (board[4] !== 'X' && board[4] !== 'O') { board[4] = 'O'; return; }
    let corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
        let c = corners[i];
        if (board[c] !== 'X' && board[c] !== 'O') { board[c] = 'O'; return; }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i] !== 'X' && board[i] !== 'O') { board[i] = 'O'; return; }
    }
}

function smartAI(board) {
    for (let i = 0; i < 9; i++) {
        if (board[i] !== 'X' && board[i] !== 'O') {
            let saved = board[i]; board[i] = 'O';
            if (checkWin(board, 'O')) return;
            board[i] = saved;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i] !== 'X' && board[i] !== 'O') {
            let saved = board[i]; board[i] = 'X';
            if (checkWin(board, 'X')) { board[i] = 'O'; return; }
            board[i] = saved;
        }
    }
    if (board[4] !== 'X' && board[4] !== 'O') { board[4] = 'O'; return; }
    let corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
        let c = corners[i];
        if (board[c] !== 'X' && board[c] !== 'O') { board[c] = 'O'; return; }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i] !== 'X' && board[i] !== 'O') { board[i] = 'O'; return; }
    }
}

function showFinalStats(playerName, stats) {
    let winRate = stats.totalGames > 0 ? ((stats.wins / stats.totalGames) * 100).toFixed(1) : 0;
    let rank = '🟤 Новичок';
    if (winRate >= 70) rank = '🟡 🏆 Мастер';
    else if (winRate >= 50) rank = '🔵 ⭐ Опытный';
    else if (winRate >= 30) rank = '🟢  Любитель';
    alert(
        '📊 ═══ ФИНАЛЬНАЯ СТАТИСТИКА ═══\n\n' +
        '👤 Игрок: ' + playerName + '\n' + rank + ' Ранг\n\n' +
        '─────────────────────────\n\n' +
        '🏆 Побед: ' + stats.wins + '\n' +
        '😔 Поражений: ' + stats.losses + '\n' +
        '🤝 Ничьих: ' + stats.draws + '\n' +
        '🎮 Всего игр: ' + stats.totalGames + '\n' +
        '📈 Процент побед: ' + winRate + '%\n' +
        '🔥 Лучшая серия: ' + stats.bestStreak + '\n\n' +
        '─────────────────────────\n\n' +
        '💾 Статистика сохранена!\n\n' +
        '════════════════════════════════'
    );
}