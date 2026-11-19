import { defineComponent, ref } from 'vue'
import '../style/index.scss'
import { FullScreen, Setting, Check } from '@element-plus/icons-vue'
import LayBreadcrumb from '../../lay-breadcrumb/src'
import { useSetStore } from '@/store/set'
import { useTheme } from '@/hooks'
export default defineComponent({
  name: 'LayHeaderBar',
  inheritAttrs: false,
  // 在setup函数中添加主题色管理
  setup () {
    const setStore = useSetStore()
    const { themeColors, setThemeColor } = useTheme()
    // 全屏状态管理
    const fullScreen = ref(false)
    /**
     * 请求进入全屏模式
     * @param el - 要全屏显示的元素，默认为文档根元素
     */
    const requestFullscreen = (el: any) => {
      // 设置默认元素为文档根元素
      el = el || window.document.documentElement

      // 兼容不同浏览器的全屏API
      const request =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen

      if (request) {
        // 更新全屏状态
        fullScreen.value = true
        // 调用全屏API
        return request.call(el)
      } else {
        console.warn('Fullscreen API is not supported')
      }
    }

    /**
     * 退出全屏模式
     */
    const exitFullscreen = () => {
      const doc = document as any
      // 兼容不同浏览器的退出全屏API
      const exit =
        doc.exitFullscreen ||
        doc?.webkitExitFullscreen ||
        doc?.mozCancelFullScreen ||
        doc?.msExitFullscreen

      if (exit) {
        return exit.call(doc)
      }
    }

    /**
     * 进入全屏的点击事件处理函数
     */
    const goFullscreen = () => {
      return () => {
        requestFullscreen(window.document.documentElement)
      }
    }

    /**
     * 退出全屏的点击事件处理函数
     */
    const goExitFullscreen = () => {
      return () => {
        // 更新全屏状态
        fullScreen.value = false
        // 退出全屏
        exitFullscreen()
      }
    }

    // 配置抽屉的显示状态
    const drawer = ref({
      visible: false
    })

    // 配置项列表
    const configItems = [
      {
        label: '隐藏标签页', // 配置项显示名称
        key: 'hideTag' // 配置项对应的键名
      },
      {
        label: '隐藏Logo', // 配置项显示名称
        key: 'hideLogo' // 配置项对应的键名
      },
      {
        label: '灰色模式', // 配置项显示名称
        key: 'grayMode' // 配置项对应的键名
      }
    ]

    /**
     * 打开/关闭配置抽屉
     */
    const openDrawer = () => {
      console.log(drawer.value.visible, 'fffffffffffff')
      const currentState = drawer.value.visible
      drawer.value.visible = !currentState
    }

    // 在return的JSX中替换主题色区域
    return () => (
      <header class="lay-header-bar">
        {/* 面包屑导航 */}
        <LayBreadcrumb></LayBreadcrumb>

        {/* 右侧操作区域 */}
        <div class="lay-header-bar__actions">
          {/* 全屏切换按钮 */}
          <section class="lay-header-bar__action" onClick={fullScreen.value ? goExitFullscreen() : goFullscreen()}>
            <el-icon><FullScreen /></el-icon>
          </section>

          {/* 设置按钮 */}
          <section class="lay-header-bar__action" onClick={() => openDrawer()}>
            <el-icon ><Setting /></el-icon>
          </section>
        </div>

        {/* 系统配置抽屉 */}
        <el-drawer
          v-model={drawer.value.visible}
          title="系统配置"
          direction="rtl"
          append-to-body={false} // 关键：不传送到 body
          destroy-on-close={true} // 强制关闭时销毁，防止旧缓存影响
        >
          <p class="lay-header-bar__drawer-title">主题色</p>

          <div class="lay-header-bar__theme-colors">
            {themeColors.map((theme, index) => (
              <div
                key={index}
                class="lay-header-bar__theme-color-item"
                onClick={() => setThemeColor(theme.color)}
              >
                <div
                  class="lay-header-bar__theme-color"
                  style={{
                    backgroundColor: theme.color,
                    borderColor: theme.color === '#ffffff' ? 'var(--border-color-base)' : theme.color
                  }}
                >
                  {setStore.config.themeColor === theme.color && (
                    <el-icon color={theme.color === '#ffffff' ? '#000000' : 'white'} style={{ 'font-size': '16px' }}><Check /></el-icon>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 配置项标题 */}

          <p class="lay-header-bar__drawer-title">界面显示</p>

          {/* 遍历配置项 */}
          {configItems.map((item) => (
            <section class="lay-header-bar__drawer-item" key={item.key}>
              {/* 配置项标签 */}
              <p >{item.label}</p>

              {/* 配置项开关 */}
              <el-switch
                v-model={setStore.config[item.key]} // 绑定到store中的配置项
                size="large"
                inline-prompt
                active-text="开"
                inactive-text="关"
              />
            </section>
          ))}

        </el-drawer>
      </header>
    )
  }
})
