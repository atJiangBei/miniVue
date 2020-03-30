import {
	initState
} from './state.js'

import Watcher from '../observer/watcher'
import {
	h,
	patch,
	render
} from './../vnode/index.js'

let uid = 0;

function query(el) {
	return typeof el === 'string' ? document.querySelector(el) : el;
}
export function initMixin(Vue) {
	Vue.prototype._init = function(options) {
		const vm = this;
		vm._uid = uid++;
		vm._self = vm;
		vm.$options = options;
		initState(vm);
	}
	Vue.prototype._update = function(vnode) {
		const vm = this
		const prevVnode = vm._vnode

		// Vue.prototype.__patch__ is injected in entry points
		// based on the rendering backend used.

		if (!prevVnode) {
			// initial render
			vm._vnode = vnode
			vm.$el = render(vnode, vm.$el, )
		} else {
			// updates
			vm.$el = patch(prevVnode, vnode)
		}
	}
	Vue.prototype.mount = function() {
		const vm = this;
		let {
			el
		} = vm.$options;
		el = vm.$el = query(el)
		const updateComponent = () => {
			vm._update(vm._render())
		}

		new Watcher(vm, updateComponent, () => {}, {
			before() {
				console.log("watcher  before 回调")
			}
		}, true /* isRenderWatcher */ )
		return vm
	}


	Vue.prototype._render = function() {
		const vm = this
		const {
			render
		} = vm.$options
		let vnode = render.call(vm, h)
		return vnode
	}
	Vue.prototype.$watch = function(
		expOrFn,
		cb,
		options
	) {
		const vm = this
		options = options || {}
		options.user = true
		const watcher = new Watcher(vm, expOrFn, cb, options)
		return function unwatchFn() {
			watcher.teardown()
		}
	}
}
