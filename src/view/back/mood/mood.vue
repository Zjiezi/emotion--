<template>
  <div>
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in searchColumns" :value="item.key" :key="item.index">{{ item.title }}</Option>
      </Select>
      <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary">
        <Icon type="search"/>&nbsp;&nbsp;搜索
      </Button>
    </div>

    <Table :data="tableData" :columns="tableColumns" @on-delete="handleDelete"></Table>
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
          width: 30,
          align: "center"
        },
        {
          index: 1,
          title: "id",
          key: "id",
          sortable: true
        },
        {
          index: 2,
          title: "用户姓名",
          key: "username",
          render(h, params) {
            let name = params.row.user.username;
            return h("div", name);
          }
        },
        {
          index: 3,
          title: "心情类型",
          key: "type",
          render: (h, params) => {
            let type = params.row.type;
            const color = type == 1 ? "blue" : type == 2 ? "green" : "red";
            const text = type == 1 ? "悲伤" : type == 2 ? "开心" : "愤怒";
            return h(
              "Tag",
              {
                props: {
                  type: "border",
                  color: color
                }
              },
              text
            );
          }
        },
        {
          index: 4,
          title: "心情标题",
          key: "title"
        },
        {
          title: "创建时间",
          key: "createdAt"
        },
        {
          title: "更新时间",
          key: "updatedAt"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                props: {
                  size: "small",
                  icon: "ios-search"
                },
                style: {
                  marginRight: "3px"
                },
                on: {
                  click: () => {
                    this.show(params);
                  }
                }
              }),
              h("Button", {
                props: {
                  size: "small",
                  icon: "ios-trash"
                },
                style: {
                  marginRight: "3px"
                },
                on: {
                  click: () => {
                    this.handleDelete(params);
                  }
                }
              })
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
    handleSearch() {
      this.getTableData({
        pageInfo: this.pageInfo
      });
    },

    handleDelete(params) {
      let id = params.row.id;
      this.$ajax({
        method: "delete",
        url: "/business/mood/delete/" + id
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
    },

    getTableData(e) {
      this.$ajax({
        method: "get",
        url: "/business/mood/pages",
        params: {
          page: e.pageInfo.page,
          pageSize: e.pageInfo.pageSize,
          [this.searchKey]: this.searchValue
        }
      })
        .then(res => {
          this.tableData = res.data.data.rows;
          this.pageInfo.otal = res.data.data.total;
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
