import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized, type RouteLocationNormalizedLoaded, type RouteRecordRaw } from "vue-router";
import middleware from "./middleware";
import { getStockAppPermission } from "@/utils/auth.utils";

const routes: Readonly<RouteRecordRaw[]> = [
    {
        path: "/",
        component: () => import("@/layout/MainLayout.vue"),
        redirect: "/auth/login",
        children: [
            {
                path: "404",
                name: "notFoundView",
                component: () => import("@/views/NotFoundView.vue"),
            },
            {
                path: "profile",
                name: "profileView",
                component: () => import("@/views/ProfileView.vue"),
            },
            {
                path: "auth",
                name: "authView",
                redirect: "/auth/login",
                children: [
                    {
                        path: "login",
                        name: "loginView",
                        meta: {
                            useAuth: false,
                        },
                        component: () => import("@/views/LoginView.vue"),
                    },
                ]
            },
            {
                path: "dashboard",
                name: "dashboardView",
                component: () => import("@/views/DashboardView.vue"),
            },
            {
                path: "product",
                name: "productView",
                meta: {
                    hasAccess: () =>  getStockAppPermission('product').view || getStockAppPermission('brand').view || getStockAppPermission('category').view || getStockAppPermission('unit').view,
                },
                component: () => import("@/layout/ProductLayout.vue"),
                redirect: "/product/data",
                children: [
                    {
                        path: "data",
                        name: "productListView",
                        meta: {
                            hasAccess: () =>  getStockAppPermission("product").view,
                        },
                        component: () => import("@/views/product/ProductView.vue"),
                        children: [
                            {
                                path: "add",
                                name: "addProductView",
                                meta: {
                                    hasAccess: () =>  getStockAppPermission("product").create,
                                },
                                component: () => import("@/views/product/product/AddProductView.vue"),
                            },
                            {
                                path: "edit",
                                name: "editProductView",
                                meta: {
                                    hasAccess: () =>  getStockAppPermission("product").update,
                                },
                                component: () => import("@/views/product/product/EditProductView.vue"),
                            }
                        ]
                    },
                    {
                        path: "category",
                        name: "productCategoryView",
                        meta: {
                            hasAccess: () =>  getStockAppPermission("category").view,
                        },
                        component: () => import("@/views/product/CategoryView.vue"),
                    },
                    {
                        path: "brand",
                        name: "productBrandView",
                        meta: {
                            hasAccess: () =>  getStockAppPermission("brand").view,
                        },
                        component: () => import("@/views/product/BrandView.vue"),
                    },
                    {
                        path: "unit",
                        name: "productUnitView",
                        meta: { 
                            hasAccess: () =>  getStockAppPermission("unit").view,
                        },
                        component: () => import("@/views/product/UnitView.vue"),
                    }
                ]
            },
            {
                path: "manage-product",
                name: "manageProductView",
                meta: { 
                    hasAccess: () =>  getStockAppPermission('product_in').view || getStockAppPermission('product_out').view || getStockAppPermission('product_mutation').view,
                },
                component: () => import("@/layout/ManageProductLayout.vue"),
                redirect: "/manage-product/product-in",
                children: [
                    {
                        path: "product-in",
                        name: "manageProductInView",
                        meta: { 
                            hasAccess: () =>  getStockAppPermission("product_in").view,
                         },
                        component: () => import("@/views/manageproduct/ProductInView.vue"),
                        children: [
                            {
                                path: "add",
                                name: "addProductInView",
                                meta: { 
                                    hasAccess: () =>  getStockAppPermission("product_in").create,
                                },
                                component: () => import("@/views/manageproduct/productIn/ProductInAddView.vue"),
                            },
                            {
                                path: "edit",
                                name: "editProductInView",
                                meta: { 
                                    hasAccess: () =>  getStockAppPermission("product_in").update,
                                },
                                component: () => import("@/views/manageproduct/productIn/ProductInEditView.vue"),
                            }
                        ]
                    },
                    {
                        path: "product-out",
                        name: "manageProductOutView",
                        meta: { 
                            hasAccess: () =>  getStockAppPermission("product_out").view,
                        },
                        component: () => import("@/views/manageproduct/ProductOutView.vue"),
                        children: [
                            {
                                path: "add",
                                name: "addProductOutView",
                                meta: { 
                                    hasAccess: () =>  getStockAppPermission("product_out").create,
                                },
                                component: () => import("@/views/manageproduct/productOut/ProductOutAddView.vue"),
                            },
                            {
                                path: "edit",
                                name: "editProductOutView",
                                meta: { 
                                    hasAccess: () =>  getStockAppPermission("product_out").update,
                                },
                                component: () => import("@/views/manageproduct/productOut/ProductOutEditView.vue"),
                            }
                        ]
                    },
                    {
                        path: "product-mutation",
                        name: "manageProductMutationView",
                        meta: {
                            hasAccess: () =>  getStockAppPermission("product_mutation").view,
                        },
                        component: () => import("@/views/manageproduct/ProductMutationView.vue"),
                        children: [
                            {
                                path: "add",
                                name: "addProductMutationView",
                                meta: { 
                                    hasAccess: () =>  getStockAppPermission("product_mutation").create,
                                },
                                component: () => import("@/views/manageproduct/productMutation/ProductMutationAddView.vue"),
                            },
                            {
                                path: "edit",
                                name: "editProductMutationView",
                                meta: { 
                                    hasAccess: () =>  getStockAppPermission("product_mutation").update,
                                },
                                component: () => import("@/views/manageproduct/productMutation/ProductMutationEditView.vue"),
                            }
                        ]
                    }
                ]
            },
            {
                path: "report",
                name: "reportView",
                meta: { 
                    hasAccess: () =>  getStockAppPermission('product_in').view && getStockAppPermission('product_out').view && getStockAppPermission('product_mutation').view,
                },
                component: () => import("@/layout/ReportLayout.vue"),
                redirect: "/report/product-in",
                children: [
                    {
                        path: "product-in",
                        name: "reportProductInView",
                        meta: { 
                            hasAccess: () =>  getStockAppPermission("product_in").view && getStockAppPermission("product_out").view && getStockAppPermission("product_mutation").view,
                        },
                        component: () => import("@/views/report/ReportProductInView.vue"),
                    },
                    {
                        path: "product-out",
                        name: "reportProductOutView",
                        meta: { 
                            hasAccess: () =>  getStockAppPermission("product_out").view && getStockAppPermission("product_mutation").view && getStockAppPermission("product_in").view,
                        },
                        component: () => import("@/views/report/ReportProductOutView.vue"),
                    },
                    {
                        path: "product-mutation",
                        name: "reportProductMutationView",
                        meta: { 
                            hasAccess: () =>  getStockAppPermission("product_mutation").view && getStockAppPermission("product_in").view && getStockAppPermission("product_out").view,
                        },
                        component: () => import("@/views/report/ReportProductMutationView.vue"),
                    }
                ]
            },
            {
                path: "settings",
                name: "settingsView",
                meta: { 
                    hasAccess: () =>  getStockAppPermission('setting_user').view || getStockAppPermission('setting_role').view,
                },
                component: () => import("@/layout/SettingsLayout.vue"),
                redirect: "/settings/users",
                children: [
                    {
                        path: "users",
                        name: "usersView",
                        meta: { 
                            hasAccess: () =>  getStockAppPermission("setting_user").view,
                         },
                        component: () => import("@/views/settings/UsersView.vue"),
                        children: [
                            {
                                path: "add",
                                name: "addUserView",
                                meta: { 
                                    hasAccess: () =>  getStockAppPermission("setting_user").create,
                                 },
                                component: () => import("@/views/settings/user/AddUserView.vue"),
                            },
                            {
                                path: "edit",
                                name: "editUserView",
                                meta: { 
                                    hasAccess: () =>  getStockAppPermission("setting_user").update,
                                },
                                component: () => import("@/views/settings/user/EditUserView.vue"),
                            },
                            {
                                path: 'detail',
                                name: "userDetailView",
                                meta: { 
                                    hasAccess: () =>  getStockAppPermission("setting_user").view,
                                },
                                component: () => import("@/views/settings/user/DetailUserView.vue"),
                            }
                        ]
                    },
                    {
                        path: "role",
                        name: "roleView",
                        meta: { 
                            hasAccess: () =>  getStockAppPermission("setting_role").view,
                         },
                        component: () => import("@/views/settings/RoleView.vue"),
                        children: [
                            {
                                path: "add",
                                name: "addRoleView",
                                meta: {
                                    hasAccess: () =>  getStockAppPermission("setting_role").create,
                                },
                                component: () => import("@/views/settings/role/AddRoleView.vue"),
                            },
                            {
                                path: "edit",
                                name: "editRoleView",
                                meta: {
                                    hasAccess: () =>  getStockAppPermission("setting_role").update,
                                },
                                component: () => import("@/views/settings/role/EditRoleView.vue"),
                            }
                        ]
                    }
                ]
            },
            {
                path: 'store',
                name: "storeView",
                meta: { 
                    hasAccess: () =>  getStockAppPermission('store').view || getStockAppPermission('store_stock').view,
                 },
                component: () => import("@/views/StoreView.vue"),
                children: [
                    {
                        path: "stock",
                        name: "addStoreView",
                        meta: { 
                            hasAccess: () =>  getStockAppPermission("store_stock").view,
                        },
                        component: () => import("@/views/store/StoreStockView.vue"),
                    }
                ]
            },
            {
                path: "warehouse",
                name: "warehouseView",
                meta: { 
                    hasAccess: () =>  getStockAppPermission('warehouse_stock').view,
                },
                component: () => import("@/views/WareHouseView.vue"),
            }
        ]
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/404",
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
    middleware(to, from, next);
});

export default router;