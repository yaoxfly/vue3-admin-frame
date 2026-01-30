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
    // 响应式变量，用于控制是否添加 lay-menu-white 类
    const isWhiteTheme = ref(false)
    /**
     * 监听主题色变化
     * 当主题色为 #ffffff 时，添加 lay-menu-white 类
     * 当主题色为其他颜色时，移除 lay-menu-white 类
     */
    watch(
      () => setStore.config.themeColor,
      (newThemeColor) => {
        // 检查当前主题色是否为白色
        isWhiteTheme.value = newThemeColor === '#ffffff'
        console.log('主题色变化:', newThemeColor, '是否为白色主题:', isWhiteTheme.value)

        if (!isWhiteTheme.value) {
          document.body.setAttribute('data-menu-theme', 'no-white')
        } else {
          document.body.removeAttribute('data-menu-theme')
        }
      },
      { immediate: true } // 立即执行一次以初始化状态
    )

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
      <div class={[
        styles['lay-menu'],
        !isWhiteTheme.value ? styles['lay-menu-no-white'] : ''
      ]}>
        <div class={[styles['menu-title'], { 'el-menu--collapse': menuStore.getIsCollapse }]} >
          {!setStore.config.hideLogo && <img src={props.logo} class={styles.logo}></img>}
          <span class={styles['system-name']} style={{ opacity: menuStore.getIsCollapse ? 0 : 1 }} >Vue3AdminFrame</span>
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
