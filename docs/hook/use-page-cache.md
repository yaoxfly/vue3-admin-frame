# usePageCache Hook 使用说明

## 功能描述

`usePageCache` 是一个用于管理页面缓存的 Vue 3 Hook，它能够智能地控制页面的缓存行为：

- **返回操作**：当用户通过浏览器后退按钮或 `router.back()` 返回到页面时，该页面会保持缓存状态
- **前进操作**：当用户通过 `router.push()` 跳转到页面时，该页面不会被缓存（会重新渲染）

## 全局路由守卫说明

Hook 内部注册了全局路由守卫，这是实现智能缓存控制的核心机制：

1. **自动缓存控制**：
   - 离开页面时：自动缓存当前页面
   - 进入页面时：根据导航类型决定是否保持缓存

2. **导航类型判断**：
   - 通过监听浏览器 `popstate` 事件判断是返回还是前进操作
   - 返回操作：保持目标页面缓存
   - 前进操作：清除目标页面缓存

3. **单例模式**：
   - 使用全局标记确保路由守卫只注册一次
   - 所有使用 Hook 的组件共享同一个路由守卫，避免重复注册

## 基础用法

```tsx
import { usePageCache } from '@/hooks/use-page-cache'

export default defineComponent({
  name: 'MyComponent',
  setup() {
    // 基础用法，自动使用组件名称
    const { enableCache, disableCache, pushWithoutCache, currentComponentName } = usePageCache()

    // 或者手动指定组件名称
    const cache = usePageCache('MyComponent')

    const handleNavigation = () => {
      // 普通跳转（会清除目标页面缓存）
      router.push('/other-page')

      // 强制无缓存跳转
      pushWithoutCache('/other-page')
    }

    return { handleNavigation }
  }
})
```

## API 说明

### 参数

- `componentName?: string` - 可选的组件名称，如果不提供则自动从路由中获取

### 返回值

#### 缓存控制方法
- `enableCache(name?: string)` - 启用指定组件的缓存
- `disableCache(name?: string)` - 禁用指定组件的缓存
- `clearAllCache()` - 清空所有缓存

#### 路由跳转方法
- `pushWithoutCache(location)` - 无缓存跳转，会清除目标页面的缓存

#### 状态信息
- `currentComponentName` - 当前组件名称

## 工作原理

1. **路由历史跟踪**：Hook 会跟踪用户的路由访问历史
2. **导航类型判断**：通过分析路由历史和浏览器事件，判断是返回操作还是前进操作
3. **智能缓存控制**：
   - 返回操作：保持目标页面缓存
   - 前进操作：清除目标页面缓存
4. **全局守卫**：使用 Vue Router 的全局前置守卫来实现缓存控制

## 注意事项

1. 该 Hook 依赖项目中已有的 `useKeepAliveStore` store
2. 路由组件必须设置正确的 `name` 属性
3. 在 `<router-view>` 外层需要包裹 `<KeepAlive>` 组件
4. 第一次使用 Hook 的组件会注册全局路由守卫，后续组件复用该守卫

## 示例场景

### 场景 1：列表页 → 详情页 → 返回列表页
```
用户操作流程：
1. 在列表页滚动到某个位置，筛选了某些条件
2. 点击某个项目进入详情页
3. 点击浏览器后退按钮返回列表页

期望结果：
- 列表页保持之前的滚动位置和筛选条件（缓存状态）

使用方式：
- 列表页和详情页都使用 usePageCache()
- 正常的路由跳转，Hook 会自动处理缓存逻辑
```

### 场景 2：强制刷新页面
```tsx
const { pushWithoutCache } = usePageCache()

// 当需要强制刷新某个页面时
const refreshPage = () => {
  pushWithoutCache('/current-page') // 清除缓存重新加载
}
```
