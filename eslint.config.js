// @ts-check
import createEslintConfig from 'talljack-eslint-config'

export default createEslintConfig({
  typescript: true,
  react: true,
  formatters: true,
  rules: {
    'no-console': 'off',
  },
})
