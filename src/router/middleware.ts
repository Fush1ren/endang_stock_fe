import { getAccessToken } from "@/utils/auth.utils";
import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationNormalizedLoaded } from "vue-router"

const middleware = (to: RouteLocationNormalized, _from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
    const isLoggedIn = !!getAccessToken();
    const useAuth = to.meta.useAuth ?? true;

    // Jika route butuh auth tapi belum login
    if (useAuth && !isLoggedIn) {
        return next({ path: "/auth/login" });
    }

    // Jika route tidak butuh auth dan sudah login, redirect ke dashboard
    if (!useAuth && isLoggedIn && to.path.startsWith("/auth")) {
        return next({ path: "/dashboard" });
    }

    // Jika user tidak punya permission ke halaman itu
    if (typeof to.meta.hasAccess === 'function') {
        const canAccess = to.meta.hasAccess();
        if (!canAccess) return next({ path: '/404' });
    }

    // Lanjut ke route
    return next();
}

export default middleware