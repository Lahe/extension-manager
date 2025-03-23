import path from 'path'

export default {
  '*.js': [
    'eslint --fix',
    `prettier --write --ignore-unknown --ignore-path ${path.relative(process.cwd(), '.prettieringore')}`,
  ],
}
