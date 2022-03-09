import curry from 'lodash/curry'
import get from 'lodash/get'
import merge from 'lodash/merge'

const NetworkID = process.env.REACT_APP_NETWORK_ID ?? '1'

const defaults = require('./configs.json')
const overrides = require(`./${NetworkID}/configs.json`)

const merged = merge(defaults, overrides)
export default merged

export const config = curry(get, 2)(get) as <T>(path: string, defaultValue?: T) => T
