import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../service/auth-service.js";


export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        this.validations = [
            {element: this.nameElement},
            {element: this.lastNameElement},
            {
                element: this.passwordElement,
                options: {pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/}
            },
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
            {element: this.emailElement, options: {pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/}},
        ];

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));

    }

    findElements() {
        this.nameElement = document.getElementById('firstName');
        this.lastNameElement = document.getElementById('lastName');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
    }

    async signUp() {
        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.passwordRepeatElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }
        if (ValidationUtils.validateForm(this.validations)) {
            const signupResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            });
            if (signupResult) {
                // AuthUtils.setAuthInfo(signupResult.accessToken, signupResult.refreshToken, {
                //     id: signupResult.id,
                //     name: signupResult.name
                // });
                console.log(signupResult);
                return this.openNewRoute('/login')
            }
        }
    }

}