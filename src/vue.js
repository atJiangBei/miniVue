import { initMixin } from './instance/init.js'

function Vue(options = {}) {
	this._init(options)
}

initMixin(Vue)

export default Vue
