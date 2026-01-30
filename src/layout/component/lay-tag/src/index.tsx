import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'
import { ArrowLeft, ArrowRight, ArrowDown } from '@element-plus/icons-vue'
import styles from '../style/index.module.scss'
import { useLayTag, useMenuStore } from '@/store'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 标签数据结构定义
interface TagItem {
  path: string // 标签对应的路由路径
  title: string // 标签显示的标题
}

export default defineComponent({
  name: 'LayTag',
  inheritAttrs: false,
  props: {
    // 首页设置
    homeSet: {
      type: Object,
      default: () => ({
        title: '首页',
        path: '/home'
      })
    },
    fill: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const router = useRouter()
    const layTagStore = useLayTag()
    const menuStore = useMenuStore() // getIsCollapse 不可解构,不会响应式

    // ===== 基础数据 =====
    // 从store获取标签列表和当前活动标签
    const tags = computed(() => layTagStore.getTags)
    // 只添加首页标签，但不设置为活动标签
    layTagStore.addTagToStart(props.homeSet.path, props.homeSet.title)

    /** 滚动测试 -start */
    // for (let i = 30; i > 0; i--) {
    //   layTagStore.addTagToStart(props.homeSet.path + i, props.homeSet.title + i)
    // }
    /** 滚动测试 -end */

    const activeTag = computed(() => layTagStore.getActiveTag)

    // ===== DOM引用 =====
    const scrollContainer = ref<HTMLElement | null>(null) // 标签滚动容器
    const containerWrapper = ref<HTMLElement | null>(null) // 标签外层容器

    // ===== 状态控制 =====
    // 控制左右滚动箭头显示
    const showLeftArrow = ref(false)
    const showRightArrow = ref(false)

    // ===== 右键菜单相关 =====
    const rightClickedTag = ref<TagItem | null>(null) // 当前右键点击的标签
    const contextMenuVisible = ref(false) // 右键菜单是否可见
    const contextMenuX = ref(0) // 右键菜单X坐标
    const contextMenuY = ref(0) // 右键菜单Y坐标

    // ===== 基础标签操作 =====

    /**
     * 点击标签时的处理
     * @param path 标签路径
     */
    const handleTagClick = (path: string) => {
      // 激活标签并跳转到对应路由
      layTagStore.setActiveTag(path)
      router.push(path)

      // 将标签滚动到可见区域
      const index = tags.value.findIndex((tag: TagItem) => tag.path === path)
      if (index !== -1) {
        scrollToTag(index)
      }
    }

    /**
     * 关闭单个标签
     * @param e 事件对象
     * @param path 要关闭的标签路径
     */
    const handleTagClose = (e: MouseEvent, path: string) => {
      e.stopPropagation() // 阻止事件冒泡，避免触发标签点击

      // 找到要关闭的标签索引
      const closeIndex = tags.value.findIndex((tag: TagItem) => tag.path === path)
      if (closeIndex === -1) return // 找不到标签则不处理

      // 判断是否关闭的是当前激活的标签
      const isActiveTag = path === activeTag.value

      // 确定关闭后要跳转的标签
      let targetIndex = -1
      if (isActiveTag) {
        if (closeIndex === tags.value.length - 1) {
          // 如果关闭的是最后一个标签，则跳转到前一个
          targetIndex = Math.max(0, closeIndex - 1)
        } else {
          // 否则跳转到下一个标签
          targetIndex = closeIndex + 1
        }
      }

      // 获取目标路径
      const targetPath = targetIndex !== -1 ? tags.value[targetIndex]?.path : undefined

      // 从store中移除标签
      layTagStore.removeTag(path)

      // 如果关闭的是当前标签且还有其他标签，则跳转到目标标签
      if (isActiveTag && targetPath && tags.value.length > 0) {
        handleTagClick(targetPath)
      }
    }

    // ===== 批量操作标签 =====

    /**
     * 关闭除当前标签外的所有标签
     * @param currentPath 当前标签路径
     */
    const closeOtherTags = (currentPath: string) => {
      if (tags.value.length <= 1) return // 只有一个标签时不处理

      // 查找当前标签信息
      const currentTag = tags.value.find((tag: TagItem) => tag.path === currentPath)
      if (currentTag) {
        // 清空所有标签后，重新添加当前标签
        layTagStore.clearAllTags()
        layTagStore.setTag(props.homeSet.path, props.homeSet.title)
        layTagStore.setTag(currentTag.path, currentTag.title)
        layTagStore.setActiveTag(currentPath)
      }

      ElMessage.success('已关闭其他标签')
    }

    /**
     * 关闭所有标签
     */
    const closeAllTags = () => {
      layTagStore.clearAllTags()
      layTagStore.setTag(props.homeSet.path, props.homeSet.title)
      // 跳转到首页
      router.push('/')
      ElMessage.success('已关闭所有标签')
    }

    /**
     * 关闭当前标签左侧的所有标签
     * @param currentPath 当前标签路径
     */
    const closeLeftTags = (currentPath: string) => {
      // eslint-disable-next-line no-debugger
      // debugger
      // 查找当前标签的索引
      const currentIndex = tags.value.findIndex((tag: TagItem) => tag.path === currentPath)

      if (currentIndex > 0) {
        // 保留当前标签及右侧标签
        const keepTags = tags.value.slice(currentIndex)

        // 重建标签列表
        layTagStore.clearAllTags()
        layTagStore.setTag(props.homeSet.path, props.homeSet.title)
        keepTags.forEach((tag: TagItem) => {
          layTagStore.setTag(tag.path, tag.title)
        })

        // 设置当前标签为活动标签
        layTagStore.setActiveTag(currentPath)

        ElMessage.success('已关闭左侧标签')
      }
    }

    /**
     * 关闭当前标签右侧的所有标签
     * @param currentPath 当前标签路径
     */
    const closeRightTags = (currentPath: string) => {
      // eslint-disable-next-line no-debugger
      // debugger
      // 查找当前标签的索引
      const currentIndex = tags.value.findIndex((tag: TagItem) => tag.path === currentPath)

      if (currentIndex !== -1 && currentIndex < tags.value.length - 1) {
        // 保留左侧标签及当前标签
        const keepTags = tags.value.slice(0, currentIndex + 1)

        // 重建标签列表
        layTagStore.clearAllTags()
        layTagStore.setTag(props.homeSet.path, props.homeSet.title)
        keepTags.forEach((tag: TagItem) => {
          layTagStore.setTag(tag.path, tag.title)
        })

        // 设置当前标签为活动标签
        layTagStore.setActiveTag(currentPath)

        ElMessage.success('已关闭右侧标签')
      }
    }

    // ===== 右键菜单相关 =====

    /**
     * 处理标签右键点击，显示上下文菜单
     * @param e 鼠标事件
     * @param tag 点击的标签对象
     */
    const handleContextMenu = (e: MouseEvent, tag: TagItem) => {
      e.preventDefault() // 阻止默认右键菜单
      // eslint-disable-next-line no-debugger
      // 记录右键点击的标签和位置
      rightClickedTag.value = tag
      contextMenuX.value = e.clientX
      contextMenuY.value = e.clientY

      // 显示自定义右键菜单
      contextMenuVisible.value = true
    }

    const refreshPage = () => {
      // eslint-disable-next-line no-debugger
      // 拿到当前 fullPath，例如 '/ganttastic/index?x=1#foo'
      const { fullPath } = router.currentRoute.value
      // 用 replace 也行，用 push 会在历史里留一条 /redirect 记录
      router
        .replace({ path: `/redirect${fullPath}` })
        .catch(() => {})
    }

    const fullScreen = () => {
      layTagStore.setFill(!layTagStore.getFill)
    }

    /**
     * 处理底部下拉菜单命令
     * @param command 菜单命令
     */

    const handleDropdownCommand = (command: string) => {
      console.log(command, 'command')
      // 对当前活动标签执行操作
      const currentPath = activeTag.value
      if (!currentPath) return

      // 根据命令执行相应操作
      switch (command) {
        case 'closeTag':
          handleTagClose(new MouseEvent('click'), currentPath)
          break
        case 'closeOthers':
          closeOtherTags(currentPath)
          break
        case 'closeAll':
          closeAllTags()
          break
        case 'closeLeft':
          closeLeftTags(currentPath)
          break
        case 'closeRight':
          closeRightTags(currentPath)
          break
        case 'refresh':
          // router.go(0) // 刷新当前页面
          refreshPage()
          break
        case 'fullScreen':
          fullScreen()
          break
      }
    }

    /**
     * 处理右键菜单项点击
     * @param command 菜单命令
     */
    const handleContextMenuClick = (command: string) => {
      if (!rightClickedTag.value) return

      const path = rightClickedTag.value.path

      // 根据命令执行相应操作
      switch (command) {
        case 'closeTag':
          handleTagClose(new MouseEvent('click'), path)
          break
        case 'closeOthers':
          closeOtherTags(path)
          break
        case 'closeLeft':
          closeLeftTags(path)
          break
        case 'closeRight':
          closeRightTags(path)
          break
        case 'closeAll':
          closeAllTags()
          break
        case 'refresh':
          // router.go(0) // 刷新当前页面
          refreshPage()
          break
        case 'fullScreen':
          fullScreen()
          break
      }

      hideContextMenu()
    }

    /**
     * 隐藏右键菜单
     */
    const hideContextMenu = () => {
      contextMenuVisible.value = false
    }

    // ===== 滚动相关 =====

    /**
     * 滚动到指定标签
     * @param index 标签索引
     */
    const scrollToTag = (index: number) => {
      // eslint-disable-next-line no-debugger
      if (!scrollContainer.value) return

      const container = scrollContainer.value
      const tagElement = container.children[index] as HTMLElement
      if (!tagElement) return

      // 计算滚动位置，使标签居中显示
      const containerWidth = container.clientWidth
      const tagLeft = tagElement.offsetLeft
      const tagWidth = tagElement.offsetWidth

      container.scrollTo({
        left: tagLeft - (containerWidth - tagWidth) / 2,
        behavior: 'smooth'
      })
    }

    /**
     * 向左或向右滚动标签容器
     * @param direction 滚动方向
     */
    const scrollTo = (direction: 'left' | 'right') => {
      if (!scrollContainer.value) return

      const container = scrollContainer.value
      const scrollAmount = container.clientWidth * 0.1 // 滚动量为容器宽度的10%

      // 执行滚动
      container.scrollTo({
        left: direction === 'left'
          ? Math.max(0, container.scrollLeft - scrollAmount) // 向左滚动，不小于0
          : Math.min(container.scrollWidth, container.scrollLeft + scrollAmount), // 向右滚动，不超过最大宽度
        behavior: 'smooth'
      })
    }

    /**
     * 更新左右箭头显示状态
     */
    const updateArrowsVisibility = () => {
      // eslint-disable-next-line no-debugger
      // debugger
      if (!scrollContainer.value || !containerWrapper.value) return

      const container = scrollContainer.value

      // 判断是否可以向左滚动
      const hasScrollBefore = container.scrollLeft > 10
      // 判断是否可以向右滚动
      const hasScrollAfter = container.scrollLeft + 10 < container.scrollWidth - container.clientWidth

      // 更新箭头显示状态
      showLeftArrow.value = hasScrollBefore
      showRightArrow.value = hasScrollAfter

      // 更新容器样式，显示滚动阴影
      if (hasScrollBefore) {
        containerWrapper.value.classList.add(styles['has-scroll-before'])
      } else {
        containerWrapper.value.classList.remove(styles['has-scroll-before'])
      }

      if (hasScrollAfter) {
        containerWrapper.value.classList.add(styles['has-scroll-after'])
      } else {
        containerWrapper.value.classList.remove(styles['has-scroll-after'])
      }
    }

    // ===== 生命周期钩子 =====

    const isHomeSet = computed(() => {
      return rightClickedTag.value?.path === props.homeSet.path
    })

    const isHideCloseLeft = computed(() => {
      const path = rightClickedTag.value?.path
      return path === (tags.value.length > 1 ? tags.value[1].path : '')
    })

    const isHideCloseOthers = computed(() => {
      // 如果总标签数小于等于1，隐藏
      if (tags.value.length <= 1) return true

      // 如果当前右键的是首页，隐藏（首页本身不能关闭，关闭其他没意义）
      if (rightClickedTag.value?.path === props.homeSet.path) return true

      // 如果除了首页外只有当前标签，也隐藏（因为首页不能关闭，没有其他可关闭的标签）
      const otherCloseableTags = (tags.value as TagItem[]).filter(tag =>
        tag.path !== props.homeSet.path && tag.path !== rightClickedTag.value?.path
      )
      return otherCloseableTags.length === 0
    })

    const isHideCloseRight = computed(() => {
      const path = rightClickedTag.value?.path
      return path === (tags.value.length > 1 ? tags.value[tags.value.length - 1].path : '')
    })

    // 监听标签数量变化，自动更新滚动箭头状态
    watch(() => tags.value.length, () => {
      nextTick(updateArrowsVisibility)
    })

    onMounted(() => {
      // 初始化滚动事件监听
      if (scrollContainer.value) {
        // 延迟执行初始箭头状态更新，确保DOM已渲染
        nextTick(updateArrowsVisibility)

        // 添加滚动和窗口大小变化事件监听
        scrollContainer.value.addEventListener('scroll', updateArrowsVisibility)
        window.addEventListener('resize', updateArrowsVisibility)
      }

      // 确保当前路由是活动的（标签添加逻辑已移至路由守卫中统一处理）
      const currentPath = router.currentRoute.value.path
      layTagStore.setActiveTag(currentPath)

      // 添加全局点击事件用于隐藏右键菜单
      document.addEventListener('click', hideContextMenu)
    })

    onBeforeUnmount(() => {
      // 移除事件监听器
      if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', updateArrowsVisibility)
        window.removeEventListener('resize', updateArrowsVisibility)
      }

      document.removeEventListener('click', hideContextMenu)
    })

    // 下拉菜单选项
    const dropdownItems = ref<{ command: string, text: string, disabled: boolean }[]>([])
    const handleOpen = () => {
      const isHideCloseLeft = activeTag.value === (tags.value.length > 1 ? tags.value[1].path : '')
      const isHideCloseRight = activeTag.value === (tags.value.length > 1 ? tags.value[tags.value.length - 1].path : '')
      const isHomeSet = activeTag.value === props.homeSet.path

      // 计算关闭其他标签的禁用状态（与右键菜单逻辑一致）
      const isHideCloseOthersForDropdown = (() => {
        // 如果总标签数小于等于1，禁用
        if (tags.value.length <= 1) return true

        // 如果当前活动标签是首页，禁用（首页本身不能关闭，关闭其他没意义）
        if (activeTag.value === props.homeSet.path) return true

        // 如果除了首页外只有当前标签，也禁用（因为首页不能关闭，没有其他可关闭的标签）
        const otherCloseableTags = (tags.value as TagItem[]).filter(tag =>
          tag.path !== props.homeSet.path && tag.path !== activeTag.value
        )
        return otherCloseableTags.length === 0
      })()

      dropdownItems.value = [
        { command: 'refresh', text: '重新加载', disabled: false },
        { command: 'closeTag', text: '关闭当前标签', disabled: isHomeSet },
        { command: 'closeLeft', text: '关闭左侧标签', disabled: isHideCloseLeft || isHomeSet },
        { command: 'closeRight', text: '关闭右侧标签', disabled: isHideCloseRight },
        { command: 'closeOthers', text: '关闭其他标签', disabled: isHideCloseOthersForDropdown },
        { command: 'closeAll', text: '关闭全部标签', disabled: false },
        { command: 'fullScreen', text: '内容区全屏', disabled: false }
      ]
      console.log(dropdownItems.value, 'dropdownItems')
    }

    // 渲染组件
    return () => (
      <div class={styles['lay-tag']}>
      <div class={styles['lay-tag-wrapper']} onClick={hideContextMenu} style={
          props.fill
            ? { maxWidth: '100vw' } // props.fill为true时应用100vh
            : menuStore.getIsCollapse
              ? { maxWidth: 'calc(100vw - 64px)' } // 折叠状态时应用calc计算值
              : { } // 都不满足时不设置样式
        }>
        {/* 标签容器 */ }
        <div
          ref={containerWrapper}
          class={styles['lay-tag-container']}
        >
          <div class={styles['lay-tag']}>
            {/* 左侧滚动箭头 */}
            {showLeftArrow.value && (
              <div
                class={styles['scroll-arrow-left']}
                onClick={() => scrollTo('left')}
              >
                <el-icon><ArrowLeft /></el-icon>
              </div>
            )}

            {/* 标签滚动区域 */}
            <div
              class={styles['tags-scroll']}
              ref={scrollContainer}
            >
              {tags.value.map((tag: TagItem, index: number) => (
                <span
                  key={index}
                  class={activeTag.value === tag.path ? styles['is-active'] : ''}
                  onClick={() => handleTagClick(tag.path)}
                  onContextmenu={(e) => handleContextMenu(e, tag)}
                >
                  <el-tag closable={tag.path !== props.homeSet.path} onClose={(e: MouseEvent) => handleTagClose(e, tag.path)}>
                    {tag.title}
                  </el-tag>
                </span>
              ))}
            </div>

            {/* 右侧滚动箭头 */}
            {showRightArrow.value && (
              <div
                class={styles['scroll-arrow-right']}
                onClick={() => scrollTo('right')}
              >
                <el-icon><ArrowRight /></el-icon>
              </div>
            )}
          </div>
        </div>

        {/* 顶部下拉菜单 */}
        <div class={styles['lay-tag-drop-down-menu']}>
          <el-dropdown trigger="click" onVisibleChange={handleOpen}>
            {{
              dropdown: () => (
                <el-dropdown-menu>
                  {dropdownItems.value.map((item, index) => (
                    <el-dropdown-item key={index} onClick={() => handleDropdownCommand(item.command)} disabled={item.disabled}>
                      {item.text}
                    </el-dropdown-item>
                  ))}
                </el-dropdown-menu>
              ),
              default: () => <el-icon><ArrowDown /></el-icon>
            }}
          </el-dropdown>
        </div>

        {/* 右键菜单 */}
        {contextMenuVisible.value && rightClickedTag.value && (
          <div
            class={styles['context-menu']}
            style={{
              left: `${contextMenuX.value}px`,
              top: `${contextMenuY.value}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ul>
              <li onClick={() => handleContextMenuClick('refresh')} v-show={rightClickedTag.value.path === activeTag.value || rightClickedTag.value.path === props.homeSet.path}>重新加载</li>
              <div v-show={!isHomeSet.value}>
                <li onClick={() => handleContextMenuClick('closeTag')}>关闭当前标签</li>
                <li onClick={() => handleContextMenuClick('closeLeft')} v-show={!isHideCloseLeft.value}>关闭左侧标签</li>
                <li onClick={() => handleContextMenuClick('closeRight')} v-show={!isHideCloseRight.value}>关闭右侧标签</li>
                <li onClick={() => handleContextMenuClick('closeOthers')} v-show={!isHideCloseOthers.value}>关闭其他标签</li>
                <li onClick={() => handleContextMenuClick('closeAll')}>关闭全部标签</li>
              </div>
              <li onClick={() => handleContextMenuClick('fullScreen')}>{layTagStore.getFill ? '内容区退出全屏' : '内容区全屏'} </li>
            </ul>
          </div>
        )}
      </div>
      </div>
    )
  }
})
