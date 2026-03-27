var cards = [];
var editMode = false;
var deleteCallback = null;

function Card(name, cost, rarity, cardClass, description) {
    this.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.name = name;
    this.cost = cost;
    this.rarity = rarity;
    this.cardClass = cardClass;
    this.description = description;
}

Card.prototype.getType = function() { return 'card'; };
Card.prototype.getTypeName = function() { return 'Карта'; };
Card.prototype.getRarityName = function() {
    var names = { 'common': 'Common', 'rare': 'Rare', 'epic': 'Epic', 'legendary': 'Legendary' };
    return names[this.rarity] || 'Common';
};
Card.prototype.getCardClassName = function() {
    var names = { 'neutral': 'Neutral', 'mage': 'Mage', 'warrior': 'Warrior', 'priest': 'Priest', 'hunter': 'Hunter', 'warlock': 'Warlock' };
    return names[this.cardClass] || 'Neutral';
};
Card.prototype.getStatsHTML = function() { return ''; };
Card.prototype.getEditFields = function() { return ''; };

Card.prototype.getDataFromEditPanel = function(id) {
    var panel = document.getElementById('edit-' + id);
    return {
        name: panel.querySelector('.edit-name').value,
        cost: parseInt(panel.querySelector('.edit-cost').value) || 0,
        rarity: panel.querySelector('.edit-rarity').value,
        cardClass: panel.querySelector('.edit-class').value,
        description: panel.querySelector('.edit-description').value
    };
};

Card.prototype.getEditPanel = function() {
    var html = '<div class="edit-panel" id="edit-' + this.id + '">';
    html += '<h3>✏️ Редактирование карты</h3>';
    html += '<label>Название:</label><input type="text" class="edit-name" value="' + this.name + '">';
    html += '<label>Мана:</label><input type="number" class="edit-cost" value="' + this.cost + '">';
    html += '<label>Редкость:</label><select class="edit-rarity">';
    html += '<option value="common"' + (this.rarity === 'common' ? ' selected' : '') + '>Common</option>';
    html += '<option value="rare"' + (this.rarity === 'rare' ? ' selected' : '') + '>Rare</option>';
    html += '<option value="epic"' + (this.rarity === 'epic' ? ' selected' : '') + '>Epic</option>';
    html += '<option value="legendary"' + (this.rarity === 'legendary' ? ' selected' : '') + '>Legendary</option>';
    html += '</select>';
    html += '<label>Класс:</label><select class="edit-class">';
    html += '<option value="neutral"' + (this.cardClass === 'neutral' ? ' selected' : '') + '>Neutral</option>';
    html += '<option value="mage"' + (this.cardClass === 'mage' ? ' selected' : '') + '>Mage</option>';
    html += '<option value="warrior"' + (this.cardClass === 'warrior' ? ' selected' : '') + '>Warrior</option>';
    html += '<option value="priest"' + (this.cardClass === 'priest' ? ' selected' : '') + '>Priest</option>';
    html += '<option value="hunter"' + (this.cardClass === 'hunter' ? ' selected' : '') + '>Hunter</option>';
    html += '<option value="warlock"' + (this.cardClass === 'warlock' ? ' selected' : '') + '>Warlock</option>';
    html += '</select>';
    html += '<label>Описание:</label><textarea class="edit-description" rows="3">' + this.description + '</textarea>';
    html += this.getEditFields();
    html += '<div class="edit-buttons">';
    html += '<button class="btn-save" onclick="saveCard(\'' + this.id + '\')">💾 Сохранить</button>';
    html += '<button class="btn-cancel" onclick="cancelEdit(\'' + this.id + '\')">❌ Отмена</button>';
    html += '</div></div>';
    return html;
};

Card.prototype.getHTML = function() {
    var html = '<div class="card ' + this.getType() + ' ' + this.rarity + '">';
    html += '<div class="card-mana">' + this.cost + '</div>';
    html += '<div class="card-rarity rarity-' + this.rarity + '">' + this.getRarityName() + '</div>';
    html += '<button class="btn-delete" onclick="confirmDelete(\'' + this.id + '\')">🗑️</button>';
    html += '<div class="card-header">' + this.name + '</div>';
    html += '<div class="card-type">' + this.getTypeName() + ' | ' + this.getCardClassName() + '</div>';
    html += '<div class="card-description">' + this.description + '</div>';
    html += this.getStatsHTML();
    html += '<div style="text-align:center;"><span class="card-class-badge">' + this.getCardClassName() + '</span></div>';
    html += this.getEditPanel();
    html += '</div>';
    return html;
};

