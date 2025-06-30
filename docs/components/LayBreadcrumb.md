# LayBreadcrumb 面包屑组件

## 概述

LayBreadcrumb 是一个智能面包屑导航组件，基于 Element Plus 的 el-breadcrumb 封装。它会自动从当前路由的 meta 信息中读取面包屑数据，并智能处理点击行为。

## 特性

- 🔄 **自动获取**：自动从路由 meta.breadcrumb 中获取面包屑数据
- 🎯 **智能点击**：除最后一项外的面包屑项可点击跳转
- 📍 **路径保持**：支持完整的路径和查询参数
- 🎨 **样式继承**：继承 Element Plus 面包屑的所有样式和属性

## 基础用法

```tsx
import LayBreadcrumb from '@/layout/component/lay-breadcrumb/src'

// 直接使用，无需传入任何参数
<LayBreadcrumb />

// 支持 Element Plus 的所有 breadcrumb 属性
<LayBreadcrumb separator=">" />
```

## 数据结构

### Breadcrumb 类型

```typescript
export type Breadcrumb = {
  title: string  // 面包屑显示的标题
  path: string   // 面包屑对应的路径
}
```

### 路由 Meta 配置

```typescript
// 在路由配置中设置面包屑
{
  path: '/user/detail',
  component: UserDetail,
  meta: {
    breadcrumb: [
      { title: '用户管理', path: '/user' },
      { title: '用户详情', path: '/user/detail' }
    ]
  }
}
```

## 工作原理

1. **自动读取**：组件会监听 `router.currentRoute.value.meta.breadcrumb`
2. **智能渲染**：最后一项显示为普通文本，其他项显示为可点击链接
3. **路由跳转**：点击面包屑项会使用 Vue Router 进行跳转

## 集成说明

### 菜单路由

菜单路由的面包屑由 `generateRoutesFromMenu` 函数自动生成：

```typescript
// 自动生成面包屑
const currentBreadcrumb = item.groupTitle
  ? [...parentBreadcrumb]
  : [...parentBreadcrumb, { title: item.title || '', path: fullPath || '' }]
```

### 非菜单路由

非菜单路由（如详情页）的面包屑由路由守卫自动生成：

```typescript
// 继承上一页面包屑并添加当前页
to.meta.breadcrumb = [
  ...(Array.isArray(prevBreadcrumb) ? prevBreadcrumb : []),
  { title: detailTitle, path: to.path }
]
```

## 样式定制

组件继承 Element Plus 面包屑的所有样式，可以通过以下方式定制：

```scss
// 全局样式覆盖
.el-breadcrumb {
  font-size: 14px;
}

.el-breadcrumb__item {
  color: #606266;
}
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| - | 继承 Element Plus Breadcrumb 的所有属性 | Object | - |

## 注意事项

1. **路由依赖**：组件依赖 Vue Router，确保在路由环境中使用
2. **Meta 数据**：确保路由的 meta.breadcrumb 数据格式正确
3. **最后一项**：面包屑最后一项（当前页）不可点击
4. **空路径**：如果面包屑项没有 path，该项也不可点击

## 示例

### 典型使用场景

```typescript
// 路由配置
{
  path: '/product/category/detail',
  component: ProductDetail,
  meta: {
    breadcrumb: [
      { title: '商品管理', path: '/product' },
      { title: '分类管理', path: '/product/category' },
      { title: '商品详情', path: '/product/category/detail' }
    ]
  }
}
```

显示效果：
```
商品管理 / 分类管理 / 商品详情
```

其中"商品管理"和"分类管理"可点击，"商品详情"为当前页不可点击。
