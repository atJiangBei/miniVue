const parsedirectives = {
	isDirective (attr) {
	    return attr.indexOf('v-') === 0;
	},
	isEventDirective (dir) {
	    return dir.indexOf('on:') === 0;
	},
	isTextDirective (dir) {
	    return dir.indexOf('text') === 0;
	},
}
const parsenode = {
	isElementNode (node) {
	    return node.nodeType === 1;
	},
	isTextNode (node) {
	    return node.nodeType === 3;
	},
	isFormNode (node) {
		return node.tagName === "TEXTAREA" || node.tagName === "INPUT"
	}
}
const reg = /\{\{(.*)\}\}/;

class Compile{
	constructor(el, vm) {
		this.vm = vm;
		this.el = document.querySelector(el);
		this.fragment = null;
		this.init();
	}
    init () {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.log('Dom元素不存在');
        }
    }
    nodeToFragment (el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment;
    }
    compileElement (el) {
        var childNodes = el.childNodes;
        var self = this;
        [].slice.call(childNodes).forEach(function(node) {
            var text = node.textContent;
            if (parsenode.isElementNode(node)) {  
                self.compile(node);
            } else if (parsenode.isTextNode(node) && reg.test(text)) {
                self.compileMustacheText(node, reg.exec(text)[1]);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    }
    compile (node) {
        var nodeAttrs = node.attributes;
        var self = this;
        [].forEach.call(nodeAttrs, function(attr) {
            var attrName = attr.name;
            if (parsedirectives.isDirective(attrName)) {
                var exp = attr.value;
                var dir = attrName.substring(2);
                if (parsedirectives.isEventDirective(dir)) {  // 事件指令
                    self.compileEvent(node, self.vm, exp, dir);
                } else if(parsedirectives.isTextDirective(dir)){
					self.compileinnerText(node,exp)
				} else{  // v-model 指令
                    self.compileModel(node, self.vm, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        });
    }
    compileMustacheText (node, exp) {
        const self = this;
        const initText = this.vm[exp];
        this.updateText(node, initText);
        new Watcher(this.vm, exp, function (value) {
            self.updateText(node, value);
        });
    }
    compileEvent (node, vm, exp, dir) {
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[exp];

        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    }
	compileinnerText (node,exp) {
		const self = this;
		const initText = this.vm[exp];
		this.updateText(node, initText);
		new Watcher(this.vm, exp, function (value) {
		    self.updateText(node, value);
		});
	}
    compileModel (node, vm, exp, dir) {
		
        var self = this;
        var val = this.vm[exp];
        this.modelUpdater(node, val);
        new Watcher(this.vm, exp, function (value) {
			self.modelUpdater(node, value);
        });
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            self.vm[exp] = newValue;
            val = newValue;
        });
    }
    updateText (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    }
    modelUpdater (node, value, oldValue) {
		node.value = value
    }
}