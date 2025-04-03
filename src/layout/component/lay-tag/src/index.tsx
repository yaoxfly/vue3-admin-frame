import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowLeft, ArrowRight, ArrowDown } from '@element-plus/icons-vue'
import styles from '../style/index.module.scss'

export default defineComponent({
  name: 'LayTag',
  inheritAttrs: false,
  setup () {
    const activeIndex = ref<number | null>(null)
    const tags = Array.from({ length: 30 }, (_, i) => `标签 ${i + 1}`)

    const scrollContainer = ref<HTMLElement | null>(null)
    const containerWrapper = ref<HTMLElement | null>(null)
    const showLeftArrow = ref(false)
    const showRightArrow = ref(false)

    const handleTagClick = (index: number) => {
      activeIndex.value = index
      scrollToTag(index)
    }

    const scrollToTag = (index: number) => {
      if (!scrollContainer.value) return

      const container = scrollContainer.value
      const tagElement = container.children[index] as HTMLElement
      if (!tagElement) return

      const containerWidth = container.clientWidth
      const tagLeft = tagElement.offsetLeft
      const tagWidth = tagElement.offsetWidth

      container.scrollTo({
        left: tagLeft - (containerWidth - tagWidth) / 2,
        behavior: 'smooth'
      })
    }

    const scrollTo = (direction: 'left' | 'right') => {
      if (!scrollContainer.value) return

      const container = scrollContainer.value
      const scrollAmount = container.clientWidth * 0.1

      container.scrollTo({
        left: direction === 'left'
          ? Math.max(0, container.scrollLeft - scrollAmount)
          : Math.min(container.scrollWidth, container.scrollLeft + scrollAmount),
        behavior: 'smooth'
      })
    }

    const updateArrowsVisibility = () => {
      if (!scrollContainer.value || !containerWrapper.value) return

      const container = scrollContainer.value
      const hasScrollBefore = container.scrollLeft > 10
      const hasScrollAfter = container.scrollLeft + 10 < container.scrollWidth - container.clientWidth

      showLeftArrow.value = hasScrollBefore
      showRightArrow.value = hasScrollAfter

      // 更新遮罩类名
      if (hasScrollBefore) {
        containerWrapper.value.classList.add(styles['has-scroll-before'])
      } else {
        containerWrapper.value.classList.remove(styles['has-scroll-before'])
      }

      if (hasScrollAfter) {
        containerWrapper.value.classList.add(styles['has-scroll-after'])
      } else {
        containerWrapper.value.classList.remove(styles['has-scroll-after'])
      }
    }

    onMounted(() => {
      if (scrollContainer.value) {
        setTimeout(updateArrowsVisibility, 100)
        scrollContainer.value.addEventListener('scroll', updateArrowsVisibility)
        window.addEventListener('resize', updateArrowsVisibility)
      }
    })

    onBeforeUnmount(() => {
      if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', updateArrowsVisibility)
        window.removeEventListener('resize', updateArrowsVisibility)
      }
    })

    return () => (
      <div class={styles['lay-tag-wrapper']}>

        <div
          ref={containerWrapper}
          class={styles['lay-tag-container']}
        >
          <div class={styles['lay-tag']}>
            {showLeftArrow.value && (
              <div
                class={styles['scroll-arrow-left']}
                onClick={() => scrollTo('left')}
              >
                <el-icon><ArrowLeft /></el-icon>
              </div>
            )}

            <div
              class={styles['tags-scroll']}
              ref={scrollContainer}
            >
              {tags.map((tag, index) => (
                <span
                  key={index}
                  class={activeIndex.value === index ? styles['is-active'] : ''}
                  onClick={() => handleTagClick(index)}
                >
                  <el-tag closable>{tag}</el-tag>
                </span>
              ))}
            </div>

            {showRightArrow.value && (
              <div
                class={styles['scroll-arrow-right']}
                onClick={() => scrollTo('right')}
              >
                <el-icon><ArrowRight /></el-icon>
              </div>
            )}

          </div>

        </div>

        <div class={styles['lay-tag-drop-down-menu']} >
        <el-icon><ArrowDown /></el-icon>
        </div>

      </div>
    )
  }
})
