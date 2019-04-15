<style scoped>
.index {
  align-items: center;
  display: flex;
  width: 100%;
  min-width: 300px;
  min-height: 300px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background-image: url("../../../assets/images/index.jpg");
  background-size: 100%;
}

.indexbun {
  left: 48%;
  position: relative; /*设置相对定位*/
}
</style>
<template>
<div class="index">
<div class="indexbun"><Button type="dashed" shape="circle" @click="clickLogin">进</Button></div>
<div class="indexbun"><Button type="dashed" shape="circle" @click="clickLoginTwo">出</Button></div>
</div>
</template>


<script>
export default {
  methods: {
    clickLogin() {
      this.$router.push("moodIndex");
    },
    clickLoginTwo() {
      this.$router.push("LoginBack");
    }
  }
};
</script>

