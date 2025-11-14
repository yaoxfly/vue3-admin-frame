import { defineComponent } from 'vue'
import styles from '../style/index.module.scss'
import { FullScreen, Setting } from '@element-plus/icons-vue'
import LayBreadcrumb from '../../lay-breadcrumb/src'
export default defineComponent({
  name: 'LayHeaderBar',
  inheritAttrs: false,
  setup () {
    const fullScreen = ref(false)
    const requestFullscreen = (el: any) => {
      el = el || window.document.documentElement
      const request =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen

      if (request) {
        fullScreen.value = true
        return request.call(el)
      } else {
        console.warn('Fullscreen API is not supported')
      }
    }

    const exitFullscreen = () => {
      const doc = document as any
      const exit =
        doc.exitFullscreen ||
        doc?.webkitExitFullscreen ||
        doc?.mozCancelFullScreen ||
        doc?.msExitFullscreen

      if (exit) {
        return exit.call(doc)
      }
    }

    const goFullscreen = () => {
      return () => {
        requestFullscreen(window.document.documentElement)
      }
    }

    const goExitFullscreen = () => {
      return () => {
        fullScreen.value = false
        exitFullscreen()
      }
    }
    const drawer = ref(false)
    return () => (
      <header class={styles['lay-header-bar']}>
        <LayBreadcrumb></LayBreadcrumb>

        <div class={styles['lay-header-bar-right']}>
          <section onClick={fullScreen.value ? goExitFullscreen() : goFullscreen()}>
            <el-icon><FullScreen /></el-icon>
          </section>
          <section >
            <el-icon><Setting /></el-icon>
          </section>
        </div>

        <el-drawer
          v-model={drawer.value}
          title="I am the title"
          direction="rtl"
        >
          <span>Hi, there!</span>
        </el-drawer>

      </header>
    )
  }
})
