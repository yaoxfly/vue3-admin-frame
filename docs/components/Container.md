# Container 页面容器组件

## 概述

Container 是一个通用的页面容器组件，为页面内容提供统一的布局、样式和滚动处理。它具有现代化的设计风格，支持自定义内边距和滚动行为。

## 特性

- 📦 **统一容器**：为所有页面提供一致的容器样式
- 📏 **自定义内边距**：支持自定义容器内边距
- 📜 **滚动控制**：支持可滚动和静态两种模式
- 🎨 **现代设计**：具有阴影、圆角等现代化视觉效果
- 📱 **响应式布局**：自适应不同屏幕尺寸
- 🔧 **易于使用**：简单的 API 设计

## 基础用法

```tsx
import Container from '@/component/container/src'

// 基础使用
<Container>
  <div>页面内容</div>
</Container>

// 自定义内边距
<Container padding="40px">
  <div>页面内容</div>
</Container>

// 静态模式（不可滚动）
<Container scrollable={false}>
  <div>页面内容</div>
</Container>
```

## Props

| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
|------|------|------|--------|----------|
| padding | 容器内边距 | `string` | `'20px'` | 否 |
| scrollable | 是否可滚动 | `boolean` | `true` | 否 |

## 模式说明

### 可滚动模式 (scrollable: true)

默认模式，内容超出容器高度时显示滚动条：

```tsx
<Container scrollable={true}>
  {/* 内容超出时会显示滚动条 */}
  <div style={{ height: '2000px' }}>
    长内容...
  </div>
</Container>
```

特点：
- 使用绝对定位占满整个容器
- 内容超出时显示自定义样式的滚动条
- 支持平滑滚动体验

### 静态模式 (scrollable: false)

静态模式，内容高度固定为容器高度：

```tsx
<Container scrollable={false}>
  {/* 内容高度受限于容器 */}
  <div>
    固定高度内容
  </div>
</Container>
```

特点：
- 使用相对定位
- 内容超出时隐藏（overflow: hidden）
- 适用于固定布局的场景



## 使用场景

### 标准页面容器

```tsx
// 典型的页面使用方式
export default defineComponent({
  name: 'UserList',
  setup() {
    return () => (
      <Container>
        <div>
          <h1>用户列表</h1>
          <el-table data={users}>
            {/* 表格内容 */}
          </el-table>
        </div>
      </Container>
    )
  }
})
```

### 表单页面

```tsx
// 表单页面使用
<Container padding="40px">
  <el-form label-width="120px">
    <el-form-item label="用户名">
      <el-input v-model={form.username} />
    </el-form-item>
    {/* 更多表单项 */}
  </el-form>
</Container>
```

### 图表展示

```tsx
// 图表页面使用
<Container scrollable={false}>
  <div class="chart-container">
    <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
  </div>
</Container>
```

### 卡片布局

```tsx
// 卡片网格布局
<Container>
  <div class="card-grid">
    <div class="card">卡片1</div>
    <div class="card">卡片2</div>
    <div class="card">卡片3</div>
  </div>
</Container>
```

## 样式定制

### 全局样式覆盖

```scss
// 修改容器基础样式
.container {
  margin: 16px !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.08) !important;
}

// 修改滚动条样式
.container-scroll {
  &::-webkit-scrollbar {
    width: 8px !important;
  }

  &::-webkit-scrollbar-thumb {
    background: #409eff !important;
  }
}
```

### 主题定制

```scss
// 暗色主题
.dark-theme {
  .container {
    background-color: #1f2937;
    box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.04);
  }

  .container-scroll {
    &::-webkit-scrollbar-track {
      background: #374151;
    }

    &::-webkit-scrollbar-thumb {
      background: #6b7280;
    }
  }
}
```

## 响应式设计

### 移动端适配

```scss
@media screen and (max-width: 768px) {
  .container {
    margin: 10px;
    border-radius: 0;
  }
}

@media screen and (max-width: 480px) {
  .container {
    margin: 0;
  }
}
```

### 平板适配

```scss
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .container {
    margin: 15px;
  }
}
```

## 最佳实践

### 内边距使用建议

```tsx
// 不同场景的内边距建议
<Container padding="40px">   {/* 表单页面 */}
<Container padding="20px">   {/* 标准页面 */}
<Container padding="0">      {/* 需要铺满的内容，如表格 */}
<Container padding="20px 40px"> {/* 自定义上下左右边距 */}
```

### 滚动模式选择

```tsx
// 推荐使用场景
<Container scrollable={true}>   {/* 列表页、内容页 */}
<Container scrollable={false}>  {/* 图表页、固定布局页 */}
```

### 嵌套使用

```tsx
// 避免不必要的嵌套
❌ 错误：
<Container>
  <Container>
    <div>内容</div>
  </Container>
</Container>

✅ 正确：
<Container>
  <div class="inner-section">
    <div>内容</div>
  </div>
</Container>
```

## 与布局系统集成

### 在主布局中的位置

```tsx
// layout/index.tsx
<div class={styles.layout}>
  <LayMenu />
  <div class={styles['layout-right']}>
    <LayHeaderBar />
    <LayTag />
    <div class={styles['router-view-container']}>
      <router-view>
        {({ Component }) => (
          <KeepAlive>
            <Component />  {/* 这里的组件通常会使用 Container */}
          </KeepAlive>
        )}
      </router-view>
    </div>
  </div>
</div>
```

### 配合路由使用

```tsx
// 在路由组件中使用
export default defineComponent({
  name: 'ProductList',
  setup() {
    return () => (
      <Container>
        {/* 页面内容 */}
      </Container>
    )
  }
})
```

## 性能考虑

### 滚动性能优化

```tsx
// 对于大量数据的页面，考虑虚拟滚动
<Container>
  <VirtualList
    items={largeDataList}
    itemHeight={50}
    containerHeight={600}
  />
</Container>
```

### 内容懒加载

```tsx
// 配合懒加载组件
<Container>
  <LazyLoad>
    <ExpensiveComponent />
  </LazyLoad>
</Container>
```

## 注意事项

1. **高度设置**：确保父容器有明确的高度，Container 才能正确计算滚动区域
2. **内容溢出**：在 scrollable={false} 模式下，注意内容可能被隐藏
3. **滚动条样式**：自定义滚动条样式在不同浏览器中可能有差异
4. **性能影响**：避免在 Container 内放置过于复杂的内容影响滚动性能
5. **嵌套滚动**：避免创建嵌套的滚动容器，可能导致滚动冲突
