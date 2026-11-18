import { ref } from 'vue'
import { useSetStore } from '@/store/set'

export const useTheme = () => {
  const setStore = useSetStore()
  const primary = ref(setStore.config.themeColor || '#409EFF')

  const supportColorMix = window.CSS && CSS.supports ? CSS.supports('color', 'color-mix(in oklch, red, white)') : false

  const getRGB = (hex: string) => {
    hex = hex.replace('#', '')
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
    const i = parseInt(hex, 16)
    return { r: (i >> 16) & 0xff, g: (i >> 8) & 0xff, b: i & 0xff }
  }

  /**
   * 极暗压制引擎 (Deep Dark Engine)
   * @param power 降至 0.25：极速坍缩，让颜色瞬间进入深色域
   * @param darkenForce 降至 0.6：直接砍掉物理亮度，消除任何“亮”的可能性
   */
  const mixRGB = (color1: string, color2: string, weight: number, power: number, darkenForce = 1.0): string => {
    const c1 = getRGB(color1)
    const c2 = getRGB(color2)

    // 1. 极速坍缩权重：0.25 的幂运算会让黑色介入感呈爆发式增长
    const adjustedWeight = Math.pow(weight, power)

    // 2. 平方根混合
    let r = Math.sqrt((1 - adjustedWeight) * Math.pow(c1.r, 2) + adjustedWeight * Math.pow(c2.r, 2))
    let g = Math.sqrt((1 - adjustedWeight) * Math.pow(c1.g, 2) + adjustedWeight * Math.pow(c2.g, 2))
    let b = Math.sqrt((1 - adjustedWeight) * Math.pow(c1.b, 2) + adjustedWeight * Math.pow(c2.b, 2))

    // 3. 针对 Dark 系列的终极压制
    if (color2 === '#000000') {
      // 这里的 0.6 是核心：哪怕算出来不黑，我也强行把它压到只有 60% 的亮度
      r *= darkenForce
      g *= (darkenForce * 0.8) // 进一步压低绿蓝，保留深褐色的“血色”
      b *= (darkenForce * 0.7)
    }

    const f = (val: number) => Math.round(Math.min(Math.max(val, 0), 255))
    return `rgb(${f(r)}, ${f(g)}, ${f(b)})`
  }

  const generateThemeVars = (color: string) => {
    const root = document.documentElement
    const isWhite = color.toLowerCase() === '#ffffff'
    const targetColor = isWhite ? '#409EFF' : color
    const rgb = getRGB(targetColor)

    root.style.setProperty('--color-primary-base', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
    root.style.setProperty('--color-primary', targetColor)

    if (supportColorMix) return

    // 1. Light 系列：调高 Power 至 3.0。
    // 这会让 light-1 到 light-6 几乎和原色一模一样，彻底解决“按钮太亮”的问题
    for (let i = 1; i <= 9; i++) {
      root.style.setProperty(
        `--color-primary-light-${i}`,
        mixRGB(targetColor, '#ffffff', i * 0.1, 3.0)
      )
    }

    // 2. Dark 系列：Power 0.25 (极黑) + darkenForce 0.6 (强制压暗)
    // 现在的 dark-2 就已经是深褐色，dark-5 以后几乎接近纯黑（但带有微弱的主色倾向）
    const darkSteps: Record<string, number> = {
      1: 0.1,
      2: 0.2,
      3: 0.3,
      4: 0.4,
      5: 0.5,
      6: 0.6,
      7: 0.7,
      75: 0.75,
      8: 0.8,
      85: 0.85,
      9: 0.9
    }
    Object.entries(darkSteps).forEach(([key, w]) => {
      // 0.6 是目前的极限压制值
      root.style.setProperty(`--color-primary-dark-${key}`, mixRGB(targetColor, '#000000', w, 0.2, 0.38))
    })

    // 3. 菜单激活背景：黑到底
    const d8 = getRGB(mixRGB(targetColor, '#000000', 0.95, 0.15, 0.35))
    root.style.setProperty(
      '--color-menu-glass-bg',
      `rgba(${d8.r}, ${d8.g}, ${d8.b}, 1.0)` // 取消透明，直接给最扎实的深黑块
    )
  }

  const setThemeColor = (color: string) => {
    primary.value = color
    setStore.config.themeColor = color
    generateThemeVars(color)
  }

  generateThemeVars(primary.value)

  return {
    primary,
    setThemeColor,
    themeColors: [
      { color: '#ffffff', name: '菜单无背景色,默认蓝' },
      { color: '#409EFF', name: '默认蓝' },
      { color: '#FF6A19', name: '活力橙' },
      { color: '#5EC928', name: '清新绿' },
      { color: '#8E3FFC', name: '优雅紫' },
      { color: '#FF7F50', name: '珊瑚色' },
      { color: '#00CED1', name: '深青色' }
    ]
  }
}
