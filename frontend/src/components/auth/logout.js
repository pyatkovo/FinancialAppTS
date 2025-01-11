import { AuthService } from "../../service/auth-service.js";
import { AuthUtils } from "../../utils/auth-utils.js";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login')
        }
        this.logout().then();
        document.getElementById('logout-button').addEventListener('click', this.logout.bind(this));

    }
    async logout() {
        await AuthService.logOut({
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        });

        //request
        AuthUtils.removeAuthInfo();
        this.openNewRoute('/login')

    }
}