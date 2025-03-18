import type { MenuItemProps, SubMenuProps } from 'element-plus'
export type MenuItem = Partial<MenuItemProps> & Partial<SubMenuProps> & {
  icon?: any
  title?: string
  children?: MenuItem[]
  groupTitle?: string
}
