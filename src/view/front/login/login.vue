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
  background: rebeccapurple;
  background-image: url("../../../assets/images/login.jpg");
  background-size: 100%;
}
.index .ivu-row-flex {
  height: 100%;
}
#index_pc_bj {
  width: 100%;
  height: auto;
  background-size: cover;
  overflow: hidden;
  background-position: center center; /*box-shadow: 0 0px 3px rgba(0,0,0,.5);*/
  text-align: center;
}
/*具体内容*/
.wrap_conter ul {
  position: relative;
  width: 300px;
  border-radius: 5px;
  background: #fff;
  margin: 0 auto;
}
.wrap_conter li {
  text-align: center;
  color: #fff;
  font-size: 12px;
  line-height: 30px;
  padding: 0 25px 0px 25px;
  width: 100%;
}
.content {
  color: #1c2438;
  line-height: 40px;
  display: block;
  text-align: left;
  padding: 5px 0 0 0;
  margin: 0 80px 0 20px;
}
.pc-hign {
  height: 75px;
  display: inline-table;
}
.wrap_conter li dl {
  width: 100%;
  margin-top: 20px;
}
.name-password-error {
  padding-bottom: 2px;
  text-align: left;
  line-height: 1;
  color: #ed3f14;
}
</style>
<template>
    <div class="index">
        <div id="index_pc_bj">
            <Form ref="formLogin"  :model="formLogin" :rules="ruleLogin">
                <div class="wrap_conter">
                    <ul style="list-style: none;box-shadow:10px 10px 20px rgba(0,0,0,.5);">
                        <li style="border-bottom: 1px solid #e9eaec;">
                            <div class="content">
                                <span style="float:right;font-size: 15px"><Icon type="log-out"></Icon>欢迎登录</span>
                                </img>
                            </div>
                        </li>
                        <li>                           
                            <dl>
                                <FormItem prop="userName" >
                                    <Input v-model="formLogin.userName" type="text" placeholder="登录名" >
                                        <Icon type="ios-person-outline" slot="prepend" ></Icon>
                                    </Input>
                                </FormItem>
                                <FormItem prop="password">
                                    <Input v-model="formLogin.password" type="password" placeholder="密码" >
                                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                    </Input>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="login('formLogin')" style="width: 250px">登录</Button>
                                     <div style="width: 250px">
                                        <Icon type="ios-person"></Icon>
                                    </div>
                                </FormItem>
                            </dl>
                        </li>
                    </ul>
                </div>
            </Form>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      code: null,
      formLogin: {
        userName: null,
        password: null
      },
      ruleLogin: {
        userName: [
          { required: true, message: "请填写用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login(formLogin) {
      this.$refs[formLogin].validate(valid => {
        if (valid) {
          this.$ajax({
            method: "post",
            url: "/login",
            data: {
              username: this.formLogin.userName,
              password: this.formLogin.password
            }
          })
            .then(response => {
              //成功后跳转到index界面
              console.log(response);
              let data = response.data;
              this.$router.push("page"); // 在箭头函数内部的this并不指向这个函数 而是指向vue实例
            })
            .catch(function(response) {
              console.error(response);
            });
        }
      });
    }
  }
};
</script>