<template>
  <div>
    <!-- 过滤组件 -->
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in searchColumns" :value="item.key" :key="item.index">{{ item.title }}</Option>
      </Select>
      <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" type="primary" shape="circle" icon="ios-search"></Button>
      <Button
        @click="modalUser = true"
        icon="ios-add-circle-outline"
        shape="circle"
        type="info"
        v-if="show"
      >新增</Button>
      <Button @click="getOne()" type="success" shape="circle" icon="ios-build">修改</Button>
      <Button @click="handleDelete()" type="error" shape="circle" icon="ios-trash">删除</Button>
    </div>

    <Tabs v-model="tabsName" @on-click="clickTabs()" :animated="false">
      <TabPane label="资源权限列表" icon="logo-apple" name="tabsPermissionResource">
        <Table
          :data="tableData2"
          :columns="tableColumns2"
          @on-selection-change="s=>{changePermissionResource(s)}"
        ></Table>
      </TabPane>
      <TabPane label="权限列表" icon="logo-windows" name="tabsPermission">
        <Table
          :data="tableData"
          :columns="tableColumns"
          @on-selection-change="s=>{changePermission(s)}"
        ></Table>
      </TabPane>
    </Tabs>

    <Modal v-model="modalUser" title="权限信息" @on-ok="handleAdd(formItem)" @on-cancel="cancel">
      <Form ref="formItem" :model="formItem" :label-width="80">
        <Form-item hidden prop="id"></Form-item>
        <Form-item label="权限名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="权限标识" prop="permissionName">
          <Input v-model="formItem.permissionName" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="详细描述" prop="description">
          <Input v-model="formItem.description" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="是否显示" prop="show">
          <i-switch v-model="formItem.show" @on-change="change">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </Form-item>
      </Form>
    </Modal>

    <Modal
      v-model="modalPermissionResource"
      title="资源权限信息"
      @on-ok="handlePermissionResource(formItem2)"
      @on-cancel="cancel"
    >
      <Form ref="formItem2" :model="formItem2" :label-width="90">
        <Form-item hidden prop="id"></Form-item>
        <Form-item label="资源权限名称" prop="name">
          <Input v-model="formItem2.name" placeholder="请输入" readonly></Input>
        </Form-item>
        <Form-item label="角色名称" prop="roleName">
          <Input v-model="formItem2.roleName" placeholder="请输入" readonly></Input>
        </Form-item>
        <Form-item label="资源id" prop="resourceId">
          <Input v-model="formItem2.resourceId" placeholder="请输入" readonly></Input>
        </Form-item>
        <Form-item label="权限名称" prop="permissionIds">
          <CheckboxGroup v-model="checkedArr">
            <checkbox v-for="item in optionArr" :label="item.id" :key="item.id">{{item.name}}</checkbox>
          </CheckboxGroup>
        </Form-item>
      </Form>
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
      //是否隐藏新增按钮
      show: false,
      //选择激活的tabs
      tabsName: "tabsPermissionResource",
      //新增权限modal
      modalUser: false,
      //新增资源权限modal
      modalPermissionResource: false,
      datas: [],
      datasPermissionResource: [],
      formItem: {
        /*选择的数据*/
        id: null,
        name: null,
        permissionName: null,
        show: true,
        description: null
      },

      /*pageInfo实体*/
      pageInfo: {
        total: 0,
        page: 0,
        pageSize: 10
      },

      //权限表数据
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
          title: "权限名称",
          key: "name"
        },
        {
          index: 3,
          title: "权限标识",
          key: "permissionName"
        },
        {
          index: 4,
          title: "是否显示",
          key: "show",
          render: (h, params) => {
            let show = params.row.show;
            const name = show ? "是" : "否";
            return h("div", name);
          }
        },
        {
          title: "详细描述",
          key: "description"
        },

        {
          title: "注册时间",
          key: "createdAt"
        }
      ],

      ////资源权限表中的权限名称
      optionArr: [],
      checkedArr: [],

      formItem2: {
        /*选择的数据*/
        id: null,
        name: null,
        roleName: null,
        permissionIds: null,
        resourceId: null,
        resourceName: null
      },

      //资源权限表数据
      tableData2: [],
      //表显示字段
      tableColumns2: [
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
          title: "资源权限名称",
          key: "name"
        },
        {
          index: 3,
          title: "角色名称",
          key: "roleName",
          render(h, params) {
            let roleName = params.row.role.name;
            return h("div", roleName);
          }
        },
        {
          index: 4,
          title: "权限",
          key: "permissionNames"
        },
         {
          index: 5,
          title: "资源id",
          key: "resourceId"
        },
        {
          index: 6,
          title: "资源名称",
          key: "resourceName"
        },

        {
          title: "新建时间",
          key: "createdAt"
        }
      ],

      //过滤属性
      searchKey: "",
      searchValue: "",
      searchColumns: []
    };
  },
  methods: {
    //tabs选择后触发事件
    clickTabs() {
      if (this.tabsName == "tabsPermission") {
        this.show = true;
        this.searchColumns = this.tableColumns.filter(
          item => item.index != null
        );
        this.getTableData({ pageInfo: [] });
      }

      if (this.tabsName == "tabsPermissionResource") {
        this.show = false;
        this.searchColumns = this.tableColumns2.filter(
          item => item.index != null
        );
        this.getTableData2({ pageInfo: [] });
      }
    },

    //table选择后触发事件
    //权限选择
    changePermission(e) {
      this.datas = e;
    },
    //权限资源选择
    changePermissionResource(e) {
      this.optionArr = [];
      this.checkedArr = [];
      this.datasPermissionResource = e;
    },

    change(status) {
      this.formItem.Show = status;
    },

    handlePermissionResource() {
      if (this.checkedArr.length < 1) {
        this.$Message.warning("请至少选择一个权限");
      } else {
        let ids = this.checkedArr;
        this.$ajax({
          method: "get",
          url: "/sys/permission/updateResourcePermission",
          params: {
            ids: ids.toString(),
            id: this.formItem2.id
          }
        })
          .then(res => {
            this.$Message.success(res.data.message);
            this.getTableData2({
              pageInfo: this.pageInfo
            });
          })
          .catch(function(response) {
            console.error(response);
          });
      }
    },

    getOne() {
      if (this.tabsName == "tabsPermission") {
        if (this.datas.length > 1 || this.datas.length < 1) {
          this.$Message.warning("请至少选择一项(且只能选择一项)");
        } else {
          let id = this.datas[0].id;
          this.modalUser = true;
          this.$ajax({
            method: "get",
            url: "/sys/permission/get/" + id
          })
            .then(res => {
              let data = res.data.data;
              this.formItem.id = data.id;
              this.formItem.name = data.name;
              this.formItem.permissionName = data.permissionName;
              this.formItem.description = data.description;
              this.formItem.show = data.show;
            })
            .catch(function(response) {
              console.error(response);
            });
        }
      }
      if (this.tabsName == "tabsPermissionResource") {
        this.optionArr = [];
        this.checkedArr = [];
        if (
          this.datasPermissionResource.length > 1 ||
          this.datasPermissionResource.length < 1
        ) {
          this.$Message.warning("请至少选择一项(且只能选择一项)");
        } else {
          let id = this.datasPermissionResource[0].id;
          this.modalPermissionResource = true;
          this.$ajax({
            method: "get",
            url: "/sys/permission/allPermission"
          })
            .then(res => {
              let data = res.data.data;
              this.optionArr = data;
              this.$ajax({
                method: "get",
                url: "/sys/permission/getResourcePermission/" + id
              })
                .then(res => {
                  let data = res.data.data;
                  this.formItem2.id = data.id;
                  this.formItem2.name = data.name;
                  this.formItem2.roleName = data.role.name;
                  this.checkedArr = data.permissionIds;
                  this.formItem2.resourceId = data.resourceId;
                })
                .catch(function(response) {
                  console.error(response);
                });
            })
            .catch(function(response) {
              console.error(response);
            });
        }
      }
    },

    cancel() {
      this.$refs.formItem2.resetFields();
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
        url: "/sys/permission/add",
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
      if (this.tabsName == "tabsPermission") {
        if (this.datas.length < 1) {
          this.$Message.warning("请至少选择一项");
        } else {
          let ids = [];
          for (var i = 0; i <= this.datas.length - 1; i++) {
            ids.push(this.datas[i].id);
          }
          this.$ajax({
            method: "delete",
            url: "/sys/permission/delete/" + ids
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
      }

      if (this.tabsName == "tabsPermissionResource") {
        if (this.datasPermissionResource.length < 1) {
          this.$Message.warning("请至少选择一项");
        } else {
          let ids = [];
          for (var i = 0; i <= this.datasPermissionResource.length - 1; i++) {
            ids.push(this.datasPermissionResource[i].id);
          }
          this.$ajax({
            method: "delete",
            url: "/sys/permission/deleteResourcePermission/" + ids
          })
            .then(res => {
              this.$Message.success(res.data.message);
              this.getTableData2({
                pageInfo: this.pageInfo
              });
            })
            .catch(function(response) {
              console.error(response);
            });
        }
      }
    },

    getTableData(e) {
      this.$ajax({
        method: "get",
        url: "/sys/permission/pages",
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

    getTableData2(e) {
      this.$ajax({
        method: "get",
        url: "/sys/permission/permissionPages",
        params: {
          page: e.pageInfo.page,
          pageSize: e.pageInfo.pageSize,
          [this.searchKey]: this.searchValue
        }
      })
        .then(res => {
          this.tableData2 = res.data.data.rows;
          this.pageInfo.total = res.data.data.total;
        })
        .catch(function(response) {
          console.error(response);
        });
    },

    /*分页点击事件*/
    pageSearch(e) {
      if (this.tabsName == "tabsPermission") {
      this.pageInfo.page = e - 1;
        this.getTableData({
          pageInfo: this.pageInfo
        });
      }
      if (this.tabsName == "tabsPermissionResource") {
        this.pageInfo.page = e - 1;
        this.getTableData2({
          pageInfo: this.pageInfo
        });
      }
    }
  },

  mounted() {
    this.searchColumns = this.tableColumns2.filter(item => item.index != null);
    this.getTableData2({
      pageInfo: this.pageInfo
    });
  }
};
</script>
