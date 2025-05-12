import { defineComponent, ref, h, PropType } from 'vue'
import styles from '../style/index.module.scss'
import { Expand, Fold } from '@element-plus/icons-vue'
import { MenuItem } from './types'
import { useRouter, useRoute } from 'vue-router'
import { useLayTag } from '@/store/lay-tag'

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
  setup (props, { attrs, slots }) {
    const router = useRouter()
    const route = useRoute()
    const layTagStore = useLayTag()
    const isCollapse = ref(false)

    const renderIcon = (icon: any) => {
      if (typeof icon === 'string') {
        return <img src={icon} alt="icon" class={styles['menu-icon']} />
      } else {
        return <el-icon>{h(icon)}</el-icon>
      }
    }

    const routerPush = (path: string, title: string) => {
      router.push({ path }).then(() => {
        // 路由跳转成功后，将路由信息保存到lay-tag中
        layTagStore.setTag(path, title)
      })
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
            <el-menu-item {...rest} onClick={() => routerPush(rest.index as string, item.title || '未命名')}>
              {icon && renderIcon(icon)}
              <span>{item.title}</span>
            </el-menu-item>
          )
        }
      })
    }

    return () => (
      <div class={styles['lay-menu']}>
        <div class={[styles['menu-title'], { 'el-menu--collapse': isCollapse.value }]}>
          <img src={props.logo} class={styles.logo}></img>
          <span class={styles['system-name'] } style={{ opacity: isCollapse.value ? 0 : 1 }} >Vue3AdminFrame</span>
        </div>
        <el-menu
          {...attrs}
          class={styles['el-menu-vertical']}
          collapse={isCollapse.value}
        >
          {renderMenu(props.data)}
        </el-menu>
        <div class={[styles['collapse-icon'], { 'el-menu--collapse': isCollapse.value }]} onClick={() => { isCollapse.value = !isCollapse.value }}>
          <el-tooltip content={isCollapse.value ? '点击展开' : '点击折叠'} placement="right" effect="light">
            <el-icon>{isCollapse.value ? <Expand /> : <Fold />}</el-icon>
          </el-tooltip>
        </div>
      </div>
    )
  }
})
