function defineReactive(data,key,val){
		var dep = new Dep();
		let childOb = observe(val)
		Object.defineProperty(data,key,{
			enumerable: true,
			configurable: true,
			get:function reactiveGetter(){
				if (Dep.target) {
				    dep.addSub(Dep.target);
				}
				
				return val
			},
			set:function reactiveSetter(newVal){
				if(newVal === val){
					return;
				}
				val = newVal;
				dep.notify();
			}
		})
}
class Dep {
	
  constructor () {
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null

class Observer {
  constructor (value) {
    this.value = value
    this.walk(value)
  }
  walk(obj){
  	const keys = Object.keys(obj)
  	for (let i = 0; i < keys.length; i++) {
  	  defineReactive(obj, keys[i],obj[keys[i]])
  	}
  }
}

function observe(value, vm) {
	if (!value || typeof value !== 'object') {
		return;
	}
	return new Observer(value);
};