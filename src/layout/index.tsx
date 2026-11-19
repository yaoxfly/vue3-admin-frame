import LayMenu from './component/lay-menu/src'
import LayHeaderBar from './component/lay-header-bar/src'
import localIcon from '@/assets/logo.png'
import './index.scss'
import LayTag from './component/lay-tag/src'
import { useMenuStore, useLayTag, useKeepAliveStore, useSetStore } from '@/store'
import { KeepAlive } from 'vue'
export default defineComponent({
  name: 'Layout',
  setup () {
    // 从 store 中获取菜单数据
    const keepAliveStore = useKeepAliveStore()
    const menuStore = useMenuStore()
    const menu = menuStore.getMenu
    const layTagStore = useLayTag()
    const setStore = useSetStore()
    const fill = computed(() => layTagStore.getFill)

    return () => (
      <div class="app-layout">
        {!fill.value && <LayMenu data={menu} logo={localIcon}></LayMenu>}
        <div class="app-layout__main">
          {!fill.value && <LayHeaderBar></LayHeaderBar>}
          {!setStore.config.hideTag && <LayTag fill={fill.value}></LayTag>}
          <div class="app-layout__content">
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
