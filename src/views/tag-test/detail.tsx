import Container from '@/component/container/src/index'
import { useRoute, useRouter } from 'vue-router'
import { usePageCache } from '@/hooks/use-page-cache'

export default defineComponent({
  name: 'Detail',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const id = computed(() => route.params.id || route.query.id || '1')
    const inputValue = ref(`详情页输入 - ID: ${id.value}`)

    // 使用页面缓存hook
    const { pushWithoutCache } = usePageCache('Detail')

    const goBack = () => {
      router.back()
    }

    const goToTagTest = () => {
      router.push('/tag-test')
    }

    const goToTagTestWithoutCache = () => {
      pushWithoutCache('/tag-test')
    }

    return () => (
      <Container>
        <div>
          <h1>详情页面</h1>
          <p>ID: {id.value}</p>
          <p style="color: #666; font-size: 14px;">
            输入内容后跳转，再返回测试缓存效果
          </p>

          <div style="margin: 20px 0;">
            <input
              v-model={inputValue.value}
              placeholder="输入内容测试缓存"
              style="width: 300px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            />
            <p>当前输入: {inputValue.value}</p>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button
              onClick={goBack}
              style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              返回上一页
            </button>
            <button
              onClick={goToTagTest}
              style="padding: 8px 16px; background: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              跳转到标签测试
            </button>
            <button
              onClick={goToTagTestWithoutCache}
              style="padding: 8px 16px; background: #e6a23c; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              强制刷新跳转
            </button>
          </div>
        </div>
      </Container>
    )
  }
})
