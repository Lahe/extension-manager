import { createRouter } from '@/router'
import { getRouterManifest } from '@tanstack/react-start/router-manifest'
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'

const ssr = createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler)

export default ssr
