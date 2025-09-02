import type { MenuItem } from "@/components/menu/Menu.vue.d";

const filterVisibleMenu = (
  menuItems: MenuItem[],
  noOptionLabel?: string,
): MenuItem[] => {
  const emptyMenu: MenuItem = {
    label: noOptionLabel,
    disabled: true,
  };

  const visibleMenu = menuItems.filter((menu) => menu.visible !== false);

  return visibleMenu.length ? visibleMenu : [emptyMenu];
};

export default filterVisibleMenu;