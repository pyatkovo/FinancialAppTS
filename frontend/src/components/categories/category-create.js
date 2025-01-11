import {HttpUtils} from "../../utils/http-utils.js";

export class CategoryCreate {
    constructor(categoryType, openNewRoute) {
        this.categoryType = categoryType; // "income" или "expense"
        this.openNewRoute = openNewRoute;
        // Определяем элементы интерфейса
        this.inputField = document.querySelector('.create-category-input');
        this.createButton = document.querySelector('.btn-success');
        this.errorContainer = document.querySelector(".error-container"); // Блок для ошибок

        this.createButton.addEventListener('click', () => this.createCategory());
    }

    async createCategory() {
        const title = this.inputField.value.trim();
        if (!title) {
            this.errorContainer.style.display = "block";
            return;
        }
        this.errorContainer.style.display = "none";
        // Формирование данных для отправки
        const data = {title};
        try {
            const result = await HttpUtils.request(`/categories/${this.categoryType}`, 'POST', true, data);
            if (result.error) {
                alert("Ошибка создания категории: " + result.error);
                return;
            }
            this.openNewRoute(`/${this.categoryType}`);
        } catch (error) {
            console.error("Ошибка при создании категории:", error);
            alert("Произошла ошибка при создании категории. Попробуйте позже.");
        }
    }
}
