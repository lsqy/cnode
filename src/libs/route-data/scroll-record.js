import RouterStore from './store'

const store = new RouterStore()

/*
 * 当只传入el的时候，获得其滑动的高度，如果还传入了value，则会使el滑动到value处
 */
const scrollTop = (el, value) => {
  /*
   * 能力检测，确保是否有scrollTop属性
   */
  const hasScrollTop = 'scrollTop' in el
  // console.log('value', value)
  if (value === undefined) return hasScrollTop ? el.scrollTop : el.pageYOffset
  /*
   * 当value不为undefined时，则可以直接通过赋值scrollTop来实现
   */
  if (hasScrollTop) {
    el.scrollTop = value
  } else {
    el.scrollTo(el.scrollX, value)
  }
}
/*
 * 监听滚动条改变事件
 */
const scroll = () => {
  // console.log('event', event)
  /*
   * 通过event来取到__url
   */
  var { target: { __url } } = event
  // console.log('__url', __url)
  /*
   * 如果__url存在，则存一下滑动的距离
   */
  if (__url) {
    /*
     * 获得以下当前元素的滑动距离
     */
    var top = scrollTop(event.target)
    // console.log('top', top)
    /*
     * 将这个滑动距离存到该url路径当中
     */
    store.setItem(__url, top)
    // console.log('store', store)
  }
}
/*
 * 指令的主体部分
 */
export default {
  inserted (el, binding, vnode) {
    const init = (to) => {
      /*
       * 保存当前关联的url
       */
      var __url = el.__url = store.getUrl(to)
      // console.log('__url', __url)
      /*
       * 绑定滚动事件
       */
      el.addEventListener('scroll', scroll, false)
      /*
       * 获得当前url的top值，如果top值存在则使页面滑到这个top处
       */
      console.log('store', store)
      var top = store.getItem(__url)
      if (top) {
        scrollTop(el, top)
      }
    }
    /*
     * DOM渲染完成后重新初始化
     */
    init(vnode.context.$route)
    /*
     * 每次路由更改后，重新初始化
     */
    vnode.context.$watch('$route', init)
  },
  unbind (el, binding, vnode) {
    /*
     * 解除滚动事件绑定
     */
    el.removeEventListener('scroll', scroll, false)
  }
}
