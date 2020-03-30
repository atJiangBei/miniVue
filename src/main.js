import Vue from './vue.js'

//import index from  "./vnode/index.js"



const vm = new Vue({
	el: "#app",
	data() {
		return {
			name: "二哈",
			arr:[1,2,3],
			person:{
				name:"小明"
			}
		}
	},
	watch:{
		name(ovl,nvl){
			console.log(ovl,nvl)
		}
	},
	render(h) {
		const map = this.arr;
		let list = map.map(item=>{
			return h("li",{},item)
		})
		return h("div", {
			style: {
				lineHeight: "32px"
			}
		}, h("h1",{style:{color:"#000"}},this.name),h("ul", {style:{color:"#f00"}}, ...list))
	}
}).mount()


setTimeout(() => {
	vm.arr.push("哈士奇")
	vm.name = "哈士奇1"
	vm.name = "哈士奇2"
	vm.name = "哈士奇3"
	vm.name = "哈士奇4"
	vm.name = "哈士奇"
}, 1000)
