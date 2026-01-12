import { defineComponent, h, PropType } from 'vue'
import styles from '../style/index.module.scss'
import { Expand, Fold } from '@element-plus/icons-vue'
import { MenuItem } from './types'
import { useRouter } from 'vue-router'
import { useMenuStore, useSetStore } from '@/store'

export default defineComponent({
  name: 'LayMenu',
  inheritAttrs: false,
  props: {
    data: {
      type: Array as PropType<MenuItem[]>,
      required: true
    },
    logo: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props, { attrs }) {
    const router = useRouter()
    const menuStore = useMenuStore()
    const setStore = useSetStore()

    const renderIcon = (icon: any) => {
      if (typeof icon === 'string') {
        return <img src={icon} alt="icon" class={styles['menu-icon']} />
      } else {
        return <el-icon>{h(icon)}</el-icon>
      }
    }

    const routerPush = (path: string) => {
      router.push({ path })
      // 标签添加逻辑已移至路由守卫中统一处理，这里不再重复添加
    }

    const renderMenu = (items: MenuItem[]) => {
      return items.map((item) => {
        const { icon, groupTitle, children, ...rest } = item
        if (children) {
          if (groupTitle) {
            // Render el-menu-item-group
            return (
              <el-menu-item-group>
                {{
                  title: () => <span>{groupTitle}</span>,
                  default: () => renderMenu(children)
                }}
              </el-menu-item-group>
            )
          } else {
            // Render el-sub-menu
            return (
              <el-sub-menu {...rest} index={item.index || ''}>
                {{
                  title: () => (
                    <>
                      {icon && renderIcon(icon)}
                      <span>{item.title}</span>
                    </>
                  ),
                  default: () => renderMenu(children)
                }}
              </el-sub-menu>
            )
          }
        } else {
          // Render el-menu-item
          return (
            <el-menu-item {...rest} onClick={() => routerPush(rest.index as string)}>
              {icon && renderIcon(icon)}
              <span>{item.title}</span>
            </el-menu-item>
          )
        }
      })
    }

    const collapseIconClick = () => {
      menuStore.setIsCollapse(!menuStore.getIsCollapse)
    }

    return () => (
      <div class={styles['lay-menu']}>
        <div class={[styles['menu-title'], { 'el-menu--collapse': menuStore.getIsCollapse }]} >
          {!setStore.config.hideLogo && <img src={props.logo} class={styles.logo}></img>}
          <span class={styles['system-name'] } style={{ opacity: menuStore.getIsCollapse ? 0 : 1 }} >Vue3AdminFrame</span>
        </div>
        <el-menu
          {...attrs}
          class={styles['el-menu-vertical']}
          collapse={menuStore.getIsCollapse}

        >
          {renderMenu(props.data)}
        </el-menu>
        <div class={[styles['collapse-icon'], { 'el-menu--collapse': menuStore.getIsCollapse }]} onClick={() => collapseIconClick()} >
          <el-tooltip content={menuStore.getIsCollapse ? '点击展开' : '点击折叠'} placement="right" effect="light">
            <el-icon>{menuStore.getIsCollapse ? <Expand /> : <Fold />}</el-icon>
          </el-tooltip>
        </div>
      </div>
    )
  }
})
