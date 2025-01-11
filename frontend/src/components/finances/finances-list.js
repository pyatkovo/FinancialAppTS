import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils";
import {FinancesService} from "../../service/finances-service";

export class FinancesList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.tableBody = document.getElementById('finance-table-body');
        this.periodButtons = document.querySelectorAll('.period-btn');
        this.intervalSection = document.querySelector('.sort-interval');
        this.fromDateInput = document.querySelector('.interval-from');
        this.toDateInput = document.querySelector('.interval-to');
        this.applyIntervalButton = document.querySelector('.btn-apply-interval');

        this.deletePopup = document.querySelector('.delete-operation-block'); // Popup для удаления
        this.deleteConfirmButton = document.getElementById('confirm-delete-operation'); // Кнопка подтверждения удаления
        this.deleteCancelButton = document.getElementById('cancel-delete-operation'); // Кнопка отмены
        this.operationIdToDelete = null; // Идентификатор операции для удаления

        this.init();

    }

    init() {
        // Привязка событий к кнопкам
        this.periodButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handlePeriodChange(e));
        });

        this.applyIntervalButton.addEventListener('click', () => {
            this.fetchDataWithInterval();
        });

        this.deleteConfirmButton.addEventListener('click', () => {
            this.confirmDeleteOperation().then();
        });
        this.deleteCancelButton.addEventListener('click', () => {
            this.hideDeletePopup();
        });

        this.fetchData('today').then();
    }


    async fetchData(period, dateFrom = null, dateTo = null) {
        let url = `/operations?period=${period}`;

        if (dateFrom && dateTo) {
            url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }

        const response = await HttpUtils.request(url, 'GET', true);
        if (!response.error) {
            this.updateTable(response.response);
        } else {
            console.error('Ошибка при получении данных:', response.error);
        }
    }

    updateTable(data) {
        this.tableBody.innerHTML = ''; // Очистка таблицы
        data.forEach((item, index) => {
            const row = document.createElement('tr');

            const date = new Date(item.date);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;

            row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td class="${item.type === 'income' ? 'income' : 'expense'}">${item.type === 'income' ? 'доход' : 'расход'}</td>
            <td>${item.category || 'Не указано'}</td>
            <td>${item.amount}$</td>
            <td>${formattedDate}</td>
            <td>${item.comment || ''}</td>
            <td>
                <i class="fa-solid fa-pencil edit-icon" style="cursor: pointer;" data-id="${item.id}"></i>
                <i class="fa-solid fa-trash-can delete-icon" style="cursor: pointer;" data-id="${item.id}"></i>
            </td>
        `;
            this.tableBody.appendChild(row);
        });

        // Добавляем обработчики на иконки редактирования
        document.querySelectorAll('.edit-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const operationId = e.target.dataset.id;
                this.openNewRoute(`/finances/edit?id=${operationId}`);
            });
        });

        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const operationId = e.target.dataset.id;
                this.operationIdToDelete = operationId; // Сохраняем id операции для удаления
                this.showDeletePopup(); // Показываем попап
            });
        });
    }


    handlePeriodChange(event) {
        const clickedButton = event.target;
        const period = clickedButton.dataset.period;

        // Меняем активную кнопку
        this.periodButtons.forEach(button => button.classList.remove('active'));
        clickedButton.classList.add('active');

        // Показываем или скрываем интервал
        if (period === 'interval') {
            this.intervalSection.style.display = 'flex';
        } else {
            this.intervalSection.style.display = 'none';
            this.fetchData(period).then();
        }
    }

    fetchDataWithInterval() {
        const dateFrom = this.fromDateInput.value;
        const dateTo = this.toDateInput.value;

        if (!dateFrom || !dateTo) {
            alert('Пожалуйста, выберите обе даты!');
            return;
        }

        this.fetchData('interval', dateFrom, dateTo).then();
    }

    showDeletePopup() {
        this.deletePopup.style.display = 'block';
    }

    hideDeletePopup() {
        this.deletePopup.style.display = 'none';
        this.operationIdToDelete = null;
    }

    async confirmDeleteOperation() {
        if (!this.operationIdToDelete) {
            return;
        }
        try {
            const response = await FinancesService.deleteFinanceOperation(this.operationIdToDelete);
            if (!response) {
                alert('Не удалось удалить операцию!')
            } else {
                this.fetchData('today').then();
                this.hideDeletePopup();
            }
        } catch (error) {
            console.error('Ошибка при удалении операции: ', error)
            alert('Произошла ошибка при удалении.');
        }
    }
}