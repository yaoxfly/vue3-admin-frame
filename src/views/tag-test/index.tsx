import Container from '@/component/container/src/index'
import { useRouter } from 'vue-router'
import { usePageCache } from '@/hooks'

export default defineComponent({
  name: 'TagTest',
  setup () {
    const router = useRouter()
    const inputValue = ref('测试输入保持')

    // 使用页面缓存hook
    const { pushWithoutCache } = usePageCache('TagTest')

    const goToDetail = () => {
      router.push('/tag-test/detail?id=123')
    }

    const goToDetailWithoutCache = () => {
      pushWithoutCache('/tag-test/detail?id=456')
    }

    return () => <>
      <Container >
         <div>
          <h1>标签测试</h1>
          <p>测试缓存功能</p>
          <p style="color: #666; font-size: 14px;">
            输入内容后跳转到详情页，然后返回查看缓存效果
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
              onClick={goToDetail}
              style="padding: 8px 16px; background: var(--color-primary); color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              跳转到详情页
            </button>
            <button
              onClick={goToDetailWithoutCache}
              style="padding: 8px 16px; background: #e6a23c; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              强制刷新跳转
            </button>
          </div>
         </div>
        </Container>
    </>
  }
})
