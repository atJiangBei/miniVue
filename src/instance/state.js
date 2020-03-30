import Watcher from '../observer/watcher'
import Dep, {
	pushTarget,
	popTarget
} from '../observer/dep'
import {
	observe,
	toggleObserving
} from '../observer/index'

const noop = ()=>{};
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function initState(vm) {
	vm._watchers = [];
	const opts = vm.$options;
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


function initWatch (vm, watch) {
  for (const key in watch) {
    const handler = watch[key]
    createWatcher(vm, key, handler)
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}


const computedWatcherOptions = { lazy: true }

// function initComputed (vm, computed) {
//   // $flow-disable-line
//   const watchers = vm._computedWatchers = Object.create(null)

//   for (const key in computed) {
//     const userDef = computed[key]
//     const getter = typeof userDef === 'function' ? userDef : userDef.get
//     watchers[key] = new Watcher(
//       vm,
//       getter || noop,
//       noop,
//       computedWatcherOptions
//     )

//     // component-defined computed properties are already defined on the
//     // component prototype. We only need to define computed properties defined
//     // at instantiation here.
//     if (!(key in vm)) {
//       defineComputed(vm, key, userDef)
//     }
//   }
// }

// export function defineComputed (
//   target,
//   key,
//   userDef
// ) {
//   const shouldCache = !isServerRendering()
//   if (typeof userDef === 'function') {
//     sharedPropertyDefinition.get = shouldCache
//       ? createComputedGetter(key)
//       : createGetterInvoker(userDef)
//     sharedPropertyDefinition.set = noop
//   } else {
//     sharedPropertyDefinition.get = userDef.get
//       ? shouldCache && userDef.cache !== false
//         ? createComputedGetter(key)
//         : createGetterInvoker(userDef.get)
//       : noop
//     sharedPropertyDefinition.set = userDef.set || noop
//   }
//   if (process.env.NODE_ENV !== 'production' &&
//       sharedPropertyDefinition.set === noop) {
//     sharedPropertyDefinition.set = function () {
//       warn(
//         `Computed property "${key}" was assigned to but it has no setter.`,
//         this
//       )
//     }
//   }
//   Object.defineProperty(target, key, sharedPropertyDefinition)
// }

// function createComputedGetter (key) {
//   return function computedGetter () {
//     const watcher = this._computedWatchers && this._computedWatchers[key]
//     if (watcher) {
//       if (watcher.dirty) {
//         watcher.evaluate()
//       }
//       if (Dep.target) {
//         watcher.depend()
//       }
//       return watcher.value
//     }
//   }
// }