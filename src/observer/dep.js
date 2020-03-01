import {
	remove
} from '../utils'
let uid = 0
export default class Dep {
	constructor() {
		this.id = uid++
		this.subs = []
	}
	addSub(Watcher) {
		this.subs.push(Watcher)
	}
	removeSub(Watcher) {
		remove(this.subs, Watcher)
	}
	depend() {
		if (Dep.target) {
			Dep.target.addDep(this)
		}
	}
	notify() {
		const subs = this.subs.slice()
		subs.sort((a, b) => a.id - b.id)
		for (let i = 0, l = subs.length; i < l; i++) {
			subs[i].update()
		}
	}
}


Dep.target = null

const targetStack = []

export function pushTarget(Watcher) {
	targetStack.push(Watcher)
	Dep.target = Watcher
}

export function popTarget(Watcher) {
	targetStack.pop()
	Dep.target = targetStack[targetStack.length - 1]
}
