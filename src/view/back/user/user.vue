<template>
  <div>
    <!-- 过滤组件 -->
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in searchColumns" :value="item.key" :key="item.index">{{ item.title }}</Option>
      </Select>
      <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" type="primary" shape="circle" icon="ios-search"></Button>
      <Button @click="modalUser = true" icon="ios-add-circle-outline" shape="circle" type="info">新增</Button>
      <Button @click="getOne()" type="success" shape="circle" icon="ios-build">修改</Button>
      <Button @click="handleDelete()" type="error" shape="circle" icon="ios-trash">删除</Button>
    </div>

    <Table :data="tableData" :columns="tableColumns" @on-selection-change="s=>{change(s)}"></Table>
    <Modal v-model="modalUser" title="用户信息" @on-ok="handleAdd(formItem)" @on-cancel="cancel">
      <Form ref="formItem" :model="formItem" :label-width="80">
        <Form-item hidden prop="id"></Form-item>
        <Form-item label="用户名" prop="username">
          <Input v-model="formItem.username" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="真实姓名" prop="realname">
          <Input v-model="formItem.realname" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="性别" prop="gender">
          <Select v-model="formItem.gender">
            <Option :value="0">男</Option>
            <Option :value="1">女</Option>
          </Select>
        </Form-item>
      </Form>
    </Modal>

    <Modal v-model="modalRole" title="分配角色">
      <div>
        <Table
          :columns="columns2"
          :data="data2"
          :height="260"
          @on-selection-change="s=>{changeRole(s)}"
          :loading="loading"
        ></Table>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="handleSetRole()">确定</Button>
      </div>
    </Modal>

    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          :total="pageInfo.total"
          :page-size="pageInfo.pageSize"
          show-elevator
          show-sizer
          show-total
          @on-change="e=>{pageSearch(e)}"
        ></Page>
      </div>
    </div>
  </div>
</template>
<script>
import "_c/tables/index.less";

export default {
  data() {
    return {
      //新增
      modalUser: false,
      modalRole: false,
      loading: false,
      //选择用户事件数组
      datas: [],
      //选择角色事件数组
      datasRole: [],
      formItem: {
        /*选择的数据*/
        id: null,
        username: null,
        realname: null,
        gender: null
      },

      /*pageInfo实体*/
      pageInfo: {
        total: 0,
        page: 1,
        pageSize: 5
      },

      //角色表数据
      data2: [],
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          index: 1,
          title: "角色名称",
          key: "name"
        },
        {
          index: 2,
          title: "描述",
          key: "description"
        }
      ],

      //表数据
      tableData: [],
      //表显示字段
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          index: 1,
          title: "id",
          key: "id"
        },
        {
          index: 2,
          title: "用户名",
          key: "username"
        },
        {
          index: 3,
          title: "真实名",
          key: "realname"
        },
        {
          index: 4,
          title: "性别",
          key: "gender",
          render: (h, params) => {
            let gender = params.row.gender;
            const name = gender == 0 ? "男" : "女";
            return h("div", name);
          }
        },
        {
          title: "角色名称",
          key: "name",
          render(h, params) {
            let hs = [];
            if (params.row.roles.length > 0) {
              for (let i = 0; i < params.row.roles.length; i++) {
                let na = params.row.roles[i].name;
                hs.push(
                  h(
                    "Tag",
                    {
                      props: {
                        color: "purple"
                      }
                    },
                    na
                  )
                );
              }
            }
            return h("div", hs);
          }
        },

        {
          title: "注册时间",
          key: "createdAt"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    icon: "ios-cog-outline",
                    type: "info"
                  },
                  style: {
                    marginRight: "3px"
                  },
                  on: {
                    click: () => {
                      this.getRole(params);
                    }
                  }
                },
                "分配角色"
              )
            ]);
          }
        }
      ],

      //过滤属性
      searchKey: "",
      searchValue: "",
      searchColumns: []
    };
  },
  methods: {
    /*table选择后触发事件*/
    change(e) {
      this.datas = e;
    },
    changeRole(e) {
      this.datasRole = e;
    },

    handleSetRole() {
      if (this.datasRole.length < 1) {
        this.$Message.warning("请至少选择一个角色");
      } else {
        let ids = [];
        for (var i = 0; i <= this.datasRole.length - 1; i++) {
          ids.push(this.datasRole[i].id);
        }
        this.$ajax({
          method: "get",
          url: "/system/user/addUserRole",
          params: {
            ids: ids.toString(),
            id: this.formItem.id
          }
        })
          .then(res => {
            this.$Message.success(res.data.message);
            this.getTableData({
              pageInfo: this.pageInfo
            });
            this.datasRole = [];
            this.modalRole = false;
          })
          .catch(function(response) {
            console.error(response);
          });
      }
    },

    getRole(params) {
      this.modalRole = true;
      this.formItem.id = params.row.id;
      this.$ajax({
        method: "get",
        url: "/sys/role/all"
      })
        .then(res => {
          this.data2 = res.data.data;
        })
        .catch(function(response) {
          console.error(response);
        });
    },

    getOne() {
      if (this.datas.length > 1 || this.datas.length < 1) {
        this.$Message.warning("请至少选择一项(且只能选择一项)");
      } else {
        let id = this.datas[0].id;
        this.modalUser = true;
        this.$ajax({
          method: "get",
          url: "/system/user/get/" + id
        })
          .then(res => {
            let user = res.data.data;
            this.formItem.id = user.id;
            this.formItem.username = user.username;
            this.formItem.realname = user.realname;
            this.formItem.gender = user.gender;
          })
          .catch(function(response) {
            console.error(response);
          });
      }
    },

    cancel() {
      this.datasRole = [];
      this.modalRole = false;
      this.$refs.formItem.resetFields();
    },

    handleSearch() {
      this.getTableData({
        pageInfo: this.pageInfo
      });
    },

    handleAdd(formItem) {
      this.$ajax({
        method: "post",
        url: "/system/user/add",
        data: formItem
      })
        .then(res => {
          this.$Message.success(res.data.message);
          this.getTableData({
            pageInfo: this.pageInfo
          });
          this.$refs.formItem.resetFields();
        })
        .catch(function(response) {
          console.error(response);
        });
    },

    handleDelete() {
      if (this.datas.length < 1) {
        this.$Message.warning("请至少选择一项");
      } else {
        let ids = [];
        for (var i = 0; i <= this.datas.length - 1; i++) {
          ids.push(this.datas[i].id);
        }
        this.$ajax({
          method: "delete",
          url: "/system/user/delete/" + ids
        })
          .then(res => {
            this.$Message.success(res.data.message);
            this.getTableData({
              pageInfo: this.pageInfo
            });
          })
          .catch(function(response) {
            console.error(response);
          });
      }
    },

    getTableData(e) {
      this.$ajax({
        method: "get",
        url: "/system/user/pages",
        params: {
          page: e.pageInfo.page,
          pageSize: e.pageInfo.pageSize,
          [this.searchKey]: this.searchValue
        }
      })
        .then(res => {
          this.tableData = res.data.data.rows;
          this.pageInfo.total = res.data.data.total;
        })
        .catch(function(response) {
          console.error(response);
        });
    },

    /*分页点击事件*/
    pageSearch(e) {
      this.pageInfo.page = e - 1;
      this.getTableData({
        pageInfo: this.pageInfo
      });
    }
  },

  mounted() {
    this.searchColumns = this.tableColumns.filter(item => item.index != null);
    this.getTableData({
      pageInfo: this.pageInfo
    });
  }
};
</script>
