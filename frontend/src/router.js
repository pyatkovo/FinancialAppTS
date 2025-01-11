import {Main} from "./components/main.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Logout} from "./components/auth/logout.js";
import {Expense} from "./components/categories/expense.js";
import {Income} from "./components/categories/income.js";
import {FinancesList} from "./components/finances/finances-list.js";
import {FinancesCreate} from "./components/finances/finances-create.js";
import {FinancesEdit} from "./components/finances/finances-edit";
import {CategoryCreate} from "./components/categories/category-create";
import {CategoryEdit} from "./components/categories/category-edit";
import {FinancesService} from "./service/finances-service";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        // this.adminLteStyleElement = document.getElementById('adminlte_style');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная страница',
                filePathTemplate: '/templates/main/main.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/main.css'],
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/404',
                title: 'Страница недоступна',
                filePathTemplate: '/templates/main/404.html',
                useLayout: '',
                styles: ['/styles/common.css'],
                load: () => {

                },
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/auth/login.html',
                useLayout: '',
                styles: ['/styles/auth.css'],
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/sign-up.html',
                useLayout: '',
                styles: ['/styles/auth.css'],
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/expense/create.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/category.css'],
                load: () => {
                    new CategoryCreate('expense', this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/expense/edit.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/category.css'],
                load: () => {
                    new CategoryEdit('expense', this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expense',
                title: 'Категории расходов',
                filePathTemplate: '/templates/expense/view.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/category.css'],
                load: () => {
                    new Expense(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/income/create.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/category.css'],
                load: () => {
                    new CategoryCreate('income', this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/income/edit.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/category.css'],
                load: () => {
                    new CategoryEdit('income', this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income',
                title: 'Категории доходов',
                filePathTemplate: '/templates/income/view.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/category.css'],
                load: () => {
                    new Income(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/finances/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/finances/create.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/category.css'],
                load: () => {
                    new FinancesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/finances/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/finances/edit.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/category.css'],
                load: () => {
                    new FinancesEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/finances',
                title: 'Доходы & Расходы',
                filePathTemplate: '/templates/finances/list.html',
                useLayout: '/templates/layout.html',
                styles: ['/styles/common.css', '/styles/list.css'],
                load: () => {
                    new FinancesList(this.openNewRoute.bind(this));
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this)); //поменял url или перешел на страницу другую
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url)
        await this.activateRoute(null, currentRoute)
    }

    async clickHandler(e) {
        let element = null
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            // this.contentPageElement.classList.add('loading'); // Добавить класс загрузки
            // const content = await fetch(newRoute.filePathTemplate).then(response => response.text());
            // this.contentPageElement.innerHTML = content;
            // this.contentPageElement.classList.remove('loading'); // Удалить класс после загрузки
            // Управление загрузкой стилей
            if (newRoute.styles) {
                this.loadRouteStyles(newRoute);
            }
            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.getElementById('balance').innerHTML = await FinancesService.getBalance() + (' $');
                    document.getElementById('fullName').innerHTML = JSON.parse(localStorage.getItem('userInfo')).name + ' ' + JSON.parse(localStorage.getItem('userInfo')).lastName;
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text())
                this.activateMenuItem(newRoute);
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin-Finance';
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found')
            history.pushState({}, '', '/404')
            await this.activateRoute();
        }

    }

    loadRouteStyles(route) {
        document.body.style.visibility = 'hidden';
        // Удалить все предыдущие динамически добавленные стили
        document.head.querySelectorAll('link[data-route-style]').forEach(style => {
            style.remove();
        });
        // Загрузить стили для текущего роута
        route.styles.forEach(style => {
            const newStyle = document.createElement('link');
            newStyle.rel = 'stylesheet';
            newStyle.href = style;
            newStyle.setAttribute('data-route-style', ''); // Добавляем атрибут для идентификации динамически добавленных стилей
            newStyle.onload = () => {
                document.body.style.visibility = 'visible';
            };
            document.head.appendChild(newStyle);
        });
    }

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Добавляем активацию для родительского элемента <details>
        document.querySelectorAll('.sidebar details').forEach(details => {
            const links = details.querySelectorAll('.nav-link');
            const isActive = Array.from(links).some(link => link.classList.contains('active'));
            if (isActive) {
                details.setAttribute('open', 'true'); // Раскрывает dropdown
                details.classList.add('active'); // Добавляет класс активности
            } else {
                details.removeAttribute('open');
                details.classList.remove('active');
            }
        });
    }

}
