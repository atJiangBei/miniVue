/* @flow */

import {
	callHook,
	activateChildComponent
} from '../instance/lifecycle'
import {
	nextTick
} from '../nextTick'
import {
	inBrowser,
	isIE
} from '../utils'

export const MAX_UPDATE_COUNT = 100

const queue = []
const activatedChildren = []
let has = {}
let circular = {}
let waiting = false
let flushing = false
let index = 0

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
	index = queue.length = activatedChildren.length = 0
	has = {}
	if (process.env.NODE_ENV !== 'production') {
		circular = {}
	}
	waiting = flushing = false
}



/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
	flushing = true
	let watcher, id

	// Sort queue before flush.
	// This ensures that:
	// 1. Components are updated from parent to child. (because parent is always
	//    created before the child)
	// 2. A component's user watchers are run before its render watcher (because
	//    user watchers are created before the render watcher)
	// 3. If a component is destroyed during a parent component's watcher run,
	//    its watchers can be skipped.
	//刷新前对队列排序。

	//这确保：

	//一。组件从父级更新到子级。（因为父母总是

	//在子对象之前创建）

	//2。组件的用户观察程序在其呈现观察程序之前运行（因为

	//在渲染观察程序之前创建用户观察程序）

	//三。如果组件在父组件的监视程序运行期间被破坏，

	//它的观察者可以被跳过。
	queue.sort((a, b) => a.id - b.id)

	// do not cache length because more watchers might be pushed
	// as we run existing watchers
	//不要缓存长度，因为可能会推送更多的观察者

	//当我们运行现有的监视程序时
	for (index = 0; index < queue.length; index++) {
		watcher = queue[index]
		if (watcher.before) {
			watcher.before()
		}
		id = watcher.id
		has[id] = null
		watcher.run()
	}

	// keep copies of post queues before resetting state
	const activatedQueue = activatedChildren.slice()
	const updatedQueue = queue.slice()

	resetSchedulerState()

	// call component updated and activated hook
}


/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
export function queueActivatedComponent(vm) {
	// setting _inactive to false here so that a render function can
	// rely on checking whether it's in an inactive tree (e.g. router-view)
	vm._inactive = false
	activatedChildren.push(vm)
}


/**
*将观察者推入观察者队列。

*具有重复ID的作业将被跳过，除非

*刷新队列时推送。
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher(watcher) {
	const id = watcher.id
	if (has[id] == null) {
		has[id] = true
		if (!flushing) {
			queue.push(watcher)
		} else {
			// if already flushing, splice the watcher based on its id
			// if already past its id, it will be run next immediately.
			//如果已经刷新，则根据观察程序的id将其拼接

			//如果已经超过了它的id，它将立即运行。
			let i = queue.length - 1
			while (i > index && queue[i].id > watcher.id) {
				i--
			}
			queue.splice(i + 1, 0, watcher)
		}
		// queue the flush
		if (!waiting) {
			waiting = true
			nextTick(flushSchedulerQueue)
		}
	}
}
