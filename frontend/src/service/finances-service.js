import {HttpUtils} from "../utils/http-utils.js";

export class FinancesService{

    static async getBalance(){
        try {
            const response = await HttpUtils.request(`/balance`, 'GET', true);
            if (!response.error && response.response) {
                return response.response.balance;
            } else {
                console.error("Ошибка при получении баланса:", response.error);
                return null;
            }
        } catch (error) {
            console.error("Ошибка в запросе баланса:", error);
            return null;
        }
    }


    static async createFinanceOperation(data){
        const returnObject = {
            error: false,
            redirect: null,
            id: null,
        }
        const result = await HttpUtils.request('/operations', 'POST', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Ошибка при добавлении фрилансеров';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    }

    static async updateFinanceOperation(id, data) {
        try {
            const response = await HttpUtils.request(`/operations/${id}`, 'PUT', true, data);
            if (!response.error && response.response) {
                return { error: false };
            } else {
                console.error("Ошибка при обновлении операции:", response.error);
                return { error: "Ошибка при обновлении операции" };
            }
        } catch (error) {
            console.error("Ошибка в запросе на обновление операции:", error);
            return { error: "Ошибка при запросе" };
        }
    }

    static async getOperationById(id) {
        try {
            const response = await HttpUtils.request(`/operations/${id}`, 'GET', true);
            if (!response.error && response.response) {
                return response.response;
            } else {
                console.error("Ошибка при получении операции:", response.error);
                return null;
            }
        } catch (error) {
            console.error("Ошибка в запросе операции:", error);
            return null;
        }
    }

    static async deleteFinanceOperation(id){
        try {
            const response = await HttpUtils.request(`/operations/${id}`, 'DELETE', true);
            if (!response.error && response.response) {
                return response.response;
            } else {
                console.error("Ошибка при удалении операции:", response.error);
                return null;
            }
        } catch (error) {
            console.error("Ошибка в удалении операции:", error);
            return null;
        }
    }


    static async getAnyCategories(type){
        let categoryType = type;
        try {
            // Делаем запрос через HttpUtils
            const response = await HttpUtils.request(`/categories/${categoryType}`, 'GET', true);
            // Проверяем успешность запроса
            if (!response.error && response.response) {
                return response.response; // Возвращаем категории
            } else {
                console.error("Ошибка при получении категорий:", response.error);
                return []; // Возвращаем пустой массив при ошибке
            }
        } catch (error) {
            console.error("Ошибка в запросе категорий:", error);
            return []; // Возвращаем пустой массив при исключении
        }
    }

    static async getAnyCategory(type, id){

        try {
            // Делаем запрос через HttpUtils
            const response = await HttpUtils.request(`/categories/${type}/${id}`, 'GET', true);
            // Проверяем успешность запроса
            if (!response.error && response.response) {
                return response.response; // Возвращаем категорию
            } else {
                console.error("Ошибка при получении категории:", response.error);
                return {}; // Возвращаем пустой массив при ошибке
            }
        } catch (error) {
            console.error("Ошибка в запросе категории:", error);
            return {}; // Возвращаем пустой массив при исключении
        }
    }


    static async deleteAnyCategory(type, id){
    let categoryType = type;
        try {
            const response = await HttpUtils.request(`/categories/${categoryType}/${id}`, 'DELETE', true);
            if (!response.error && response.response) {
                return response.response;
            } else {
                console.error("Ошибка при удалении категории:", response.error);
                return null;
            }
        } catch (error) {
            console.error("Ошибка в удалении категории:", error);
            return null;
        }
    }

    static async editAnyCategory(type, id, data){
        let categoryType = type;
        try {
            const response = await HttpUtils.request(`/categories/${categoryType}/${id}`, 'PUT', true, data);
            if (!response.error && response.response) {
                return { error: false };
            } else {
                console.error("Ошибка при обновлении категории:", response.error);
                return { error: "Ошибка при обновлении категории" };
            }
        } catch (error) {
            console.error("Ошибка в запросе на обновление операции:", error);
            return { error: "Ошибка при запросе" };
        }
    }
}