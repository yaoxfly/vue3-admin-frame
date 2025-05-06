import { defineComponent } from 'vue'
import LayMenu from './component/lay-menu/src'
import LayHeaderBar from './component/lay-header-bar/src'
import localIcon from '@/assets/logo.png'
import styles from './index.module.scss'
import LayTag from './component/lay-tag/src'
import { useMenuStore } from '@/store'

export default defineComponent({
  name: 'Layout',
  setup () {
    // 从 store 中获取菜单数据
    const menuStore = useMenuStore()
    const menu = menuStore.getMenu

    return () => (
      <div class={styles.layout}>
        <LayMenu data={menu} logo={localIcon}></LayMenu>
        <div class={styles['layout-right']}>
          <LayHeaderBar></LayHeaderBar>
          <LayTag></LayTag>
          <router-view />
        </div>
      </div>
    )
  }
})
