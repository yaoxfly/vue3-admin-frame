# LayTag 标签页组件

## 概述

LayTag 是一个功能丰富的标签页管理组件，支持标签的增删改查、右键菜单、滚动控制、全屏切换等功能。为用户提供便捷的页面导航和管理体验。

## 特性

- 🏷️ **标签管理**：支持标签的添加、删除、激活切换
- 🖱️ **右键菜单**：丰富的右键操作菜单
- 📜 **智能滚动**：超出宽度时支持水平滚动和箭头导航
- 🔄 **页面刷新**：支持单页面刷新功能
- 📱 **全屏模式**：支持内容区全屏显示
- 🎨 **美观设计**：现代化的标签页设计风格
- ⌨️ **键盘支持**：支持键盘快捷键操作

## 基础用法

```tsx
import LayTag from '@/layout/component/lay-tag/src'

// 基础使用
<LayTag />

// 自定义首页设置
<LayTag
  homeSet={{ title: '控制台', path: '/dashboard' }}
  fill={false}
/>
```

## Props

| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
|------|------|------|--------|----------|
| homeSet | 首页标签配置 | `{ title: string, path: string }` | `{ title: '首页', path: '/home' }` | 否 |
| fill | 是否全屏模式 | `boolean` | `false` | 否 |

## 数据结构

### TagItem 类型

```typescript
interface TagItem {
  path: string  // 标签对应的路由路径
  title: string // 标签显示的标题
}
```



### 右键菜单

组件提供丰富的右键菜单功能：

- **重新加载**：刷新当前页面
- **关闭当前标签**：关闭右键点击的标签
- **关闭左侧标签**：关闭当前标签左侧的所有标签
- **关闭右侧标签**：关闭当前标签右侧的所有标签
- **关闭其他标签**：保留当前标签，关闭其他所有标签
- **关闭全部标签**：关闭除首页外的所有标签
- **内容区全屏**：切换内容区全屏显示



## 下拉菜单

组件右侧提供下拉菜单，包含所有标签操作：

```typescript
const dropdownItems = [
  { command: 'refresh', text: '重新加载', disabled: false },
  { command: 'closeTag', text: '关闭当前标签', disabled: isHomeSet },
  { command: 'closeLeft', text: '关闭左侧标签', disabled: isHideCloseLeft },
  { command: 'closeRight', text: '关闭右侧标签', disabled: isHideCloseRight },
  { command: 'closeOthers', text: '关闭其他标签', disabled: isHideCloseOthers },
  { command: 'closeAll', text: '关闭全部标签', disabled: false },
  { command: 'fullScreen', text: '内容区全屏', disabled: false }
]
```

## 样式定制

### CSS Modules 类名

```scss
.lay-tag-wrapper {
  // 最外层容器
}

.lay-tag-container {
  // 主容器，控制滚动边界
}

.lay-tag {
  // 标签容器
}

.tags-scroll {
  // 标签滚动区域
}

.scroll-arrow-left,
.scroll-arrow-right {
  // 左右滚动箭头
}

.is-active {
  // 激活状态的标签
}

.context-menu {
  // 右键菜单
}
```

### Element Plus 标签样式

组件使用全局样式定制 Element Plus 的标签：

```scss
:global {
  .el-tag {
    position: relative;
    height: 34px;
    border-radius: 0;
    background-color: #fff;
    border-color: transparent;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--el-color-primary);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      color: var(--el-color-primary);

      .el-tag__close {
        opacity: 1;
      }
    }
  }
}
```

### 响应式设计

```scss
@media screen and (max-width: 768px) {
  .lay-tag {
    .tags-scroll {
      padding: 0 28px;
    }

    .scroll-arrow-left,
    .scroll-arrow-right {
      width: 24px;
      height: 24px;
    }

    :global {
      .el-tag {
        padding: 0 12px;
        font-size: 12px;
      }
    }
  }
}
```



## 最佳实践

### 标签管理策略

1. **限制数量**：建议限制同时打开的标签数量（如最多 20 个）
2. **智能关闭**：超出限制时自动关闭最久未访问的标签
3. **持久化**：保存用户的标签状态到本地存储

### 用户体验优化

1. **平滑动画**：使用 CSS 过渡动画提升交互体验
2. **键盘支持**：支持 Ctrl+W 关闭标签等快捷键
3. **拖拽排序**：支持标签的拖拽重新排序

### 无障碍访问

```typescript
// 添加 ARIA 属性
<div
  role="tab"
  aria-selected={activeTag.value === tag.path}
  aria-label={tag.title}
  tabindex={activeTag.value === tag.path ? 0 : -1}
>
  <el-tag>{tag.title}</el-tag>
</div>
```

## 注意事项

1. **首页保护**：首页标签通常不能被关闭
2. **路径唯一性**：确保标签路径的唯一性
3. **内存管理**：及时清理不需要的事件监听器
4. **状态同步**：保持标签状态与路由状态的同步
5. **错误处理**：处理路由跳转失败等异常情况