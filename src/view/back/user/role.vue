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

    <Table :data="tableData" :columns="tableColumns" @on-selection-change="s=>{changeRole(s)}"></Table>
    <Modal
      v-model="modalUser"
      title="角色信息"
      @on-ok="handleAdd(formItem)"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
        <Form-item label="中文名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="英文名称" prop="roleName">
          <Input v-model="formItem.roleName" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="角色类型" prop="roleType">
          <Input v-model="formItem.roleType" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="描述" prop="description">
          <Input v-model="formItem.description" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="是否可用" prop="isShow">
          <i-switch v-model="formItem.isShow" @on-change="change">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </Form-item>
      </Form>
    </Modal>

    <Modal v-model="modalResource" title="资源权限信息">
      <div>
        <Table :columns="columns2" :data="data2" :height="260"></Table>
      </div>

      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="handleSetResource()">确定</Button>
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
      modalResource: false,
      loading: true,
      datas: [],
      datasResource: [],
      formItem: {
        id: null,
        name: null,
        roleName: null,
        roleType: null,
        description: null,
        isShow: true
      },
      /*新增验证*/
      ruleValidate: {
        name: [
          {
            type: "string",
            required: true,
            message: "输入中文角色",
            trigger: "blur"
          }
        ],
        roleName: [
          {
            type: "string",
            required: true,
            message: "输入英文角色",
            trigger: "blur"
          }
        ]
      },

      /*分页属性绑定值*/
      /*pageInfo实体*/
      pageInfo: {
        total: 0,
        page: 0,
        pageSize: 10
      },

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
          title: "中文名称",
          key: "name"
        },
        {
          index: 3,
          title: "英文名称",
          key: "roleName"
        },
        {
          index: 4,
          title: "角色类型",
          key: "roleType"
        },
        {
          title: "描述",
          key: "description"
        },
        {
          index: 5,
          title: "是否可用",
          key: "isShow",
          render: (h, params) => {
            let isShow = params.row.isShow;
            const name = isShow ? "是" : "否";
            return h("div", name);
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
                      this.getResource(params);
                    }
                  }
                },
                "资源权限分配"
              )
            ]);
          }
        }
      ],

      //资源权限表数据
      data2: [],
      columns2: [
        {
          index: 1,
          title: "资源权限名称",
          key: "name"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("i-switch", {
                attrs: {
                  value: params.row.iswitch
                },
                on: {
                  "on-change": val => {
                    var i = this.moduleArr.indexOf(params.row.id + "");
                    if (val) {
                      if (i == -1) {
                        this.moduleArr.push(params.row.id + "");
                      }
                    } else {
                      if (i != -1) {
                        this.moduleArr.splice(i, 1);
                      }
                    }
                  }
                }
              })
            ]);
          }
        }
      ],
      /*临时存储资源的数组*/
      moduleArr: [],

      //过滤属性
      searchKey: "",
      searchValue: "",
      searchColumns: []
    };
  },
  methods: {
    /*table选择后触发事件*/
    changeRole(e) {
      this.datas = e;
    },

    change(status) {
      this.formItem.isShow = status;
    },

    handleSetResource() {
      if (this.moduleArr.length < 1) {
        this.$Message.warning("请至少选择一个资源权限");
      } else {
        this.$ajax({
          method: "get",
          url: "/sys/role/addRoleResource",
          params: {
            id: this.formItem.id,
            ids: this.moduleArr.toString()
          }
        })
          .then(res => {
            this.$Message.success(res.data.message);
            this.moduleArr=[]
            this.modalResource = false
          })
          .catch(function(response) {
            console.error(response);
          });
      }
    },

    getResource(params) {
      this.modalResource = true;
      this.formItem.id = params.row.id;
      this.$ajax({
        method: "get",
        url: "/sys/resource/all",
        params: {
          id: this.formItem.id
        }
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
          url: "/sys/role/get/" + id
        })
          .then(res => {
            let date = res.data.data;
            this.formItem.id = date.id;
            this.formItem.name = date.name;
            this.formItem.roleName = date.roleName;
            this.formItem.roleType = date.roleType;
            this.formItem.description = date.description;
            this.formItem.isShow = date.isShow;
          })
          .catch(function(response) {
            console.error(response);
          });
      }
    },
    cancel() {
      this.modalResource = false;
      this.moduleArr = [];
      this.$refs.formItem.resetFields();
    },

    handleSearch() {
      this.getTableData({
        pageInfo: this.pageInfo
      });
    },

    handleAdd(formItem) {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.$ajax({
            method: "post",
            url: "/sys/role/add",
            data: formItem
          })
            .then(res => {
              if (res.data.code == 0) {
                this.$Message.success(res.data.message);
                this.getTableData({
                  pageInfo: this.pageInfo
                });
                this.$refs.formItem.resetFields();
                this.modalUser = false;
              } else {
                this.$Message.error(res.data.message);
                setTimeout(() => {
                  this.loading = false;
                  this.$nextTick(() => {
                    this.loading = true;
                  });
                }, 1000);
              }
            })
            .catch(function(response) {
              console.error(response);
            });
        } else {
          setTimeout(() => {
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            });
          }, 1000);
        }
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
          url: "/sys/role/delete/" + ids
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
        url: "/sys/role/pages",
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
