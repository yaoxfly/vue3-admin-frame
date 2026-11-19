import { defineComponent } from 'vue'
import '../style/index.scss'

export default defineComponent({
  name: 'Container',
  props: {
    padding: {
      type: String,
      default: '20px'
    },
    scrollable: {
      type: Boolean,
      default: true
    }
  },
  setup (props, { slots }) {
    return () => (
      <div class="app-container">
        {props.scrollable
          ? (
          <div
            class="app-container__scroll"
            style={{ padding: props.padding }}
          >
            {slots.default?.()}
          </div>
            )
          : (
          <div
            class="app-container__static"
            style={{ padding: props.padding }}
          >
            {slots.default?.()}
          </div>
            )}
      </div>
    )
  }
})