Card.prototype.toJSON = function() {
    return {
        id: this.id,
        type: this.getType(),
        name: this.name,
        cost: this.cost,
        rarity: this.rarity,
        cardClass: this.cardClass,
        description: this.description
    };
};

function Minion(name, cost, rarity, cardClass, description, attack, health) {
    Card.call(this, name, cost, rarity, cardClass, description);
    this.attack = attack;
    this.health = health;
}

Minion.prototype = Object.create(Card.prototype);
Minion.prototype.constructor = Minion;
Minion.prototype.getType = function() { return 'minion'; };
Minion.prototype.getTypeName = function() { return 'Миньон'; };

Minion.prototype.getStatsHTML = function() {
    return '<div class="card-stats">' +
        '<div class="stat attack">⚔️' + this.attack + '</div>' +
        '<div class="stat health">❤️' + this.health + '</div></div>';
};

Minion.prototype.getEditFields = function() {
    return '<label>Атака:</label><input type="number" class="edit-attack" value="' + this.attack + '">' +
        '<label>Здоровье:</label><input type="number" class="edit-health" value="' + this.health + '">';
};

Minion.prototype.getDataFromEditPanel = function(id) {
    var data = Card.prototype.getDataFromEditPanel.call(this, id);
    var panel = document.getElementById('edit-' + id);
    data.attack = parseInt(panel.querySelector('.edit-attack').value) || 1;
    data.health = parseInt(panel.querySelector('.edit-health').value) || 1;
    return data;
};

Minion.prototype.toJSON = function() {
    var data = Card.prototype.toJSON.call(this);
    data.attack = this.attack;
    data.health = this.health;
    return data;
};

function Spell(name, cost, rarity, cardClass, description, spellType) {
    Card.call(this, name, cost, rarity, cardClass, description);
    this.spellType = spellType;
}

Spell.prototype = Object.create(Card.prototype);
Spell.prototype.constructor = Spell;
Spell.prototype.getType = function() { return 'spell'; };
Spell.prototype.getTypeName = function() { return 'Заклинание'; };

Spell.prototype.getEditFields = function() {
    return '<label>Тип:</label><select class="edit-spell-type">' +
        '<option value="instant"' + (this.spellType === 'instant' ? ' selected' : '') + '>Мгновенное</option>' +
        '<option value="sorcery"' + (this.spellType === 'sorcery' ? ' selected' : '') + '>Волшебство</option></select>';
};

Spell.prototype.getDataFromEditPanel = function(id) {
    var data = Card.prototype.getDataFromEditPanel.call(this, id);
    var panel = document.getElementById('edit-' + id);
    data.spellType = panel.querySelector('.edit-spell-type').value;
    return data;
};

Spell.prototype.toJSON = function() {
    var data = Card.prototype.toJSON.call(this);
    data.spellType = this.spellType;
    return data;
};

function Weapon(name, cost, rarity, cardClass, description, attack, durability) {
    Card.call(this, name, cost, rarity, cardClass, description);
    this.attack = attack;
    this.durability = durability;
}

Weapon.prototype = Object.create(Card.prototype);
Weapon.prototype.constructor = Weapon;
Weapon.prototype.getType = function() { return 'weapon'; };
Weapon.prototype.getTypeName = function() { return 'Оружие'; };

Weapon.prototype.getStatsHTML = function() {
    return '<div class="card-stats">' +
        '<div class="stat attack">⚔️' + this.attack + '</div>' +
        '<div class="stat durability">🛡️' + this.durability + '</div></div>';
};

Weapon.prototype.getEditFields = function() {
    return '<label>Атака:</label><input type="number" class="edit-attack" value="' + this.attack + '">' +
        '<label>Прочность:</label><input type="number" class="edit-durability" value="' + this.durability + '">';
};

Weapon.prototype.getDataFromEditPanel = function(id) {
    var data = Card.prototype.getDataFromEditPanel.call(this, id);
    var panel = document.getElementById('edit-' + id);
    data.attack = parseInt(panel.querySelector('.edit-attack').value) || 1;
    data.durability = parseInt(panel.querySelector('.edit-durability').value) || 1;
    return data;
};

Weapon.prototype.toJSON = function() {
    var data = Card.prototype.toJSON.call(this);
    data.attack = this.attack;
    data.durability = this.durability;
    return data;
};

