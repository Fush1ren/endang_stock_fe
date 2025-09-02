export type BreadcrumbMenu = {
    name: string;
    route?: string;
    title?: string;
  };
  
export interface BreadcrumbProps {

    menus: BreadcrumbMenu[];
}