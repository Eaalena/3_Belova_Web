// ==================== СЛОВАРИ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Словарь для перевода категорий товаров
const categoryTranslations = {
    "electronics": "Электроника",
    "jewelery": "Ювелирные изделия",
    "men's clothing": "Мужская одежда",
    "women's clothing": "Женская одежда"
};

// Русские названия товаров
const productNames = {
    "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops": "Рюкзак Fjallraven для ноутбука 15\"",
    "Mens Casual Premium Slim Fit T-Shirts": "Мужская футболка премиум класса",
    "Mens Slim Fit Waistcoats": "Мужской жилет приталенный",
    "Mens Casual Slim Fit": "Мужской костюм приталенный",
    "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet": "Женский браслет John Hardy с драконом",
    "Solid Gold Petite Micropave": "Золотые серьги с бриллиантами",
    "White Gold Plated Princess": "Кольцо из белого золота с кубическим цирконием",
    "Pierced Owl Rose Gold Plated Stainless Steel Double": "Серьги-гвоздики из нержавеющей стали",
    "WD 2TB Elements Portable External Hard Drive - USB 3.0": "Внешний жесткий диск WD 2TB USB 3.0",
    "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s": "SSD накопитель SanDisk 1TB SATA III",
    "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5": "SSD накопитель Silicon Power 256GB",
    "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive": "Игровой внешний диск WD 4TB для PS4",
    "Acer SB220Q bi 21.5 inches Full HD (Full HD 1080p) IPS Monitor": "Монитор Acer 21.5\" Full HD IPS",
    "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) Super Ultrawide Screen QLED": "Игровой монитор Samsung 49\" 144Hz QLED",
    "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats": "Женская зимняя куртка 3-в-1 для сноуборда",
    "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket": "Женская кожаная куртка-косуха с капюшоном",
    "Rain Jacket Women Windbreaker Striped Climbing Raincoats": "Женская ветровка дождевик в полоску",
    "MBJ Women's Solid Short Sleeve Boat Neck V": "Женская футболка с V-образным вырезом",
    "Opna Women's Short Sleeve Moisture Wicking T-shirt": "Женская спортивная футболка с влагоотводом",
    "DANVOUY Womens T Shirt Casual Cotton Short Sleeve": "Женская хлопковая футболка с коротким рукавом"
};

// Функция для генерации URL аватара
function getUserAvatar(firstName, lastName, index) {
    const seed = `${firstName}${lastName}${index}`;
    return `https://i.pravatar.cc/300?u=${seed}`;
}

// ==================== API 1: DUMMYJSON - USERS ====================

async function getUsers() {
    const resultDiv = document.getElementById('usersResult');
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Загрузка пользователей...</div>';
    
    try {
        const response = await fetch('https://dummyjson.com/users?limit=5');
        if (!response.ok) throw new Error('Ошибка сети');
        
        const data = await response.json();
        
        let html = '<div class="cards-grid">';
        data.users.forEach((user, index) => {
            const userPhoto = getUserAvatar(user.firstName, user.lastName, user.id || index);
            
            html += `
                <div class="card">
                    <img src="${userPhoto}" alt="${user.firstName} ${user.lastName}">
                    <h3>${user.firstName} ${user.lastName}</h3>
                    <p><strong>📧 Email:</strong> ${user.email}</p>
                    <p><strong>📱 Телефон:</strong> ${user.phone}</p>
                    <p><strong>🎂 Возраст:</strong> ${user.age} лет</p>
                    <p><strong>📍 Город:</strong> ${user.address.city}, ${user.address.country}</p>
                    <p><strong>🏢 Компания:</strong> ${user.company.name}</p>
                    <p><strong>💼 Должность:</strong> ${user.company.title}</p>
                </div>
            `;
        });
        html += '</div>';
        
        resultDiv.innerHTML = `<div class="result success"><h3>✅ Получено ${data.users.length} пользователей с фотографиями</h3>${html}</div>`;
    } catch (error) {
        resultDiv.innerHTML = `<div class="result error"><h3>❌ Ошибка</h3><p>${error.message}</p></div>`;
    }
}

async function createUser() {
    const resultDiv = document.getElementById('usersResult');
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Создание пользователя...</div>';
    
    try {
        const response = await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: "Иван",
                lastName: "Иванов",
                email: "ivan@example.com",
                age: 25,
                phone: "+7-999-123-45-67",
                address: {
                    city: "Москва",
                    country: "Россия"
                }
            })
        });
        
        if (!response.ok) throw new Error('Ошибка сети');
        const newUser = await response.json();
        
        resultDiv.innerHTML = `
            <div class="result success">
                <h3>✅ Пользователь создан!</h3>
                <pre>${JSON.stringify(newUser, null, 2)}</pre>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<div class="result error"><h3>❌ Ошибка</h3><p>${error.message}</p></div>`;
    }
}

// ==================== API 2: FAKESTOREAPI - PRODUCTS ====================

async function getProducts() {
    const resultDiv = document.getElementById('getProductsResult');
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Загрузка товаров...</div>';
    
    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=6');
        if (!response.ok) throw new Error('Ошибка сети');
        
        const products = await response.json();
        
        let html = '<div class="cards-grid">';
        products.forEach(product => {
            const ruName = productNames[product.title] || product.title;
            const ruCategory = categoryTranslations[product.category] || product.category;
            
            html += `
                <div class="card">
                    <img src="${product.image}" alt="${ruName}" onerror="this.src='https://via.placeholder.com/200x250/667eea/ffffff?text=Товар'">
                    <h3>${ruName}</h3>
                    <p><strong>💰 Цена:</strong> ${product.price} ₽</p>
                    <p><strong>📦 Категория:</strong> ${ruCategory}</p>
                    <p><strong>⭐ Рейтинг:</strong> ${product.rating.rate} из 5 (${product.rating.count} отзывов)</p>
                    <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #888;">${product.description.substring(0, 100)}...</p>
                </div>
            `;
        });
        html += '</div>';
        
        resultDiv.innerHTML = `<div class="result success"><h3>✅ Получено ${products.length} товаров</h3>${html}</div>`;
    } catch (error) {
        resultDiv.innerHTML = `<div class="result error"><h3>❌ Ошибка</h3><p>${error.message}</p></div>`;
    }
}

