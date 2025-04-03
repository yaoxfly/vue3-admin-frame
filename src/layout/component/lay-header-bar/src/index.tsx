import { defineComponent } from 'vue'
import styles from '../style/index.module.scss'
import { FullScreen } from '@element-plus/icons-vue'
import LayBreadcrumb from '../../lay-breadcrumb/src'
export default defineComponent({
  name: 'LayHeaderBar',
  inheritAttrs: false,
  setup () {
    const fullScreen = ref(false)
    const goFullscreen = () => {
      return () => {
        const elem = window.document.getElementById('app')
        if (!elem) return
        if (elem?.requestFullscreen) {
          elem.requestFullscreen()
          fullScreen.value = true
        }
      }
    }

    const exitFullscreen = () => {
      return () => {
        fullScreen.value = false
        window.document.exitFullscreen()
      }
    }

    return () => (
      <header class={styles['lay-header-bar']}>
        <LayBreadcrumb></LayBreadcrumb>
        <div onClick={fullScreen.value ? exitFullscreen() : goFullscreen()}>
          <el-icon><FullScreen /></el-icon>
        </div>
      </header>
    )
  }
})
