import {AuthUtils} from "../../utils/auth-utils.js";

import {FinancesService} from "../../service/finances-service.js";

export class FinancesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('btn-create-operation').addEventListener('click', this.createOperation.bind(this));

        this.typeInputElement = document.getElementById('type-select');
        this.categoryInputElement = document.getElementById('category-select');
        this.amountInputElement = document.getElementById('amount-operation');
        this.commentInputElement = document.getElementById('comment-operation');
        this.dateInputElement = document.getElementById('date-operation');
        this.errorContainer = document.querySelector(".error-container"); // Блок для ошибок



        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        const typeSelect = document.getElementById("type-select");
        const categorySelect = document.getElementById("category-select");


        typeSelect.addEventListener("change", async () => {
            const selectedType = typeSelect.value; // "income" или "expense"
            console.log(selectedType)
            // Очищаем список категорий
            categorySelect.innerHTML = '<option selected disabled>Категория...</option>';

            if (!selectedType) return;

            let categories = [];

            // В зависимости от типа, получаем нужные категории
            if (selectedType === "income") {
                categories = await FinancesService.getAnyCategories('income');// Получаем категории дохода

            } else if (selectedType === "expense") {
                categories = await FinancesService.getAnyCategories('expense'); // Получаем категории расхода
            }

            // Если категории получены, наполняем select

            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id; // ID категории
                option.textContent = category.title; // Название категории
                categorySelect.appendChild(option);

            });

        });
    }

    async createOperation(e) {
        e.preventDefault();

        // Проверяем заполнение всех полей
        if (
            !this.typeInputElement.value ||
            !this.categoryInputElement.value ||
            !this.amountInputElement.value ||
            !this.dateInputElement.value ||
            !this.commentInputElement.value.trim()
        ) {
            // Показываем сообщение об ошибке
            this.errorContainer.style.display = "block";
            this.errorContainer.textContent = "Заполните все поля!";
            return;
        }


        const categoryId = Number(this.categoryInputElement.value);
        if (isNaN(categoryId)) {
            this.errorContainer.style.display = "block";
            this.errorContainer.textContent = "Выберите категорию!";
            return;
        }
        // Скрываем сообщение об ошибке, если все данные заполнены
        this.errorContainer.style.display = "none";

        // Собираем данные
        const createData = {
            type: this.typeInputElement.value,
            amount: Number(this.amountInputElement.value),
            date: this.dateInputElement.value,
            comment: this.commentInputElement.value,
            category_id: categoryId
        };

        console.log(createData);

        // Отправка данных на сервер
        const response = await FinancesService.createFinanceOperation(createData);
        if (response.error) {
            this.errorContainer.style.display = "block";
            this.errorContainer.textContent = `Ошибка: ${response.error}`;
            return;
        }

        // Перенаправляем пользователя на список финансов
        this.openNewRoute('/finances');
    }
}


