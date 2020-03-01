import Watcher from '../observer/watcher'
import Dep, {
	pushTarget,
	popTarget
} from '../observer/dep'
import {
	observe,
	toggleObserving
} from '../observer/index'



export function initState(vm) {
	vm._watchers = [];
	const ops = vm.$options;
	if (opts.props) initProps(vm, opts.props)
	if (opts.methods) initMethods(vm, opts.methods)
	if (opts.data) {
		initData(vm)
	} else {
		observe(vm._data = {}, true /* asRootData */ )
	}
	if (opts.computed) initComputed(vm, opts.computed)
	if (opts.watch) {
		initWatch(vm, opts.watch)
	}
}


export function proxy(target, sourceKey, key) {
	sharedPropertyDefinition.get = function proxyGetter() {
		return this[sourceKey][key]
	}
	sharedPropertyDefinition.set = function proxySetter(val) {
		this[sourceKey][key] = val
	}
	Object.defineProperty(target, key, sharedPropertyDefinition)
}



function initProps(vm, propsOptions) {

}

function initData(vm) {
	let data = vm.$options.data
	data = vm._data = typeof data === 'function' ?
		getData(data, vm) :
		data || {}
	const keys = Object.keys(data)
	let i = keys.length
	while (i--) {
		const key = keys[i]
		proxy(vm, `_data`, key)
	}
	observe(data, true)
}


export function getData(data, vm) {
	pushTarget()
	try {
		return data.call(vm, vm)
	} catch (e) {
		console.error(e, vm, `data()`)
		return {}
	} finally {
		popTarget()
	}
}