function buildWebsite() {
    var container = document.getElementById('cardsContainer');
    container.innerHTML = '';
    
    if (cards.length === 0) {
        container.innerHTML = '<div class="empty-state">' +
            '<div class="empty-state-icon">🎴</div>' +
            '<h2>Коллекция пуста</h2>' +
            '<p>Добавьте свою первую карту!</p></div>';
    } else {
        var filteredCards = getFilteredCards();
        for (var i = 0; i < filteredCards.length; i++) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = filteredCards[i].getHTML();
            container.appendChild(tempDiv.firstElementChild);
        }
    }
    
    var panels = document.querySelectorAll('.edit-panel');
    if (editMode) {
        document.body.classList.add('edit-mode');
        for (var j = 0; j < panels.length; j++) {
            panels[j].classList.add('active');
        }
    } else {
        document.body.classList.remove('edit-mode');
        for (var j = 0; j < panels.length; j++) {
            panels[j].classList.remove('active');
        }
    }
    
    updateStats();
}

function getFilteredCards() {
    var search = document.getElementById('filterSearch').value.toLowerCase();
    var type = document.getElementById('filterType').value;
    var cardClass = document.getElementById('filterClass').value;
    var rarity = document.getElementById('filterRarity').value;
    
    var result = [];
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var match = true;
        
        if (search && card.name.toLowerCase().indexOf(search) === -1) match = false;
        if (type && card.getType() !== type) match = false;
        if (cardClass && card.cardClass !== cardClass) match = false;
        if (rarity && card.rarity !== rarity) match = false;
        
        if (match) result.push(card);
    }
    return result;
}

function applyFilters() {
    buildWebsite();
}

function updateStats() {
    document.getElementById('totalCards').textContent = cards.length;
    
    var minions = 0, spells = 0, weapons = 0, totalMana = 0;
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].getType() === 'minion') minions++;
        else if (cards[i].getType() === 'spell') spells++;
        else if (cards[i].getType() === 'weapon') weapons++;
        totalMana += cards[i].cost;
    }
    
    document.getElementById('totalMinions').textContent = minions;
    document.getElementById('totalSpells').textContent = spells;
    document.getElementById('totalWeapons').textContent = weapons;
    document.getElementById('avgMana').textContent = cards.length > 0 ? (totalMana / cards.length).toFixed(1) : '0';
}

function initializeCards() {
    var savedCards = localStorage.getItem('hearthstoneCards');
    
    if (savedCards) {
        var cardsData = JSON.parse(savedCards);
        cards = [];
        for (var i = 0; i < cardsData.length; i++) {
            var cd = cardsData[i];
            if (cd.type === 'minion') {
                cards.push(new Minion(cd.name, cd.cost, cd.rarity, cd.cardClass, cd.description, cd.attack, cd.health));
            } else if (cd.type === 'spell') {
                cards.push(new Spell(cd.name, cd.cost, cd.rarity, cd.cardClass, cd.description, cd.spellType));
            } else if (cd.type === 'weapon') {
                cards.push(new Weapon(cd.name, cd.cost, cd.rarity, cd.cardClass, cd.description, cd.attack, cd.durability));
            }
        }
    } else {
        cards = [
            new Minion('Огненный Ящер', 3, 'common', 'neutral', 'Рывок. Когда этот миньон атакует, нанесите 1 урон всем врагам.', 3, 4),
            new Minion('Ледяной Маг', 4, 'rare', 'mage', 'Боевой клич: Заморозьте цель.', 2, 5),
            new Minion('Древний Защитник', 7, 'epic', 'priest', 'Провокация. В начале вашего хода восстановите 2 здоровья.', 5, 8),
            new Spell('Огненный Шар', 4, 'common', 'mage', 'Нанесите 6 урона цели.', 'sorcery'),
            new Spell('Исцеление', 2, 'common', 'priest', 'Восстановите 5 здоровья вашему герою.', 'instant'),
            new Weapon('Клинок Тьмы', 3, 'rare', 'warrior', '', 3, 2),
            new Minion('Легендарный Дракон', 9, 'legendary', 'neutral', 'Боевой клич: Нанесите 5 урона всем врагам. Рывок.', 8, 8)
        ];
        saveToLocalStorage();
    }
}

function saveToLocalStorage() {
    var cardsData = [];
    for (var i = 0; i < cards.length; i++) {
        cardsData.push(cards[i].toJSON());
    }
    localStorage.setItem('hearthstoneCards', JSON.stringify(cardsData));
}

function toggleEditMode() {
    editMode = !editMode;
    var btn = document.getElementById('editModeToggle');
    var addBtn = document.getElementById('addCardBtn');
    
    if (editMode) {
        btn.classList.add('active');
        btn.textContent = '✓ Редактирование ВКЛ';
        addBtn.style.display = 'block';
        showToast('Режим редактирования включен');
    } else {
        btn.classList.remove('active');
        btn.textContent = '✏️ Режим редактирования';
        addBtn.style.display = 'none';
    }
    buildWebsite();
}

