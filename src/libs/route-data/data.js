/**
 * 还原页面数据
 */
import RouterStore from './store'
/*
 * 实例化一个store，使用其中的实例方法
 */
const store = new RouterStore()

/**
 * 初始化
 */
const init = function ($route) {
  // console.log('this.$options', this.$options)
  /*
   * 通过this.$options能够拿到当前组件的所有初始化选项，需要在选项中包含自定义属性时会有用处，比如这里使用它来拿到routeData
   */
  if (typeof this.$options.routeData !== 'function') {
    return new Error('必须是以方法返回对象')
  }
  /*
   * 将当前的url存到routeData的_url中，因为它是一个页面的key值，通过它能取出来它对应的页面的数据，这个点也是挺迷惑人的，
   * 因为好多人可能不知道在函数上挂载属性，但是别忘了函数也是对象
   */
  this.$options.routeData._url = store.getUrl($route)
  // console.log('this.$options.routeData', this.$options.routeData)
  // console.log('this.$options.routeData._url', this.$options.routeData._url)
  /*
   * 通过当前页面的路径来去除它下面对应的数据，当keepAlive不为空的时候直接返回它，否则返回this.$options.routeData的调用返回的对象
   */
  var keepAlive = store.getItem(this.$options.routeData._url)
  // console.log('keepAlive', keepAlive)
  if (keepAlive) {
    return keepAlive
  }
  return this.$options.routeData.call(this)
}
/**
 * 保存数据
 */
const saveData = function () {
  var data = this.$options.routeData()
  var newData = {}
  /*
   * 拷贝一份this.$options.routeData()，将其存到实例的store，键为当前页面的url
   * store的结构为
   * store : {
   *   changeList: [],
   *   data: {
   *    /?: Object,
   *    /?tab=ask: Object,
   *    /?tab=good: Object,
   *    /?tab=share: Object
   *    }
   *  }
   */
  Object.keys(data).forEach((k) => (newData[k] = this.$data[k]))
  store.setItem(this.$options.routeData._url, newData)
  // console.log('store', store)
}

export default {
  data () {
    /*
     * 这里用call(this, this.$route)是为了确保是当前组件调用
     */
    return init.call(this, this.$route)
  },
  beforeCreate () {
    console.log('storebefore', store)
  },
  beforeUpdate () {
    // console.log('beforeUpdate', store)
  },
  destroyed () {
    console.log('destroyed')
    /*
     * 组件卸载的时候将该页面的数据存到store中，以便再回到该页面的时候能够显示
     * 从首页到发表、消息、或者我的时候会触发destroyed，也就是组件卸载,首页的tab栏切换不会卸载
     */
    saveData.call(this)
  },
  watch: {
    $route (to, from) {
      console.log('change')
      console.log('storedata', store)
      /*
       * 当在首页的tab栏切换时只会触发这个改变，组件不会卸载
       * 当路由发生改变的时候，存一下数据
       */
      saveData.call(this)
      /*
       * 重置路由数据为当前页面的数据
       */
      Object.assign(this.$data, init.call(this, to))
      // console.log('this.$data', this.$data)
    }
  }
}
