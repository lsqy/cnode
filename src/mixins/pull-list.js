import is from 'is'
import util from 'util'
import routeData from 'route-data'
const { history, location } = window

const getPageKey = () => {
  return is.object(history.state) ? history.state.key : location.href
}

// console.log('routeData', routeData)
export default {
  mixins: [routeData],
  /*
   * 自定义属性
   */
  routeData () {
    return {
      complete: false, // 数据是否加载完成
      loading: false, // 是否在请求中
      page: 1, // 当前请求的页数
      list: [] // 列表的数据
    }
  },
  mounted () {
    this.loading = false
  },
  created () {
    if (getPageKey() !== this.list.key) { // 页面前进
      if (this.page === 1) { // 首次访问组件
        this.pullList()
        this.list.key = getPageKey()
      } else {
        Object.assign(this.$data, this.$options.routeData())
        this.$nextTick(() => {
          this.list.key = getPageKey()
          this.pullList()
        })
      }
    } else {
      this.loading = false // 防止路由切换时，没有执行回调时引发的bug
    }
  },
  watch: {
    $route () {
      console.log('history.state', history.state)
      console.log('this.list', this.list)
      if (getPageKey() !== this.list.key) { // 页面前进，则重置数据
        Object.assign(this.$data, this.$options.routeData())
        /*
         * 将回调延迟到下次 DOM 更新循环之后执行
         */
        this.$nextTick(() => {
          this.list.key = getPageKey()
          this.pullList()
        })
      } else {
        // console.log('getPageKey()', getPageKey())
        console.log('后退返回页面，无需任何操作，从缓存中还原数据')
      }
    }
  },
  methods: {
    pullList () {
      /*
       * 加载下一页的主逻辑方法
       * 首先调用它的时候，如果this.complete || this.loading，即已经请求完成或者正在loading，则直接返回，不执行下面的ajax请求
       */
      /*
       * 如果已经完成或者正在loading则return，防止重复请求
       */
      if (this.complete || this.loading) return
      /*
       * 开启loading
       */
      this.loading = true
      /*
       * 通过解构赋值来取出 this._pullList()中的url和data
       */
      var { url, data = {} } = this._pullList()

      util.get(url, data, ({ data }) => {
        /*
         * 通过对象的解构赋值来取出data，如果data.length大于0，则说明是个列表数组，然后就可以将其推到this.list当中，
         * 否则将完成状态设为true
         */
        // console.log('data', data)
        if (data.length > 0) {
          data.forEach((item) => this.list.push(item))
        } else {
          /*
           * 如果没有数据了则证明已经将所有数据请求完了，没有新的数据了
           */
          this.complete = true
        }
        /*
         * 将page+1，以前最传统的方式，是存到了该列表DOM的自定义属性中，现在可以直接以一个响应式的数据来存储，无疑这样既优雅又有语义性
         * 再取消loading状态
         */
        this.page++
        this.loading = false
      })
    },
    seeing () {
      /*
       * 主要触发点
       * 当它里面的loading组件emit一个seeing事件时，其实还是挺有意思的，当这个loading组件被看到之后，它就赶快通知它的父组件，说我被看到了，然后父组件赶快
       * 再加载一页，来让这个loading不被看到，非常像一个小孩，就触发加载更多，
       */
      if (this.page === 1) return // 防止偶然性的第一个重复请求的bug
      this.pullList()
    }
  }
}
