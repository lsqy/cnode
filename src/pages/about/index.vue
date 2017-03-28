<style lang="less" scoped>
  .content {
    bottom: 0
  }

  .about {
    padding: 10px;
    line-height: 22px;
    dt {
      line-height: 28px;
      font-weight: bold;
    }
  }
</style>
<template>
  <div>
    <v-header title="关于">
      <div slot="left" class="item" flex="main:center cross:center" v-on:click="$router.go(-1)">
        <i class="iconfont icon-back"></i>
      </div>
    </v-header>
    <v-content class="content">

    </v-content>
  </div>
</template>
<script>

</script>
