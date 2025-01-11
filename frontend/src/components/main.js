import {AuthUtils} from "../utils/auth-utils.js";
import {HttpUtils} from "../utils/http-utils.js";
import {Chart, PieController, ArcElement, Tooltip, Legend} from "chart.js";

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.periodButtons = document.querySelectorAll('.period-btn');
        this.intervalSection = document.querySelector('.sort-interval');
        this.fromDateInput = document.querySelector('.interval-from');
        this.toDateInput = document.querySelector('.interval-to');
        this.applyIntervalButton = document.querySelector('.btn-apply-interval');

        this.incomeErrorContainer = document.querySelector(".income-error-container"); // Блок для ошибок Доходов
        this.expenseErrorContainer = document.querySelector(".expense-error-container"); // Блок для ошибок Расходов
        this.incomeChart = null;
        this.expenseChart = null;
        // Регистрируем элементы для Chart.js
        Chart.register(PieController, ArcElement, Tooltip, Legend);

        this.init();
    }

    init() {
        this.periodButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handlePeriodChange(e));
        });

        this.applyIntervalButton.addEventListener('click', () => {
            this.fetchDataWithInterval();
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
            this.createCharts(response.response); // Создаем графики после получения данных
        } else {
            console.error('Ошибка при получении данных:', response.error);
        }
    }

    generateColors(length) {
        const colors = [];
        for (let i = 0; i < length; i++) {
            const hue = (i * 360) / length; // Устанавливаем оттенок цвета
            colors.push(`hsl(${hue}, 65%, 65%)`); // Добавляем цвет в массив
        }
        return colors;
    }

    createCharts(data) {
        if (this.incomeChart) this.incomeChart.destroy();
        if (this.expenseChart) this.expenseChart.destroy();

        // Обработка данных
        const incomeData = this.processChartData(data, 'income');
        const expenseData = this.processChartData(data, 'expense');

        // Цвета для графиков
        const incomeColors = this.generateColors(incomeData.labels.length);
        const expenseColors = this.generateColors(expenseData.labels.length);
        this.expenseErrorContainer.style.display = "none";
        this.incomeErrorContainer.style.display = "none";

        if (!incomeData || incomeData.labels.length === 0) {
            this.incomeErrorContainer.style.display = "block";
        } else {
            // Создаем график доходов
            const incomeCtx = document.getElementById('myIncomeChart');
            this.incomeChart = new Chart(incomeCtx, {
                type: 'pie',
                data: {
                    labels: incomeData.labels,
                    datasets: [{
                        data: incomeData.values,
                        backgroundColor: incomeColors,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Доходы',
                        },
                        tooltip: {
                            enabled: true,
                        },
                    },
                },
            });
        }
        // Создаем график расходов
        if (!expenseData || expenseData.labels.length === 0) {
            this.expenseErrorContainer.style.display = "block";
        } else {
            const expenseCtx = document.getElementById('myExpenseChart');
            this.expenseChart = new Chart(expenseCtx, {
                type: 'pie',
                data: {
                    labels: expenseData.labels,
                    datasets: [{
                        data: expenseData.values,
                        backgroundColor: expenseColors,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Расходы',
                        },
                        tooltip: {
                            enabled: true,
                        },
                    },
                },
            });
        }
    }


    processChartData(data, type) {
        // Фильтруем данные по типу
        const filteredData = data.filter(item => item.type === type);
        // Суммируем данные по категориям
        const categorySums = {};
        filteredData.forEach(item => {
            if (categorySums[item.category]) {
                categorySums[item.category] += item.amount;
            } else {
                categorySums[item.category] = item.amount;
            }
        });

        // Преобразуем в формат для графика
        const labels = Object.keys(categorySums); // Названия категорий в массиве
        const values = Object.values(categorySums); // Суммы в массиве

        return {labels, values};
    }


    handlePeriodChange(event) {
        const clickedButton = event.target;
        const period = clickedButton.dataset.period;

        this.periodButtons.forEach(button => button.classList.remove('active'));
        clickedButton.classList.add('active');

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
}
