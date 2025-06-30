# LayHeaderBar 头部导航栏组件

## 概述

LayHeaderBar 是应用布局的头部导航栏组件，集成了面包屑导航和全屏功能。为用户提供清晰的导航信息和便捷的全屏操作。

## 特性

- 🧭 **面包屑导航**：集成 LayBreadcrumb 组件，显示当前页面位置
- 🖥️ **全屏切换**：支持应用全屏显示和退出全屏
- 🎨 **简洁设计**：简洁的头部布局，不占用过多空间
- 📱 **响应式**：适配不同屏幕尺寸

## 基础用法

```tsx
import LayHeaderBar from '@/layout/component/lay-header-bar/src'

// 直接使用，无需传入参数
<LayHeaderBar />
```

## 功能说明

### 面包屑导航

头部左侧展示面包屑导航，自动显示当前页面的导航路径：

```tsx
// 组件内部集成
<LayBreadcrumb></LayBreadcrumb>
```

### 全屏功能

头部右侧提供全屏切换按钮：

- **进入全屏**：点击全屏图标，应用进入全屏模式
- **退出全屏**：全屏状态下点击图标，退出全屏模式
- **图标状态**：根据当前状态自动切换图标和点击事件



## 样式定制

组件使用 CSS Modules，可通过以下方式定制样式：

```scss
// lay-header-bar/style/index.module.scss
.lay-header-bar {
  width: 100%;
  height: 48px;
  background: #fff;
  border-bottom: 1px solid $border;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}
```

### 自定义样式

```scss
// 全局样式覆盖
.lay-header-bar {
  background: #f5f7fa !important;
  height: 56px !important;
}
```

## 布局集成

LayHeaderBar 通常在主布局中使用：

```tsx
// layout/index.tsx
<div class={styles['layout-right']}>
  {!fill.value && <LayHeaderBar></LayHeaderBar>}
  <LayTag fill={fill.value}></LayTag>
  <div class={styles['router-view-container']}>
    <router-view />
  </div>
</div>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| - | 无需传入参数 | - | - |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| - | 无自定义事件 | - |

## 依赖组件

- **LayBreadcrumb**：面包屑导航组件
- **Element Plus**：使用 el-icon 组件

## 浏览器兼容性

### Fullscreen API 支持

- Chrome 15+
- Firefox 10+
- Safari 5.1+
- Edge 12+

### 降级处理

组件会检查浏览器是否支持 `requestFullscreen` API：

```typescript
if (elem?.requestFullscreen) {
  elem.requestFullscreen()
  fullScreen.value = true
}
```

如果不支持，点击全屏按钮不会有任何效果。

## 注意事项

1. **DOM 依赖**：全屏功能依赖 `#app` 元素，确保根元素 ID 正确
2. **权限要求**：全屏 API 需要用户手势触发，不能自动调用
3. **状态同步**：组件内部维护全屏状态，与浏览器实际状态可能不同步
4. **样式影响**：进入全屏后，CSS 样式可能需要相应调整
