import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import styles from './index.module.scss'

export default defineComponent({
  name: 'NotFoundPage',
  setup () {
    const router = useRouter()
    const goHome = () => {
      router.push('/')
    }

    return () => (
      <div class={styles.container}>
        <h1 class={styles.title}>404</h1>
        <p class={styles.message}>哎呀！你访问的页面找不到了。</p>
        <button class={styles.button} onClick={goHome}>
          返回首页
        </button>
      </div>
    )
  }
})
