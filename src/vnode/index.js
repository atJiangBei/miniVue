import {
	h,
	render,
	patch
} from './vdom/index'
var container = document.getElementById("container")

let oldNode = h("div", {
	id: "container",
	style: {
		background: "green"
	},
	key: 1
},
h('li',{style:{background:"red"},key:"a"},"a"),
h('li',{style:{background:"green"},key:"b"},"b"),
h('li',{style:{background:"pink"},key:"c"},"c"),
h('li',{style:{background:"blue"},key:"d"},"d"),

)
render(oldNode, container)
let newVnode = h('div', {
	id: "aa",
	style: {
		background: "yellow"
	}
},
h('li',{style:{background:"AntiqueWhite"},key:"f"},"f"),
h('li',{style:{background:"green"},key:"n"},"n"),
h('li',{style:{background:"Brown"},key:"m"},"m"),
h('li',{style:{background:"red"},key:"a"},"a"),
h('li',{style:{background:"green"},key:"b"},"b"),
h('li',{style:{background:"pink"},key:"c"},"c"),
h('li',{style:{background:"blue"},key:"d"},"d"),



)

setTimeout(() => {
	patch(oldNode, newVnode)
}, 1000)
