import { defineComponent } from 'vue'
// import styles from '../style/index.module.scss'
import { useRouter } from 'vue-router'
import { Breadcrumb } from './types'
export default defineComponent({
  name: 'LayBreadcrumb',
  inheritAttrs: false,
  setup (props, { attrs }) {
    const routes = useRouter()
    const breadcrumb = computed(() => {
      const { meta } = routes.currentRoute.value
      return (meta?.breadcrumb ?? []) as Breadcrumb[]
    })

    return () => (
      <>
        <el-breadcrumb {...attrs} >
          {breadcrumb.value.map((item, idx) => {
            const isLast = idx === breadcrumb.value.length - 1
            return (
              <el-breadcrumb-item
                key={item.path || idx}
                {...(!isLast && item.path ? { to: { path: item.path } } : {})}
              >
                {item.title}
              </el-breadcrumb-item>
            )
          })}
        </el-breadcrumb>
      </>
    )
  }
})
