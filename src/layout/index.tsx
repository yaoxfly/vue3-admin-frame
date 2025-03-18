import { defineComponent } from 'vue'
import LayMenu from './component/lay-menu/src'
import LayHeaderBar from './component/lay-header-bar/src'
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import localIcon from '@/assets/logo.png'
import { MenuItem } from './component/lay-menu/src/types'
import styles from './index.module.scss'
export default defineComponent({
  name: 'Layout',
  setup () {
    const menu: MenuItem[] = [
      {
        index: '1',
        title: 'Navigator One',
        icon: Location,
        children: [
          {
            groupTitle: 'Group One',
            children: [
              { index: '/demo', title: 'Item One' },
              { index: '1-2', title: 'Item Two' }
            ]
          },
          {
            groupTitle: 'Group Two',
            children: [
              { index: '1-3', title: 'Item Three' },
              {
                index: '1-4',
                title: 'Item Four',
                children: [{ index: '1-4-1', title: 'Item One' }]
              }

            ]
          }
        ]
      },
      { index: '2', title: 'Navigator Two', icon: IconMenu },
      { index: '3', title: 'Navigator Three', icon: Document, disabled: true },
      { index: '4', title: 'Navigator Four', icon: Setting },
      { index: '6', title: 'Navigator Six', icon: localIcon },
      { index: '7', title: 'Navigator Six', icon: 'https://q9.itc.cn/q_70/images01/20240601/ffd2775225684a5398dccca2801dec4b.jpeg' }
    ]

    return () => (
      <div class={styles.layout}>

         <LayMenu data={menu} logo={localIcon}></LayMenu>

        <div class={styles['layout-right']}>
        <LayHeaderBar></LayHeaderBar>
        <router-view />
        </div>
      </div>
    )
  }
})
