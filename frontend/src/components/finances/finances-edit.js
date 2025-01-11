import {FinancesService} from "../../service/finances-service";


export class FinancesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.typeSelect = document.getElementById('type-select');
        this.categorySelect = document.getElementById('category-select');
        this.amountInput = document.getElementById('amount-operation');
        this.dateInput = document.getElementById('date-operation');
        this.commentInput = document.getElementById('comment-operation');
        this.errorContainer = document.querySelector('.error-container');
        this.createButton = document.getElementById('btn-create-operation');
        this.errorContainer = document.querySelector(".error-container"); // Блок для ошибок

        this.operationId = new URLSearchParams(window.location.search).get('id');

        if (!this.operationId) {
            alert('Операция не найдена');
            return this.openNewRoute('/finances');
        }

        this.init().then();
    }

    async init() {
        await this.loadOperationData();

        // Привязываем обработчик на изменение типа операции
        this.typeSelect.addEventListener('change', async () => {
            const newType = this.typeSelect.value;
            if (newType === 'income' || newType === 'expense') {
                await this.loadCategories(newType); // Загружаем категории для нового типа
            }
        });

        // Привязываем обработчик на кнопку создания
        this.createButton.addEventListener('click', async () => {
            const updatedData = this.collectFormData();
            if (!updatedData) {
                this.errorContainer.style.display = 'block';
                return;
            }

            try {
                const result = await FinancesService.updateFinanceOperation(this.operationId, updatedData);
                if (!result.error) {
                    console.log('Операция успешно обновлена');
                    this.openNewRoute('/finances');
                } else {
                    alert(result.error || 'Ошибка при обновлении операции');
                }
            } catch (error) {
                console.error('Ошибка при обновлении операции:', error);
                alert('Ошибка при обновлении операции');
            }
        });
    }

    async loadOperationData() {
        try {
            const operationData = await FinancesService.getOperationById(this.operationId);
            if (!operationData) {
                alert('Ошибка загрузки данных операции');
                this.openNewRoute('/finances');
                return;
            }
            this.populateForm(operationData);
        } catch (error) {
            console.error('Ошибка при загрузке операции:', error);
            this.openNewRoute('/finances');
        }
    }

    populateForm(data) {
        // Заполняем поля
        this.typeSelect.value = data.type;
        this.amountInput.value = data.amount;
        this.dateInput.value = data.date;
        this.commentInput.value = data.comment;
        // Загружаем категории и выбираем текущую
        this.loadCategories(data.type, data.category_id).then();
    }

    async loadCategories(type, selectedCategoryId) {
        try {
            const categories = type === 'income' ? await FinancesService.getAnyCategories('income')
                : await FinancesService.getAnyCategories('expense');

            this.categorySelect.innerHTML = categories.map(category =>
                    `<option value="${category.id}" ${category.id === selectedCategoryId ? 'selected' : ''}>
                        ${category.title}
                    </option>`).join('');
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
            this.categorySelect.innerHTML = `<option disabled>Ошибка загрузки категорий</option>`;
        }
    }

    collectFormData() {
        const type = this.typeSelect.value;
        const categoryId = this.categorySelect.value;
        const amount = this.amountInput.value;
        const date = this.dateInput.value;
        const comment = this.commentInput.value;

        if (!type || !categoryId || !amount || !date) {
            this.errorContainer.style.display = "block";
            return null;
        }

        return {
            type,
            category_id: parseInt(categoryId, 10),
            amount: parseFloat(amount),
            date,
            comment: comment || null,
        };
    }
}
