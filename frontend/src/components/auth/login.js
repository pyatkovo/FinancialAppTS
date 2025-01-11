import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../service/auth-service.js";
import {AuthUtils} from "../../utils/auth-utils";

export class Login{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        this.validations = [
            { element: this.passwordElement },
            { element: this.emailElement, options: { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/ } }
        ];
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
    }

    async login() {
        // this.commonErrorElement.style.display = 'none';
        if (ValidationUtils.validateForm(this.validations)) {
            //request
            const loginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            });
            if (loginResult) {
                console.log(loginResult)
                AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                    id: loginResult.user.id,
                    name: loginResult.user.name,
                    lastName: loginResult.user.lastName
                });

                return this.openNewRoute('/')
            }
            // this.commonErrorElement.style.display = 'block';

        }

    }
}