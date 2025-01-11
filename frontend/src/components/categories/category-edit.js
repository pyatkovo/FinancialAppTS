import {FinancesService} from "../../service/finances-service";

export class CategoryEdit {
    constructor(categoryType, openNewRoute) {
        this.categoryType = categoryType; // "income" или "expense"
        this.openNewRoute = openNewRoute;

        this.inputField = document.querySelector('.edit-category-input');
        this.createButton = document.querySelector('.btn-success');
        this.errorContainer = document.querySelector(".error-container");

        this.operationId = new URLSearchParams(window.location.search).get('id');

        if (!this.operationId) {
            alert('Категория не найдена');
            return this.openNewRoute(`/${this.categoryType}`);
        }
        this.loadCategoryData().then()
        this.createButton.addEventListener('click', () => this.editCategory());
    }

    async loadCategoryData() {
        try {
            const categoryData = await FinancesService.getAnyCategory(this.categoryType, this.operationId);
            if (!categoryData) {
                alert('Ошибка загрузки данных категории');
                this.openNewRoute('/categories');
                return;
            }
            this.populateForm(categoryData);
        } catch (error) {
            console.error('Ошибка при загрузке операции:', error);
            this.openNewRoute('/finances');
        }
    }

    populateForm(data) {
        // Заполняем поля
        this.inputField.value = data.title;

    }


    async editCategory() {
        const updatedData = this.inputField.value.trim();
        if (!updatedData) {
            this.errorContainer.style.display = "block";
            return;
        }
//Формируем объект который будем отправлять на сервер
        const formData = {
            title: updatedData
        }

        try {
            const result = await FinancesService.editAnyCategory(this.categoryType, this.operationId, formData);
            if (!result.error) {
                console.log('Категория успешно обновлена');
                this.openNewRoute(`/${this.categoryType}`);
            } else {
                alert(result.error || 'Ошибка при обновлении категории');
            }
        } catch (error) {
            console.error('Ошибка при обновлении категории:', error);
            alert('Ошибка при обновлении категории');
        }
    }
}