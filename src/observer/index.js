import Dep from './dep.js'
import {
	def,
	isObject,
	hasOwn,
} from '../utils'
import {
	arrayMethods
} from './array.js'



export let shouldObserver = true


export function toggleObserving(value) {
	shouldObserve = value
}


export class Observer {
	constructor(value) {
		this.value = value
		this.dep = new Dep()
		this.vmCount = 0
		def(value, '__ob__', this)
		if(Array.isArray(value)) {
			protoAugment(value, arrayMethods)
			this.observeArray(value)
		} else {
			this.walk(value)
		}
	}
	walk(obj) {
		const keys = Object.keys(obj)
		for (let i = 0; i < keys.length; i++) {
			defineReactive(obj, keys[i])
		}
	}
	observeArray(items) {
		for (let i = 0, l = items.length; i < l; i++) {
			observe(items[i])
		}
	}
}

function protoAugment(target, src) {
	target.__proto__ = src
}

export function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  let ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else{
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}


export function defineReactive(
	obj,
	key,
	val,
	customSetter,
	shallow
) {
	const dep = new Dep()

	const property = Object.getOwnPropertyDescriptor(obj, key)
	if (property && property.configurable === false) {
		return
	}

	// cater for pre-defined getter/setters
	const getter = property && property.get
	const setter = property && property.set
	if ((!getter || setter) && arguments.length === 2) {
		val = obj[key]
	}

	let childOb = !shallow && observe(val)
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function reactiveGetter() {
			const value = getter ? getter.call(obj) : val
			if (Dep.target) {
				dep.depend()
				if (childOb) {
					childOb.dep.depend()
					if (Array.isArray(value)) {
						dependArray(value)
					}
				}
			}
			return value
		},
		set: function reactiveSetter(newVal) {
			const value = getter ? getter.call(obj) : val
			if (newVal === value || (newVal !== newVal && value !== value)) {
				return
			}
			// #7981: for accessor properties without setter
			if (getter && !setter) return
			if (setter) {
				setter.call(obj, newVal)
			} else {
				val = newVal
			}
			childOb = !shallow && observe(newVal)
			dep.notify()
		}
	})
}


function dependArray (value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
