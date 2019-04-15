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

    <Table :data="tableData" :columns="tableColumns" @on-selection-change="s=>{changeResource(s)}"></Table>
    <Modal
      v-model="modalUser"
      title="资源信息"
      @on-ok="handleAdd(formItem)"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
        <Form-item hidden prop="id"></Form-item>
        <Form-item label="资源名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="资源身份" prop="identity">
          <Input v-model="formItem.identity" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="url" prop="url">
          <Input v-model="formItem.url" placeholder="/****"></Input>
        </Form-item>
        <Form-item label="父资源id" prop="parentId">
          <Input v-model="formItem.parentId" placeholder="请输入" number></Input>
        </Form-item>
        <Form-item label="资源图标" prop="icon">
          <Input v-model="formItem.icon" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="资源顺序" prop="orderNo">
          <Input v-model="formItem.orderNo" placeholder="请输入" number></Input>
        </Form-item>
        <Form-item label="是否显示" prop="isShow">
          <i-switch v-model="formItem.isShow" @on-change="change">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </Form-item>
        <!-- 只有当类型是菜单时，才有存在菜单组件和路由元信息 -->
        <Form-item label="资源类型" prop="type">
          <Select v-model="formItem.type" @on-change="changeComponent">
            <Option :value="1">普通</Option>
            <Option :value="0">菜单</Option>
          </Select>
        </Form-item>
        <div v-if="show">
          <Form-item label="菜单组件" prop="component">
            <Input v-model="formItem.component" placeholder="请输入"></Input>
          </Form-item>
          <div>
            <Form-item label="菜单标题" prop="meta.title">
              <Input v-model="formItem.meta.title" placeholder="菜单标题"/>
            </Form-item>
            <Form-item label="菜单图标" prop="meta.icon">
              <Input v-model="formItem.meta.icon" placeholder="菜单图标"/>
            </Form-item>
            <Form-item>
              <div>
                <Tag color="geekblue">菜单隐藏</Tag>
                <i-switch
                  size="large"
                  v-model="formItem.meta.hideInMenu"
                  @on-change="changeHideInMenu"
                >
                  <span slot="open">true</span>
                  <span slot="close">false</span>
                </i-switch>
                <Tag color="geekblue">导航隐藏</Tag>

                <i-switch
                  size="large"
                  v-model="formItem.meta.hideInBread"
                  @on-change="changeHideInBread"
                >
                  <span slot="open">true</span>
                  <span slot="close">false</span>
                </i-switch>
              </div>
              <div>
                <Tag color="geekblue">是否缓存</Tag>
                <i-switch size="large" v-model="formItem.meta.notCache" @on-change="changeNotCache">
                  <span slot="open">false</span>
                  <span slot="close">true</span>
                </i-switch>
                <Tag color="geekblue">关闭提醒</Tag>
                <i-switch
                  size="large"
                  v-model="formItem.meta.beforeCloseName"
                  @on-change="changeBeforeCloseName"
                >
                  <span slot="open">false</span>
                  <span slot="close">true</span>
                </i-switch>
              </div>
            </Form-item>
          </div>
        </div>
      </Form>
    </Modal>

    <Modal v-model="modalPermission" title="权限信息">
      <div>资源权限名称
        <Input v-model="permissionNames" placeholder style="width: 410px"/>
      </div>
      <br>
      <div>
        <Table
          :columns="columns2"
          :data="data2"
          :height="260"
          @on-selection-change="s=>{changePermission(s)}"
        ></Table>
      </div>

      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="handleSetPermission()">确定</Button>
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
      modalPermission: false,
      loading: true,
      //是否选择类型是菜单时，才有存在菜单组件和路由元信息
      show: false,
      //选择资源事件数组
      datas: [],
      //选择权限事件数组
      datasPermission: [],

      formItem: {
        id: null,
        name: null,
        identity: null,
        url: null,
        icon: null,
        isShow: true,
        parentId: null,
        component: null,
        type: null,
        orderNo: null,
        meta: {
          title: null,
          icon: null,
          hideInMenu: false,
          hideInBread: false,
          notCache: false,
          beforeCloseName: false
        }
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
          title: "资源名称",
          key: "name"
        },
        {
          index: 3,
          title: "资源身份",
          key: "identity"
        },
        {
          title: "url",
          key: "url"
        },
        {
          title: "父类",
          key: "parentId"
        },

        {
          title: "排序",
          key: "orderNo"
        },
        {
          index: 4,
          title: "是否显示",
          key: "isShow",
          render: (h, params) => {
            let isShow = params.row.isShow;
            const name = isShow ? "是" : "否";
            return h("div", name);
          }
        },
        {
          index: 5,
          title: "资源类型",
          key: "type",
          render: (h, params) => {
            let type = params.row.type;
            const name = type == 0 ? "菜单" : "普通";
            return h("div", name);
          }
        },
        {
          title: "菜单组件",
          key: "component"
        },

        {
          title: "新建时间",
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
                      this.getPermission(params);
                    }
                  }
                },
                "分配权限"
              )
            ]);
          }
        }
      ],

      /*新增验证*/
      ruleValidate: {
        name: [
          {
            type: "string",
            required: true,
            message: "输入中文资源名称",
            trigger: "blur"
          }
        ],
        identity: [
          {
            type: "string",
            required: true,
            message: "输入英文资源名称",
            trigger: "blur"
          }
        ],
        url: [
          {
            type: "string",
            required: true,
            message: "输入访问路径",
            trigger: "blur"
          }
        ],
        parentId: [
          {
            type: "number",
            required: true,
            message: "输入数字类型的父类ID，没有请填0",
            trigger: "blur"
          }
        ],

        orderNo: [
          {
            type: "number",
            required: true,
            message: "输入数字类型的顺序值,初始值请填1",
            trigger: "blur"
          }
        ],
        component: [
          {
            type: "string",
            required: true,
            message: "输入正确的菜单component，开头不要添加/",
            trigger: "blur"
          }
        ],

        "meta.title": [
          {
            type: "string",
            required: true,
            message: "输入菜单标题",
            trigger: "blur"
          }
        ],
        "meta.icon": [
          {
            type: "string",
            required: true,
            message: "输入菜单图标",
            trigger: "blur"
          }
        ]
      },

      //权限表数据
      permissionNames: null,

      data2: [],
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          index: 1,
          title: "权限名称",
          key: "name"
        },
        {
          index: 2,
          title: "权限描述",
          key: "description"
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
    changeResource(e) {
      this.datas = e;
    },
    changePermission(e) {
      this.datasPermission = e;
    },
    /*菜单类型选择后触发事件*/
    changeComponent(stutas) {
      if (stutas == 0) {
        this.show = true;
      }
      if (stutas == 1) {
        this.show = false;
      }
    },

    //分配权限
    handleSetPermission() {
      if (this.datasPermission.length < 1) {
        this.$Message.warning("请至少选择一个权限");
      } else if (this.permissionNames == null) {
        this.$Message.warning("请填写权限名称");
      } else {
        let ids = [];
        for (var i = 0; i <= this.datasPermission.length - 1; i++) {
          ids.push(this.datasPermission[i].id);
        }
        this.$ajax({
          method: "get",
          url: "/sys/permission/addResourcePermission",
          params: {
            ids: ids.toString(),
            id: this.formItem.id,
            name: this.permissionNames
          }
        })
          .then(res => {
            this.$Message.success(res.data.message);
            this.getTableData({
              pageInfo: this.pageInfo
            });
            this.modalPermission = false;
            this.datasPermission = [];
            this.permissionNames = null;
          })
          .catch(function(response) {
            console.error(response);
          });
      }
    },

    getPermission(params) {
      this.modalPermission = true;
      this.formItem.id = params.row.id;
      this.$ajax({
        method: "get",
        url: "/sys/permission/all",
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

    change(status) {
      this.formItem.isShow = status;
    },

    changeHideInMenu(status) {
      this.formItem.meta.hideInMenu = status;
    },

    changeHideInBread(status) {
      this.formItem.meta.hideInBread = status;
    },

    changeNotCache(status) {
      this.formItem.meta.notCache = status;
    },

    changeBeforeCloseName(status) {
      this.formItem.meta.beforeCloseName = status;
    },

    getOne() {
      if (this.datas.length > 1 || this.datas.length < 1) {
        this.$Message.warning("请至少选择一项(且只能选择一项)");
      } else {
        let id = this.datas[0].id;
        this.modalUser = true;
        this.$ajax({
          method: "get",
          url: "/sys/resource/get/" + id
        })
          .then(res => {
            let date = res.data.data;
            this.formItem.id = date.id;
            this.formItem.name = date.name;
            this.formItem.identity = date.identity;
            this.formItem.url = date.url;
            this.formItem.icon = date.icon;
            this.formItem.isShow = date.isShow;
            this.formItem.parentId = date.parentId;
            this.formItem.component = date.component;
            this.formItem.type = date.type;
            if (this.formItem.type == 0) {
              console.log(this.show);
              this.show = true;
            }
            this.formItem.orderNo = date.orderNo;
            let meta = JSON.parse(date.meta);
            this.formItem.meta.title = meta.title;
            this.formItem.meta.icon = meta.icon;
            this.formItem.meta.hideInMenu = meta.hideInMenu;
            this.formItem.meta.hideInBread = meta.hideInBread;
            this.formItem.meta.notCache = meta.notCache;
            this.formItem.meta.beforeCloseName =
              meta.beforeCloseName == "before_close_normal" ? true : false;
          })
          .catch(function(response) {
            console.error(response);
          });
      }
    },
    cancel() {
      (this.formItem.meta.title = null),
        (this.formItem.meta.icon = null),
        (this.formItem.meta.hideInMenu = false),
        (this.formItem.meta.hideInBread = false),
        (this.formItem.meta.notCache = false),
        (this.formItem.meta.beforeCloseName = false);
      this.$refs.formItem.resetFields();
      this.show = false;
      this.modalPermission = false;
      this.datasPermission = [];
      this.permissionNames = null;
    },

    handleSearch() {
      this.getTableData({
        pageInfo: this.pageInfo
      });
    },

    handleAdd(formItem) {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          formItem.meta.beforeCloseName =
            formItem.meta.beforeCloseName == true
              ? "before_close_normal"
              : false;
          formItem.meta = JSON.stringify(formItem.meta);
          this.$ajax({
            method: "post",
            url: "/sys/resource/add",
            data: formItem
          })
            .then(res => {
              this.$Message.success(res.data.message);
              this.getTableData({
                pageInfo: this.pageInfo
              });
              formItem.meta = JSON.parse(formItem.meta);
              (formItem.meta.title = null),
                (formItem.meta.icon = null),
                (formItem.meta.hideInMenu = false),
                (formItem.meta.hideInBread = false),
                (formItem.meta.notCache = false),
                (formItem.meta.beforeCloseName = false);
              this.$refs.formItem.resetFields();
              this.modalUser = false;
            })
            .catch(function(response) {
              console.error(response);
              setTimeout(() => {
                this.loading = false;
                this.$nextTick(() => {
                  this.loading = true;
                });
              }, 1000);
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
          url: "/sys/resource/delete/" + ids
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
        url: "/sys/resource/pages",
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
