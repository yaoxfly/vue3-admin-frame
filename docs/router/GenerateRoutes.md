# 路由自动生成系统

## 概述

Vue3 Admin Frame 提供了一套完整的路由自动生成系统，能够根据菜单配置和文件结构自动生成对应的路由。系统分为两部分：**菜单路由生成**和**非菜单路由生成**。

## 系统架构

```
路由生成系统
├── generateRoutesFromMenu   # 菜单路由生成
├── generateNonMenuRoutes    # 非菜单路由生成
├── routerGuard             # 路由守卫
└── dynamicRoutes           # 动态路由注册
```

## 菜单路由生成 (generateRoutesFromMenu)

### 功能说明

根据菜单配置自动生成对应的路由，支持多级菜单和面包屑自动生成。

### 核心特性

- 🔍 **文件扫描**：自动扫描 `@/views/**/index.tsx` 文件
- 📋 **菜单匹配**：根据菜单配置匹配对应的页面文件
- 🧭 **面包屑生成**：自动生成层级面包屑导航
- 🏷️ **分组支持**：支持菜单分组，分组不计入面包屑
- 🎯 **路径规范化**：自动转换为 PascalCase 路由名称

### 使用方法

```typescript
import { generateRoutesFromMenu } from '@/router/generateRoutesFromMenu'
import { useMenuStore } from '@/store/menu'

// 生成菜单路由
const menuStore = useMenuStore()
const routes = generateRoutesFromMenu(menuStore.getMenu)

// 注册到路由
routes.forEach(route => {
  router.addRoute('layout', route)
})
```

### 菜单配置示例

```typescript
const menuData: MenuItem[] = [
  {
    title: '系统管理',
    icon: SettingIcon,
    children: [
      {
        groupTitle: '用户管理', // 分组，不生成路由
        children: [
          {
            index: '/user/list',    // 对应 @/views/user/list/index.tsx
            title: '用户列表',
            icon: UserIcon
          },
          {
            index: '/user/role',    // 对应 @/views/user/role/index.tsx
            title: '角色管理',
            icon: RoleIcon
          }
        ]
      }
    ]
  },
  {
    index: '/dashboard',          // 对应 @/views/dashboard/index.tsx
    title: '仪表盘',
    icon: DashboardIcon
  }
]
```

### 生成的路由结构

```typescript
// 根据上述菜单配置生成的路由
[
  {
    path: '/user/list',
    name: 'UserList',
    component: () => import('@/views/user/list/index.tsx'),
    meta: {
      title: '用户列表',
      breadcrumb: [
        { title: '系统管理', path: '/system' },
        { title: '用户列表', path: '/user/list' }
      ]
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.tsx'),
    meta: {
      title: '仪表盘',
      breadcrumb: [
        { title: '仪表盘', path: '/dashboard' }
      ]
    }
  }
]
```

### 面包屑生成规则

1. **非分组菜单项**：加入面包屑
2. **分组菜单项**：不加入面包屑，但子项继承父级面包屑
3. **层级关系**：自动维护父子层级关系

```typescript
// 面包屑生成逻辑
const currentBreadcrumb = item.groupTitle
  ? [...parentBreadcrumb]  // 分组不加入面包屑
  : [...parentBreadcrumb, { title: item.title || '', path: fullPath || '' }]
```

### 路由名称转换

```typescript
/**
 * 将路径转换为 PascalCase 格式
 * 例如: '/user-management' -> 'UserManagement'
 */
const toPascalCase = (path: string): string => {
  return path
    .replace(/^\//, '')           // 去掉开头的斜杠
    .split('-')                   // 按短横线分割
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}
```

## 非菜单路由生成 (generateNonMenuRoutes)

### 功能说明

自动扫描并生成非菜单路由，主要用于详情页、编辑页等不在菜单中显示的页面。

### 核心特性

- 📂 **文件扫描**：扫描 `@/views/**/*.tsx`（排除 index.tsx）
- 🚫 **智能过滤**：自动排除 `component` 目录下的文件
- 🧭 **动态面包屑**：通过路由守卫动态生成面包屑
- 🏷️ **自动标记**：自动添加 `nonMenu: true` 标记
- 📍 **路径推导**：根据文件路径自动推导路由路径

