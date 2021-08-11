import createMatcher from '@captaincodeman/router'
import { routingPlugin } from '@captaincodeman/rdx'
import * as models from './models'

const routes = {
  '/': 'home',
  '/about': 'about',
  '/account': 'account',
  '/interestC': 'interestC',
  '/interestRD': 'interestRD',
  '/interestU': 'interestU',
  '/signin': 'signin',
  '/*': '404',
}

const matcher = createMatcher(routes)
const routing = routingPlugin(matcher)

export const config = { models, plugins: { routing } }