function saveCard(id) {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].id === id) {
            var newData = cards[i].getDataFromEditPanel(id);
            for (var key in newData) {
                cards[i][key] = newData[key];
            }
            saveToLocalStorage();
            buildWebsite();
            showToast('Карта сохранена! ✅');
            break;
        }
    }
}

function cancelEdit(id) {
    var panel = document.getElementById('edit-' + id);
    if (panel) {
        panel.classList.remove('active');
    }
}

function confirmDelete(id) {
    deleteCallback = id;
    showModal('Удаление карты', 'Вы уверены, что хотите удалить эту карту?', function() {
        deleteCard(id);
    });
}

function deleteCard(id) {
    var newCards = [];
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].id !== id) {
            newCards.push(cards[i]);
        }
    }
    cards = newCards;
    saveToLocalStorage();
    buildWebsite();
    showToast('Карта удалена 🗑️');
    closeModal();
}

function toggleAddForm() {
    var form = document.getElementById('addCardForm');
    if (form.classList.contains('active')) {
        form.classList.remove('active');
    } else {
        form.classList.add('active');
        updateFormFields();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateFormFields() {
    var type = document.getElementById('newCardType').value;
    var attackGroup = document.getElementById('attackGroup');
    var healthGroup = document.getElementById('healthGroup');
    var durabilityGroup = document.getElementById('durabilityGroup');
    
    if (type === 'minion') {
        attackGroup.style.display = 'block';
        healthGroup.style.display = 'block';
        durabilityGroup.style.display = 'none';
    } else if (type === 'weapon') {
        attackGroup.style.display = 'block';
        healthGroup.style.display = 'none';
        durabilityGroup.style.display = 'block';
    } else {
        attackGroup.style.display = 'none';
        healthGroup.style.display = 'none';
        durabilityGroup.style.display = 'none';
    }
}

function createNewCard() {
    var type = document.getElementById('newCardType').value;
    var name = document.getElementById('newCardName').value.trim();
    var cost = parseInt(document.getElementById('newCardCost').value);
    
    if (!name) {
        showToast('Введите название карты! ❌', true);
        return;
    }
    if (isNaN(cost)) {
        showToast('Введите стоимость маны! ❌', true);
        return;
    }
    
    var rarity = document.getElementById('newCardRarity').value;
    var cardClass = document.getElementById('newCardClass').value;
    var description = document.getElementById('newCardDescription').value.trim();
    var newCard = null;
    
    if (type === 'minion') {
        var attack = parseInt(document.getElementById('newCardAttack').value) || 1;
        var health = parseInt(document.getElementById('newCardHealth').value) || 1;
        newCard = new Minion(name, cost, rarity, cardClass, description, attack, health);
    } else if (type === 'spell') {
        newCard = new Spell(name, cost, rarity, cardClass, description, 'sorcery');
    } else if (type === 'weapon') {
        var weaponAttack = parseInt(document.getElementById('newCardAttack').value) || 1;
        var durability = parseInt(document.getElementById('newCardDurability').value) || 1;
        newCard = new Weapon(name, cost, rarity, cardClass, description, weaponAttack, durability);
    }
    
    if (newCard) {
        cards.push(newCard);
        saveToLocalStorage();
        buildWebsite();
        toggleAddForm();
        showToast('Карта создана! ✨');
        
        document.getElementById('newCardName').value = '';
        document.getElementById('newCardCost').value = '';
        document.getElementById('newCardDescription').value = '';
        document.getElementById('newCardAttack').value = '';
        document.getElementById('newCardHealth').value = '';
        document.getElementById('newCardDurability').value = '';
    }
}

function toggleFilters() {
    var panel = document.getElementById('filterPanel');
    panel.classList.toggle('active');
}

function exportDeck() {
    var data = {
        cards: cards.map(function(c) { return c.toJSON(); }),
        exportedAt: new Date().toISOString()
    };
    var dataStr = JSON.stringify(data, null, 2);
    var dataBlob = new Blob([dataStr], {type: 'application/json'});
    var url = URL.createObjectURL(dataBlob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'hearthstone-deck-' + Date.now() + '.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Колода экспортирована! 📥');
}

function showToast(message, isError) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(function() {
        toast.className = 'toast';
    }, 3000);
}

function showModal(title, text, onConfirm) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').textContent = text;
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modalConfirm').onclick = function() {
        if (onConfirm) onConfirm();
        closeModal();
    };
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

window.onload = function() {
    initializeCards();
    buildWebsite();
    showToast('Добро пожаловать! 🎮');
};

document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});