### 使用方法

```typescript
import { generateNonMenuRoutes } from '@/router/generateNonMenuRoutes'

// 生成非菜单路由
const nonMenuRoutes = generateNonMenuRoutes()

// 注册到路由
nonMenuRoutes.forEach(route => {
  router.addRoute('layout', route)
})
```

### 文件扫描规则

```typescript
// 扫描的文件
const modules = import.meta.glob('@/views/**/*.tsx', { eager: false })

// 过滤规则
Object.keys(modules).forEach((key) => {
  // 排除 index.tsx 文件
  if (key.endsWith('/index.tsx')) return

  // 排除 component 目录
  if (key.includes('/component/')) return

  // 生成路由...
})
```

### 路径转换示例

```typescript
// 文件路径 -> 路由路径
'@/views/user/detail.tsx'     -> '/user/detail'
'@/views/product/edit.tsx'    -> '/product/edit'
'@/views/order/view.tsx'      -> '/order/view'

// 排除的文件
'@/views/user/index.tsx'      -> 排除（菜单路由）
'@/views/component/form.tsx'  -> 排除（组件文件）
```

### 生成的路由结构

```typescript
// 生成的非菜单路由示例
[
  {
    path: '/user/detail',
    name: 'UserDetail',
    component: () => import('@/views/user/detail.tsx'),
    meta: {
      title: '',
      nonMenu: true  // 标记为非菜单路由
    }
  },
  {
    path: '/product/edit',
    name: 'ProductEdit',
    component: () => import('@/views/product/edit.tsx'),
    meta: {
      title: '',
      nonMenu: true
    }
  }
]
```

## 路由守卫集成

### 面包屑自动生成

路由守卫会为非菜单路由自动生成面包屑：

```typescript
router.beforeEach(async (to, from, next) => {
  // 只处理非菜单路由
  if (to.meta.nonMenu) {
    // 继承上一个页面的面包屑
    const prevBreadcrumb = from.meta.breadcrumb || []

    // 生成详情页标题
    const detailTitle = to.meta.title || `${from.meta.title || ''}详情`

    // 生成新的面包屑
    to.meta.breadcrumb = [
      ...(Array.isArray(prevBreadcrumb) ? prevBreadcrumb : []),
      { title: detailTitle, path: to.path }
    ]
  }

  next()
})
```

### 标签页自动添加

路由守卫也会自动将页面添加到标签页：

```typescript
router.afterEach((to, from) => {
  // 自动添加所有有效路由到标签页
  if (to.meta && (to.meta.title || to.meta.nonMenu)) {
    const layTagStore = useLayTag()
    let title = ''

    if (to.meta.title) {
      title = to.meta.title as string
    } else if (to.meta.nonMenu) {
      // 非菜单路由使用生成的标题
      const detailTitle = to.meta.title || `${from.meta?.title || ''}详情`
      title = detailTitle as string
    } else {
      title = (to.name as string) || '未命名页面'
    }

    layTagStore.setTag(to.path, title)
  }
})
```

## 动态路由注册

### 完整注册流程

```typescript
// router/dynamicRoutes.ts
export const dynamicRoutes = async (router: Router) => {
  const menuStore = useMenuStore()

  // 1. 生成菜单路由
  let routes = generateRoutesFromMenu(menuStore.getMenu)

  // 2. 生成非菜单路由
  const nonMenuRoutes = generateNonMenuRoutes()

  // 3. 合并路由
  routes = [...routes, ...nonMenuRoutes]

  // 4. 注册到 layout 路由下
  routes.forEach(route => {
    router.addRoute('layout', route)
  })

  // 5. 添加 404 路由
  router.addRoute('layout', {
    path: ':pathMatch(.*)*',
    name: 'demo-404',
    component: () => import('@/views/404/index'),
    meta: {
      breadcrumb: [
        { title: '异常页面' },
        { title: '404' }
      ]
    }
  })

  // 6. 全局 404 路由
  router.addRoute({
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404/index')
  })

  menuStore.isLoaded = true
}
```

