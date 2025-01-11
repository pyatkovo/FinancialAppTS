import {HttpUtils} from "../utils/http-utils.js";

export class AuthService {

    static async logIn(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);
        // Проверяем наличие ошибки или отсутствие нужных данных в ответе
        if (
            result.error ||
            !result.response ||
            !result.response.tokens ||
            !result.response.tokens.accessToken ||
            !result.response.tokens.refreshToken ||
            !result.response.user ||
            !result.response.user.id ||
            !result.response.user.name
        ) {
            return false;
        }
        return result.response;
    }



    static async signUp(data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);

        // Проверяем наличие ошибки или отсутствия данных о пользователе
        if (result.error || !result.response || !result.response.user) {
            return false;
        }
        return result.response;
    }

    static async logOut(data){
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}