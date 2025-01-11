import {AuthUtils} from "../../utils/auth-utils.js";
import {FinancesService} from "../../service/finances-service";

export class Expense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Проверяем авторизацию
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.categoriesContainer = document.querySelector('.category-cards'); // Контейнер для карточек
        this.categoryIdToDelete = null; // ID категории для удаления

        this.init().then(); // Инициализация
    }

    async init() {
        this.addDeletePopupListeners(); // Привязываем обработчики для попапа
        await this.showCategories(); // Отображаем категории
    }

    // Получение и отображение категорий
    async showCategories() {
        try {
            const categories = await FinancesService.getAnyCategories('expense');
            this.createCategoriesCards(categories);
        } catch (error) {
            console.error('Ошибка при получении категорий доходов:', error);
            alert('Не удалось загрузить категории доходов.');
        }
    }

    // Создание карточек категорий
    createCategoriesCards(categories) {
        const createCard = this.categoriesContainer.querySelector('.category-card-create');

        // Очищаем контейнер, оставляем только карточку "создать новую категорию"
        this.categoriesContainer.innerHTML = '';
        if (createCard) {
            this.categoriesContainer.appendChild(createCard);
        }

        // Создаём карточки для каждой категории
        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <h3 class="category-card-header">${category.title}</h3>
                <div class="category-card-actions">
                    <button type="button" class="btn btn-primary edit-button" data-id="${category.id}">
                        Редактировать
                    </button>
                    <button type="button" class="btn btn-danger delete-button" data-id="${category.id}">
                        Удалить
                    </button>
                </div>
            `;

            // Вставляем карточку перед карточкой "Создать новую категорию"
            this.categoriesContainer.insertBefore(card, createCard);
        });

        // Привязываем обработчики к кнопкам редактирования и удаления
        this.addCategoryCardListeners();
    }

    // Привязка событий к кнопкам "Редактировать" и "Удалить"
    addCategoryCardListeners() {
        // Обработчики для кнопок "Удалить"
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const categoryId = e.target.dataset.id;
                this.showDeletePopup(categoryId);
            });
        });

        // Обработчики для кнопок "Редактировать"
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const categoryId = e.target.dataset.id;
                this.openEditCategory(categoryId);
            });
        });
    }

    // Показываем попап удаления
    showDeletePopup(categoryId) {
        this.categoryIdToDelete = categoryId; // Сохраняем ID категории
        const deletePopup = document.querySelector('.delete-category-block');
        deletePopup.style.display = 'block'; // Показываем попап
    }

    // Скрываем попап удаления
    hideDeletePopup() {
        this.categoryIdToDelete = null; // Сбрасываем ID категории
        const deletePopup = document.querySelector('.delete-category-block');
        deletePopup.style.display = 'none'; // Скрываем попап
    }

    // Привязка событий к кнопкам попапа
    addDeletePopupListeners() {
        const confirmDeleteButton = document.querySelector('.delete-category-actions .btn-success');
        const cancelDeleteButton = document.querySelector('.delete-category-actions .btn-danger');

        // Подтверждение удаления
        confirmDeleteButton.addEventListener('click', async () => {
            if (this.categoryIdToDelete) {
                await this.deleteCategory(this.categoryIdToDelete);
            }
            this.hideDeletePopup();
        });

        // Отмена удаления
        cancelDeleteButton.addEventListener('click', () => {
            this.hideDeletePopup();
        });
    }

    // Удаление категории
    async deleteCategory(categoryId) {
        try {
            const response = await FinancesService.deleteAnyCategory('expense', categoryId);
            if (response) {
                await this.showCategories(); // Обновляем список категорий
            } else {
                alert('Не удалось удалить категорию!');
            }
        } catch (error) {
            console.error('Ошибка при удалении категории:', error);
            alert('Произошла ошибка при удалении категории.');
        }
    }

    // Обработка редактирования категории
    openEditCategory(categoryId) {
        if (categoryId) {
            this.openNewRoute(`/expense/edit?id=${categoryId}`);
        }
    }
}
