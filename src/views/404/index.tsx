import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import './index.scss'

export default defineComponent({
  name: 'NotFoundPage',
  setup () {
    const router = useRouter()
    const goHome = () => {
      router.push('/')
    }

    return () => (
      <div class="page-not-found">
        <h1 class="page-not-found__title">404</h1>
        <p class="page-not-found__message">哎呀！你访问的页面找不到了。</p>
        <button class="page-not-found__button" onClick={goHome}>
          返回首页
        </button>
      </div>
    )
  }
})