async function createProduct() {
    const resultDiv = document.getElementById('createProductResult');
    const title = document.getElementById('productTitle').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Добавление товара...</div>';
    
    try {
        const response = await fetch('https://fakestoreapi.com/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                price: price,
                category: "electronics",
                description: "Новый качественный товар",
                image: "https://via.placeholder.com/150"
            })
        });
        
        if (!response.ok) throw new Error('Ошибка сети');
        const newProduct = await response.json();
        
        resultDiv.innerHTML = `
            <div class="result success">
                <h3>✅ Товар добавлен!</h3>
                <pre>${JSON.stringify(newProduct, null, 2)}</pre>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<div class="result error"><h3>❌ Ошибка</h3><p>${error.message}</p></div>`;
    }
}

async function updateProduct() {
    const resultDiv = document.getElementById('updateProductResult');
    const id = document.getElementById('updateProductId').value;
    
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Обновление товара...</div>';
    
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: "Обновленный смартфон",
                price: 35999,
                category: "electronics",
                description: "Обновленное описание товара",
                image: "https://via.placeholder.com/150"
            })
        });
        
        if (!response.ok) throw new Error('Ошибка сети');
        const updatedProduct = await response.json();
        
        resultDiv.innerHTML = `
            <div class="result success">
                <h3>✅ Товар обновлен!</h3>
                <pre>${JSON.stringify(updatedProduct, null, 2)}</pre>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<div class="result error"><h3>❌ Ошибка</h3><p>${error.message}</p></div>`;
    }
}

// ==================== API 3: ПОСТЫ ПРО РХТУ ====================

async function getPosts() {
    const resultDiv = document.getElementById('getPostsResult');
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Загрузка постов...</div>';
    
    // Русские посты про РХТУ им. Менделеева
    const russianPosts = [
        {
            id: 1,
            userId: 1,
            title: "🎓 РХТУ им. Д.И. Менделеева - ведущий химический вуз России",
            body: "Российский химико-технологический университет имени Д.И. Менделеева - один из крупнейших и старейших технических университетов России. Основан в 1898 году. Университет готовит специалистов в области химической технологии, биотехнологии, нанотехнологий и экологии.",
            reactions: { likes: 45, dislikes: 2 }
        },
        {
            id: 2,
            userId: 1,
            title: "🔬 Дмитрий Иванович Менделеев - великий учёный",
            body: "Д.И. Менделеев (1834-1907) - гениальный русский химик, создатель Периодической системы химических элементов. Открыл периодический закон в 1869 году. Также внёс вклад в развитие нефтяной промышленности, метрологии и воздухоплавания.",
            reactions: { likes: 89, dislikes: 1 }
        },
        {
            id: 3,
            userId: 1,
            title: "🏛️ Институты и факультеты РХТУ",
            body: "В составе университета 12 институтов и факультетов: Институт тонких химических технологий, Институт биотехнологий, Факультет химической технологии, Институт наноматериалов и нанотехнологий. Обучение ведётся по 40+ направлениям подготовки.",
            reactions: { likes: 67, dislikes: 3 }
        },
        {
            id: 4,
            userId: 1,
            title: "🔬 Научные достижения университета",
            body: "РХТУ ведёт передовые исследования в области создания новых материалов, фармацевтики, экологических технологий. Университет имеет 150+ научных лабораторий. Студенты участвуют в реальных научных проектах с 1-2 курса.",
            reactions: { likes: 52, dislikes: 0 }
        },
        {
            id: 5,
            userId: 1,
            title: "📚 Образование и карьера выпускников",
            body: "Выпускники РХТУ работают в ведущих компаниях: Газпром, Росатом, СИБУР, Фармстандарт. Средняя зарплата выпускников - 80 000₽. Университет сотрудничает с 100+ предприятиями отрасли. 95% выпускников трудоустраиваются по специальности.",
            reactions: { likes: 78, dislikes: 2 }
        }
    ];
    
    let html = '<div class="cards-grid">';
    russianPosts.forEach(post => {
        html += `
            <div class="card">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <p style="margin-top: 1rem; color: #999; font-size: 0.8rem;">👤 Автор: User #${post.userId}</p>
                <p style="color: #e74c3c; font-size: 0.85rem;">❤️ Нравится: ${post.reactions.likes} | 👎 Не нравится: ${post.reactions.dislikes}</p>
            </div>
        `;
    });
    html += '</div>';
    
    resultDiv.innerHTML = `<div class="result success"><h3>✅ Получено ${russianPosts.length} постов о РХТУ</h3>${html}</div>`;
}

async function deletePost() {
    const resultDiv = document.getElementById('deletePostResult');
    const id = document.getElementById('deletePostId').value;
    
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Удаление поста...</div>';
    
    try {
        const response = await fetch(`https://dummyjson.com/posts/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Ошибка сети');
        
        resultDiv.innerHTML = `
            <div class="result success">
                <h3>✅ Пост #${id} успешно удалён!</h3>
                <p>Статус ответа: ${response.status} ${response.statusText}</p>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<div class="result error"><h3>❌ Ошибка</h3><p>${error.message}</p></div>`;
    }
}

// ==================== ПЛАВНАЯ ПРОКРУТКА ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});