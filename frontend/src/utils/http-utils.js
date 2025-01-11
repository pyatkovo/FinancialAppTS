
import config from "../config/config.js";
import { AuthUtils } from "./auth-utils.js";
export class HttpUtils {

    static async request(url, method = "GET", useAuth = true, body = null) {
        const result = {
            error: false,
            response: null
        }

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',

            },
        };

        let token = null;

        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body)
        }

        let response = null;
        try {
            //request
            response = await fetch(config.api + url, params);
            result.response = await response.json();

        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                //1 Токена нет

                if (!token) {
                    result.redirect = '/login';
                } else {
                    //2 Токен устарел/невалидный(надо обновить)
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        //запрос повторно делаем
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}