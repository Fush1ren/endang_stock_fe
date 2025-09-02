import type { BreadcrumbMenu } from "@/components/breadcrumb/Breadcrumb.vue.d";

export const getMainRouteMenu = (route: string): BreadcrumbMenu => {
    let routeMenu;
    if (route === 'dashboard') {
        routeMenu = {
            name: 'Dasboard',
            route: '/dashboard',
        }
    }
    if (route === 'product') {
        routeMenu ={
            name: 'Produk',
            route: '/product',
        }
    }
    if (route === 'store') {
        routeMenu = {
            name: 'Toko',
            route: '/store',
        }
    }
    if (route === 'warehouse') {
        routeMenu = {
            name: 'Gudang',
            route: '/warehouse',
        }
    }
    if (route === 'report') {
        routeMenu = {
            name: 'Laporan',
            route: '/report',
        }
    }
    if (route === 'settings') {
        routeMenu = {
            name: 'Pengaturan',
            route: '/settings',
        }
    }
    return routeMenu as BreadcrumbMenu;
}

export const getChildRouteMenu = (route: string, mainPath: string): BreadcrumbMenu => {
    let routeMenu;
    if (route === 'brand') {
        routeMenu = {
            name: 'Merek',
            route: `${mainPath}/brand`,
        }
    }
    if (route === 'category') {
        routeMenu = {
            name: 'Kategori',
            route: `${mainPath}/category`,
        }
    }
    if (route === 'unit') {
        routeMenu = {
            name: 'Satuan',
            route: `${mainPath}/unit`,
        }
    }   
    if (route === 'data') {
        routeMenu = {
            name: 'Data Barang',
            route: `${mainPath}/data`,
        }
    }
    if (route === 'product-in') {
        routeMenu = {
            name: 'Barang Masuk',
            route: `${mainPath}/product-in`,
        }
    }
    if (route === 'product-out') {
        routeMenu = {
            name: 'Barang Keluar',
            route: `${mainPath}/product-out`,
        }
    }
    if (route === 'product-mutation') {
        routeMenu = {
            name: 'Mutasi Barang',
            route: `${mainPath}/product-mutation`,
        }
    }
    if (route === 'user') {
        routeMenu = {
            name: 'Pengguna',
            route: `${mainPath}/user`,
        }
    }
    if (route === 'role') {
        routeMenu = {
            name: 'Role',
            route: `${mainPath}/role`,
        }
    }
    return routeMenu as BreadcrumbMenu;
}

export const getActionRouteMenu = (route: string, mainPath: string): BreadcrumbMenu => {
    let routeMenu;
    if (route === 'add') {
        routeMenu = {
            name: 'Tambah',
            route: `${mainPath}/add`,
        }
    }
    if (route === 'edit') {
        routeMenu = {
            name: 'Edit',
            route: `${mainPath}/edit`,
        }
    }
    if (route === 'detail') {
        routeMenu = {
            name: 'Detail',
            route: `${mainPath}/detail`,
        }
    }
    return routeMenu as BreadcrumbMenu;
}