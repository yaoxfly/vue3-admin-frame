# LayMenu 侧边栏菜单组件

## 概述

LayMenu 是应用的侧边栏菜单组件，基于 Element Plus 的菜单组件封装。支持多级菜单、图标显示、折叠展开等功能，为用户提供清晰的导航结构。

## 特性

- 📋 **多级菜单**：支持无限层级的菜单嵌套
- 🏷️ **菜单分组**：支持菜单项分组显示
- 🎨 **图标支持**：支持图片和 SVG 图标
- 📱 **折叠展开**：支持菜单的折叠和展开
- 🔗 **路由集成**：点击菜单自动跳转并添加到标签页
- 💫 **动画效果**：平滑的折叠展开动画

## 基础用法

```tsx
import LayMenu from '@/layout/component/lay-menu/src'
import logoImg from '@/assets/logo.png'

// 基础使用
<LayMenu data={menuData} logo={logoImg} />
```

## Props

| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
|------|------|------|--------|----------|
| data | 菜单数据 | `MenuItem[]` | - | 是 |
| logo | 系统 logo 图片 | `string` | `''` | 否 |
| - | Element Plus Menu 的所有属性 | `Object` | - | 否 |

## 数据结构

### MenuItem 类型

```typescript
import type { MenuItemProps, SubMenuProps } from 'element-plus'

export type MenuItem = Partial<MenuItemProps> & Partial<SubMenuProps> & {
  icon?: any           // 图标，支持字符串(图片路径)或组件
  title?: string       // 菜单标题
  children?: MenuItem[] // 子菜单
  groupTitle?: string  // 分组标题，有此字段时渲染为菜单分组
}
```

### 菜单数据示例

```typescript
const menuData: MenuItem[] = [
  {
    title: '系统管理',
    icon: SettingIcon,
    children: [
      {
        groupTitle: '用户管理',
        children: [
          { index: '/user/list', title: '用户列表', icon: UserIcon },
          { index: '/user/role', title: '角色管理', icon: RoleIcon }
        ]
      },
      {
        groupTitle: '系统设置',
        children: [
          { index: '/system/config', title: '系统配置' },
          { index: '/system/log', title: '系统日志' }
        ]
      }
    ]
  },
  {
    index: '/dashboard',
    title: '仪表盘',
    icon: '/assets/dashboard.png'
  }
]
```

## 功能说明

### 菜单渲染

组件会根据数据结构自动渲染不同类型的菜单：

1. **有 children 且有 groupTitle**：渲染为菜单分组 (`el-menu-item-group`)
2. **有 children 但无 groupTitle**：渲染为子菜单 (`el-sub-menu`)
3. **无 children**：渲染为菜单项 (`el-menu-item`)


## 样式定制

### CSS Modules 类名

```scss
// lay-menu/style/index.module.scss
.lay-menu {
  // 菜单容器样式
}

.menu-title {
  // 顶部标题区域样式
}

.logo {
  // Logo 样式
}

.system-name {
  // 系统名称样式
}

.el-menu-vertical {
  // 垂直菜单样式
}

.collapse-icon {
  // 折叠按钮样式
}

.menu-icon {
  // 菜单图标样式
}
```

### 自定义样式

```scss
// 全局样式覆盖
.lay-menu {
  .menu-title {
    background: #001529;
    color: #fff;
  }

  .el-menu-vertical {
    background: #f6f6f6;
  }
}
```

## 布局集成

LayMenu 通常在主布局的左侧使用：

```tsx
// layout/index.tsx
<div class={styles.layout}>
  {!fill.value && <La  yMenu data={menu} logo={localIcon}></LayMenu>}
  <div class={styles['layout-right']}>
    {/* 右侧内容 */}
  </div>
</div>
```

## 与路由系统集成

### 菜单数据来源

```typescript
// store/menu.ts
const initialMenu: MenuItem[] = [
  {
    title: '范例',
    icon: markRaw(Location),
    children: [
      {
        groupTitle: '分组1',
        children: [
          { index: '/test', title: '演示' }
        ]
      }
    ]
  },
  {
    index: '/tag-test',
    title: '标签测试',
    icon: markRaw(Location)
  }
]
```

### 自动生成路由

菜单数据会通过 `generateRoutesFromMenu` 函数自动生成对应的路由：

```typescript
// 从菜单生成路由
const routes = generateRoutesFromMenu(menuStore.getMenu)
routes.forEach(route => {
  router.addRoute('layout', route)
})
```

## 响应式设计

### 移动端适配

```scss
@media screen and (max-width: 768px) {
  .lay-menu {
    width: 200px;

    &.collapse {
      width: 64px;
    }
  }
}
```

### 折叠状态

```scss
.menu-title {
  &.el-menu--collapse {
    .system-name {
      opacity: 0;
    }
  }
}

.collapse-icon {
  &.el-menu--collapse {
    justify-content: center;
  }
    }
```

## 最佳实践

### 菜单数据管理

1. **使用 Pinia Store**：统一管理菜单数据
2. **数据持久化**：可考虑缓存菜单数据到 localStorage
3. **权限控制**：根据用户权限过滤菜单项

### 图标使用建议

1. **SVG 组件**：推荐使用 SVG 组件图标，体积小且可定制
2. **图片图标**：对于复杂图标可使用图片，注意压缩大小
3. **统一风格**：保持图标风格的一致性

### 性能优化

1. **图标懒加载**：对于大量图标可考虑懒加载
2. **菜单虚拟化**：对于超长菜单可考虑虚拟滚动
3. **缓存策略**：合理使用缓存减少重复渲染

## 注意事项

1. **index 字段**：菜单项的 `index` 字段必须与路由路径对应
2. **图标导入**：使用 `markRaw` 包装图标组件避免响应式处理
3. **嵌套层级**：虽然支持无限嵌套，但建议控制在 3 层以内
4. **移动端体验**：在移动端考虑使用抽屉模式展示菜单
