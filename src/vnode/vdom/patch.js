export function render(vnode, container) {
	let el = createElm(vnode)
	container.appendChild(el)

}

function createElm(vnode) {
	let {
		tag,
		children,
		key,
		props,
		text
	} = vnode;
	if (typeof tag === 'string') {
		vnode.el = document.createElement(tag)
		updateProperties(vnode)
		children.forEach(child => {
			return render(child, vnode.el)
		})
	} else {
		vnode.el = document.createTextNode(text)
	}
	return vnode.el
}

function updateProperties(vnode, oldProps = {}) {
	let newProps = vnode.props || {};
	let el = vnode.el;

	let newStyle = newProps.style || {};
	let oldStyle = oldProps.style || {}
	for (let key in oldProps) {
		if (!newStyle[key]) {
			el.style[key] = ''
		}
	}
	for (let key in oldProps) {
		if (!newProps[key]) {
			delete el[key]
		}
	}
	for (let key in newProps) {
		if (key === 'style') {
			for (let styleName in newProps.style) {
				el.style[styleName] = newProps.style[styleName]
			}
		} else if (key === 'class') {
			el.className = newProps.class
		} else {
			el[key] = newProps[key]
		}
	}
}



export function patch(oldVnode, newVnode) {
	//1,先对比 是否同样的标签
	if (oldVnode.tag !== newVnode.tag) {
		let el = createElm(newVnode)

		oldVnode.el.parentNode.replaceChild(el, oldVnode.el)
	}
	//tag一样，比文本
	if (!oldVnode.tag) {
		if (oldVnode.text !== newVnode.text) {
			oldVnode.el.textContent = newVnode.text
		}
	}
	//标签一样属性不一样
	let el = newVnode.el = oldVnode.el; //标签一样，复用即可
	updateProperties(newVnode, oldVnode.props)
	//比较孩子
	let oldChildren = oldVnode.children || [];
	let newChildren = newVnode.children || [];
	//老的有孩子，新的有孩子
	if (oldChildren.length > 0 && newChildren.length > 0) {
		updateChildren(el, oldChildren, newChildren)
	} else if (oldChildren.length > 0) {
		el.innerHTML = ''
	} else if (newChildren.length > 0) {
		for (let i = 0; i < newChildren.length; i++) {
			let child = newChildren[i];
			el.appendChild(createElm(child))
		}
	}
	return el
}

function isSameVnode(oldStartVnode, newStartVnode) {
	return oldStartVnode.tag === newStartVnode.tag && oldStartVnode.key === newStartVnode.key
}

function mapIndexByKey(children) {
	let map = {};
	children.forEach((item, index) => {
		map[item.key] = index
	})
	return map
}

function updateChildren(parent, oldChildren, newChildren) {
	let map = mapIndexByKey(oldChildren)
	let oldStartIndex = 0;
	let oldStartVnode = oldChildren[oldStartIndex];
	let oldEndIndex = oldChildren.length - 1;
	let oldEndVnode = oldChildren[oldEndIndex];
	//新
	let newStartIndex = 0;
	let newStartVnode = newChildren[newStartIndex];
	let newEndIndex = newChildren.length - 1;
	let newEndVnode = newChildren[newEndIndex];


	while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {

		if (!oldStartVnode) {
			oldStartVnode = oldChildren[++oldStartIndex];
		} else if (!oldEndVnode) {
			oldEndVnode = oldChildren[--oldEndIndex];
		} else if (isSameVnode(oldStartVnode, newStartVnode)) {

			patch(oldStartVnode, newStartVnode);
			oldStartVnode = oldChildren[++oldStartIndex];
			newStartVnode = newChildren[++newStartIndex];
		} else if (isSameVnode(oldEndVnode, newEndVnode)) {
			patch(oldEndVnode, newEndVnode);
			oldEndVnode = oldChildren[--oldEndIndex];
			newEndVnode = newChildren[--newEndIndex];
		} else if (isSameVnode(oldStartVnode, newEndVnode)) {
			patch(oldStartVnode, newEndVnode);
			parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
			oldStartVnode = oldChildren[++oldStartIndex];
			newEndVnode = newChildren[--newEndIndex];
		} else if (isSameVnode(oldEndVnode, newStartVnode)) {
			patch(oldEndVnode, newStartVnode);
			parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
			oldEndVnode = oldChildren[--oldEndIndex];
			newStartVnode = newChildren[++newStartIndex];
		} else {
			let moveIndex = map[newStartVnode.key];
			if (moveIndex == undefined) {
				parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
			} else {
				let moveVnode = oldChildren[moveIndex];
				oldChildren[moveIndex] = undefined;
				parent.insertBefore(moveVnode.el, oldStartVnode.el);
			}
			newStartVnode = newChildren[++newStartIndex]
		}
	}
	// for(let i=0;i<newChildren.length;i++){
	// 	console.log(149,newChildren[i].el)
	// }
	if (newStartIndex <= newEndIndex) {
		for (let i = newStartIndex; i <= newEndIndex; i++) {
			let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
			let nele = createElm(newChildren[i]);
			parent.insertBefore(nele, ele)
		}

	}
	if (oldStartIndex <= oldEndIndex) {
		for (let i = oldStartIndex; i <= oldEndIndex; i++) {
			let child = oldChildren[i]
			if (child != undefined) {
				parent.removeChild(child.el)
			}
		}

	}
}
