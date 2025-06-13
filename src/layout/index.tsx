import LayMenu from './component/lay-menu/src'
import LayHeaderBar from './component/lay-header-bar/src'
import localIcon from '@/assets/logo.png'
import styles from './index.module.scss'
import LayTag from './component/lay-tag/src'
import { useMenuStore, useLayTag, useKeepAliveStore } from '@/store'
import { KeepAlive } from 'vue'
export default defineComponent({
  name: 'Layout',
  setup () {
    // 从 store 中获取菜单数据
    const keepAliveStore = useKeepAliveStore()
    const menuStore = useMenuStore()
    const menu = menuStore.getMenu
    const layTagStore = useLayTag()
    const fill = computed(() => layTagStore.getFill)

    return () => (
      <div class={styles.layout}>
        {!fill.value && <LayMenu data={menu} logo={localIcon}></LayMenu>}
        <div class={styles['layout-right']}>
          {!fill.value && <LayHeaderBar></LayHeaderBar>}
          <LayTag fill={fill.value}></LayTag>
          <div class={styles['router-view-container']}>
            <router-view>
              {({ Component }: { Component: any }) => (
                <KeepAlive include={keepAliveStore.getCachedComponents}>
                  <Component />
                </KeepAlive>
              )}
            </router-view>
          </div>
        </div>
      </div>
    )
  }
})