## 最佳实践

### 文件组织结构

```
src/views/
├── dashboard/
│   └── index.tsx          # 菜单路由
├── user/
│   ├── index.tsx          # 菜单路由：用户列表
│   ├── detail.tsx         # 非菜单路由：用户详情
│   └── edit.tsx           # 非菜单路由：编辑用户
├── product/
│   ├── index.tsx          # 菜单路由：商品列表
│   ├── detail.tsx         # 非菜单路由：商品详情
│   └── component/         # 组件目录（不会生成路由）
│       └── form.tsx
└── 404/
    └── index.tsx          # 错误页面
```

### 菜单配置规范

```typescript
// 推荐的菜单配置方式
const menuConfig = [
  {
    title: '一级菜单',
    icon: Icon,
    children: [
      {
        groupTitle: '功能分组',  // 分组标题
        children: [
          {
            index: '/module/list',    // 必须：路由路径
            title: '列表页',          // 必须：菜单标题
            icon: ListIcon           // 可选：图标
          }
        ]
      }
    ]
  }
]
```

### 页面文件规范

```typescript
// views/user/index.tsx - 菜单路由
export default defineComponent({
  name: 'UserList',  // 建议使用 PascalCase
  setup() {
    return () => (
      <Container>
        <div>用户列表页面</div>
      </Container>
    )
  }
})

// views/user/detail.tsx - 非菜单路由
export default defineComponent({
  name: 'UserDetail',  // 建议使用 PascalCase
  setup() {
    return () => (
      <Container>
        <div>用户详情页面</div>
      </Container>
    )
  }
})
```

### 面包屑优化

```typescript
// 为非菜单路由设置自定义标题
{
  path: '/user/detail',
  component: UserDetail,
  meta: {
    title: '用户详情',  // 自定义标题，不使用默认的"详情"
    nonMenu: true
  }
}
```

## 性能优化

### 懒加载

所有路由都使用动态导入实现懒加载：

```typescript
// 自动生成的懒加载
component: () => import('@/views/user/index.tsx')

// 而不是直接导入
import UserIndex from '@/views/user/index.tsx'
```

### 路由预加载

```typescript
// 可以为重要路由添加预加载
{
  path: '/dashboard',
  component: () => import(
    /* webpackChunkName: "dashboard" */
    /* webpackPreload: true */
    '@/views/dashboard/index.tsx'
  )
}
```

## 调试和排错

### 开发工具

```typescript
// 开启路由生成日志
console.log('生成的菜单路由:', routes)
console.log('生成的非菜单路由:', nonMenuRoutes)

// 检查文件扫描结果
console.log('扫描到的文件:', Object.keys(modules))
```

### 常见问题

1. **路由不生成**：检查文件命名是否符合规范
2. **面包屑错误**：检查菜单配置的层级关系
3. **页面404**：确认文件路径与菜单配置匹配
4. **重复路由**：检查是否有重复的路径配置

### 类型检查

```typescript
// 使用 TypeScript 确保类型安全
import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from '@/store/menu'

// 确保返回正确的路由类型
export const generateRoutesFromMenu = (
  menus: MenuItem[],
  allPaths: string[] = Object.keys(modules)
): RouteRecordRaw[] => {
  // 实现...
}
```

## 扩展功能

### 权限控制

```typescript
// 在路由生成时添加权限控制
const route: RouteRecordRaw = {
  path: fullPath || '',
  name: toPascalCase(fullPath || ''),
  component: modules[viewPath],
  meta: {
    title: item.title,
    breadcrumb: currentBreadcrumb,
    requireAuth: true,        // 需要登录
    roles: ['admin', 'user']  // 允许的角色
  }
}
```

### 路由元信息扩展

```typescript
// 扩展路由元信息
meta: {
  title: item.title,
  breadcrumb: currentBreadcrumb,
  icon: item.icon,
  hidden: false,           // 是否隐藏
  keepAlive: true,         // 是否缓存
  affix: false,           // 是否固定标签
  noRedirect: false       // 是否禁止重定向
}
```
