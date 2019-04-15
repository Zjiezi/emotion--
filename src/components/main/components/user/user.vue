<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">消息中心
          <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import "./user.less";
import { mapActions } from "vuex";
export default {
  name: "User",
  props: {
    userAvator: {
      type: String,
      default: ""
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    logout() {
      this.handleLogOut().then(() => {
        //系统再切换用户时，路由不会动态更新,刷新浏览器(如果当时处于其他的路由刷新会重新加载这个时候是找不到的，所以会跳转到首页)
        location.reload()
        this.$router.push('loginBack');
      });
    },
    message() {
      this.$router.push({
        name: "message_page"
      });
    },
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "message":
          this.message();
          break;
      }
    }
  }
};
</script>
