export type Icons = 
    'arrow-up-s' | 'arrow-right-s' | 'arrow-down-s' | 'arrow-left-s' | 'arrow-down' | 'arrow-left' | 'arrow-right' |
    'arrow-up-down' | 'filter' |'sort-asc' | 'sort-desc' | 'more' | 'dashboard' |'inbox' | 'edit-box' | 'logout-box' |
    'box-3' | 'inbox-archive' | 'store' | 'home-4' | 'file-list' | 'settings' | 'group' | 'download-2' | 'import' | 'close' |'notification' |
    'eye' | 'eye-close' | 'file-copy' | 'information' | 'book-2' | 'check' | 'arrow-left-double' | 'arrow-right-double' |
    'user' | 'user-3' | 'sidebar-fold' | 'sidebar-unfold' | 'menu' | 'delete-bin' | 'edit-2' | 'logout-box' | 'file-info' | 'add' |
    'search' | 'printer' | 'price-tag' | 'list-unordered' |'scales-2' |'folder-check' | 'folder-warning';

export type IconsSeverity =
    | 'danger'
    | 'info'
    | 'warning'
    | 'primary'
    | 'success'
    | 'secondary'


export interface IconsProps {
    icon: Icons;
    severity?: IconsSeverity;
    tooltipPos?: 'top' | 'right' | 'bottom' | 'left';
    class?: any;
    info?: string;
    type?: 'fill' | 'line' | 'none';
}