const ReviewsManager = {
    defaultReviews: [
        {
            id: 1,
            name: "Игорь П.",
            image: "",
            text: "Носки взломали мой телефон и заказали пиццу! Но было вкусно, так что 5 звёзд!",
            rating: 5,
            date: "2026-03-01"
        },
        {
            id: 2,
            name: "Мария К.",
            image: "",
            text: "GPS показал, что носки были на Мальдивах! Оказалось, они копили мои мелочи. Умнее меня!",
            rating: 5,
            date: "2026-03-05"
        },
        {
            id: 3,
            name: "Аноним",
            image: "",
            text: "Носки выучили 5 языков! Теперь переводят мне фильмы. Сижу, ноги в тепле, смотрю кино!",
            rating: 5,
            date: "2026-03-10"
        }
    ],

    init: function() {
        const stored = CookieUtils.get('smartsock_reviews');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return this.defaultReviews;
            }
        }
        return this.defaultReviews;
    },

    save: function(reviews) {
        const reviewsJSON = JSON.stringify(reviews);
        CookieUtils.set('smartsock_reviews', reviewsJSON, { days: 30 });
    },

    addReview: function(reviewData) {
        const reviews = this.init();
        const newReview = {
            id: Date.now(),
            name: reviewData.name.trim(),
            image: reviewData.image ? reviewData.image.trim() : "",
            text: reviewData.text.trim(),
            rating: parseInt(reviewData.rating),
            date: new Date().toISOString().split('T')[0]
        };
        reviews.unshift(newReview);
        this.save(reviews);
        return newReview;
    },

    getReviews: function() {
        return this.init();
    }
};

const FormValidator = {
    validate: function(formData) {
        const errors = {};
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]{2,50}$/;
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = "Имя должно содержать минимум 2 символа";
        } else if (!nameRegex.test(formData.name)) {
            errors.name = "Имя должно содержать только буквы";
        } else if (formData.name.length > 50) {
            errors.name = "Имя не должно превышать 50 символов";
        }

        if (formData.image && formData.image.trim() !== "") {
            if (!urlRegex.test(formData.image)) {
                errors.image = "Введите корректный URL изображения";
            }
        }

        if (!formData.text || formData.text.trim().length < 10) {
            errors.text = "Отзыв должен содержать минимум 10 символов";
        } else if (formData.text.length > 500) {
            errors.text = "Отзыв не должен превышать 500 символов";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    },

    showErrors: function(errors) {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        if (errors.name) {
            document.getElementById('nameError').textContent = errors.name;
        }
        if (errors.image) {
            document.getElementById('imageError').textContent = errors.image;
        }
        if (errors.text) {
            document.getElementById('textError').textContent = errors.text;
        }
    },

    clearForm: function() {
        document.getElementById('reviewForm').reset();
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }
};

const ReviewsUI = {
    render: function() {
        const reviews = ReviewsManager.getReviews();
        const container = document.getElementById('reviewsContainer');

        if (reviews.length === 0) {
            container.innerHTML = '<p class="no-reviews">Пока нет отзывов. Будьте первым!</p>';
            return;
        }

        const reviewsHTML = reviews.map(review => this.createReviewCard(review)).join('');
        container.innerHTML = reviewsHTML;
    },

    createReviewCard: function(review) {
        const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const imageHTML = review.image
            ? `<img src="${review.image}" alt="${review.name}" class="review-user-image" onerror="this.style.display='none'">`
            : '<div class="review-avatar">' + review.name.charAt(0).toUpperCase() + '</div>';

        return `
            <div class="review-card-new" data-id="${review.id}">
                <div class="review-header">
                    <div class="review-user-info">
                        ${imageHTML}
                        <div class="review-meta">
                            <span class="review-author">${this.escapeHtml(review.name)}</span>
                            <span class="review-date">${review.date}</span>
                        </div>
                    </div>
                    <div class="review-rating">${stars}</div>
                </div>
                <p class="review-text">${this.escapeHtml(review.text)}</p>
            </div>
        `;
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

const ThemeToggle = {
    init: function() {
        const toggle = document.getElementById('themeToggle');
        const icon = toggle.querySelector('.theme-icon');
        const savedTheme = CookieUtils.get('smartsock_theme') || 'light';

        this.setTheme(savedTheme);
        this.updateIcon(savedTheme, icon);

        toggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            this.updateIcon(newTheme, icon);
            CookieUtils.set('smartsock_theme', newTheme, { days: 365 });
        });
    },

    setTheme: function(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    },

    updateIcon: function(theme, icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    ThemeToggle.init();
    ReviewsUI.render();

    const form = document.getElementById('reviewForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('reviewName').value,
            image: document.getElementById('reviewImage').value,
            text: document.getElementById('reviewText').value,
            rating: document.getElementById('reviewRating').value
        };

        const validation = FormValidator.validate(formData);

        if (!validation.isValid) {
            FormValidator.showErrors(validation.errors);
            return;
        }

        ReviewsManager.addReview(formData);
        ReviewsUI.render();
        FormValidator.clearForm();
        alert('Спасибо за ваш отзыв! 🎉');
    });
});