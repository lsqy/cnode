<style lang="less" scoped>
  @import "../less/config";
  .loading-box {
    .msg {
      line-height: 70px;
      text-align: center;
      font-size: 14px;
    }
  }


  .loading-start {
    margin: 20px auto 20px auto;
    position: relative;
    animation: rotate-forever 1s infinite linear;
    height: 30px;
    width: 30px;
    border: 4px solid @main;
    border-right-color: transparent;
    border-radius: 50%;
    .msg {
      display: none;
    }
  }

  @keyframes rotate-forever {
    0% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>
<template>
  <div class="loading-box">
    <!-- 如果还未完成，则一直是loading-start状态，也就是loading状态，当完成之后，则类名变为msg，里面的内容变为没有了 -->
    <div :class="!complete ? 'loading-start' : 'msg'">
      {{ complete ? '没有了' : '' }}
    </div>
  </div>
</template>
<script>
  import isSeeing from 'is-seeing'
  export default {
    props: {
      complete: { // 是否加载完成
        type: Boolean,
        default: false
      },
      loading: { // 是否在请求中
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        state: this.loading
      }
    },
    mounted () {
      this.timer = setInterval(() => {
        // console.log('this.$el', this.$el)
        // console.log('isSeeing(this.$el)', isSeeing(this.$el))
        /*
         * 通过设置一个定时器来进行检测是否需要加载更多 当看到这个元素，并且没有loading的时候，将loading设为true，并向父组件emit
         * seeing事件，父组件通过v-on来监听seeing，从而做出一些逻辑处理，在这里是再加载下一页
         */
        if (isSeeing(this.$el) && !this.state) {
          this.state = true
          /*
           * 子组件向父组件发送事件
           */
          this.$emit('seeing')
        }
      }, 300)
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    watch: {
      /*
       * 通过监听实例中的loading，来更新state，也就是对state进行重新赋值
       */
      loading (to, oldVal) {
        // console.log('to', to)
        // console.log('oldVal', oldVal)
        this.state = to
      }
    }
  }

</script>
