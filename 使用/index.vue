<template>
  <div class="container">
    <el-card class="box-card">
      <!--标题-->
      <div slot="header" class="box-header">
        <span>用户管理</span>
      </div>
      <!--body-->
      <div class="box-body">
        <!--存放按钮，操作-->
        <div style="margin-bottom:20px">
          <span>用户信息选择:</span>
          <el-select v-model="info" style="width:130px">
            <el-option
              v-for="item in options"
              :key="item.info"
              :label="item.label"
              :value="item.info"
            ></el-option>
          </el-select>

          <el-button
            type="primary"
            size="small"
            @click="handleAdd"
            v-if=" info === 'personal'"
            style="margin-left:20px"
          >导出用户个人信息</el-button>

          <el-button
            type="primary"
            size="small"
            @click="hanapply"
            v-else
            style="margin-left:20px"
          >导出用户报名信息</el-button>
          <el-button
            type="success"
            size="small"
            @click="detailed"
            style="margin-left:20px"
          >导出用户推广详细记录表</el-button>
          <el-button
            type="warning"
            size="small"
            @click="statistical"
            style="margin-left:20px"
          >导出用户推广统计表</el-button>
        </div>

        <!--展示个人信息-->
        <template v-if=" info === 'personal'">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
            <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
            <el-table-column prop="idNumber" label="身份证号" align="center"></el-table-column>
            <el-table-column prop="myCode" label="推广码" align="center"></el-table-column>
            <el-table-column prop="recommender" label="推广人" align="center"></el-table-column>
            <el-table-column prop="registerTime" label="注册时间" align="center"></el-table-column>
            <!--用户类型-->
            <el-table-column label="用户类型" align="center">
              <template slot-scope="{row}">
                <el-tag
                  :type="row.userType | filterUserTypeTag"
                >{{ row.userType | filterUserTypeText}}</el-tag>
              </template>
            </el-table-column>
            <!--用户状态-->
            <el-table-column label="用户状态" align="center">
              <template slot-scope="{row}">
                <el-tag :type="row.state | filterUserStateTag">{{ row.state | filterUserStateText}}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="details" label="操作" align="center">
              <template slot-scope="{row}">
                <el-button
                  size="mini"
                  type="warning"
                  :disabled="row.userType ===3"
                  @click="initPwd(row)"
                >修改用户类型</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!--&lt;!&ndash;展示用户报名信息&ndash;&gt;-->
        <template v-if=" info === 'apply'">
          <el-table :data="tableDataliset" border style="width: 100%">
            <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
            <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
            <el-table-column prop="idNumber" label="身份证号" align="center"></el-table-column>
            <el-table-column prop="courseName" label="开班计划名称" align="center"></el-table-column>
            <el-table-column prop="createTime" label="报名时间" align="center"></el-table-column>
            <el-table-column prop="orederNumber" label="订单号" align="center"></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态" align="center">
              <template slot-scope="{row}">
                <el-tag
                  :type="row.orderStatus | filteruserIGNTag"
                >{{ row.orderStatus | filteruserIGNText}}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!--用户个人信息分页-->
      <div class="box-footer" v-if=" info === 'personal'">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="_getUserList"
        />
      </div>
      <!--用户报名信息分页-->
      <div class="box-footer" v-else>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listIgm.pageNum"
          :limit.sync="listIgm.pageSize"
          @pagination="_uSErIGN"
        />
      </div>
    </el-card>

    <Download ref="download" :url="'/userexcel'" /><!--导出个人信息-->
    <Download ref="usersignexcel" :url="'/usersignexcel'" /><!--导出用户报名-->
    <Download ref="promotionin" :url="'/promotioninfoexcel'" /><!--用户推广详细记录表-->
    <Download ref="tatistics" :url="'/promotionexcel'" /><!--用户推广统计记录表-->
  </div>
</template>

<script>
import api from "@/api";
import msgUtil from "@/utils/msgUtil";
import { DEFAULT_ERR_MSG, ERR_OK } from "@/config";
import Pagination from "@/components/Pagination";
import boxUtil from "@/utils/boxUtil";
import Download from "../../components/DownLoad";

export default {
  name: "user",
  data() {
    return {
      tableData: [], //用户个人信息
      tableDataliset: [], //用户报名信息
      total: 0, //总页数
      //个人分页处理
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      //报名分页处理
      listIgm: {
        pageNum: 1,
        pageSize: 10
      },
      options: [
        {
          info: "personal",
          label: "用户个人信息"
        },
        {
          info: "apply",
          label: "用户报名信息"
        }
      ],
      info: "personal"
    };
  },
  //js处理请求
  methods: {
    //用户个人的展示列表
    async _getUserList() {
      try {
        let { code, data, msg } = await api.userApi.getUserList({
          ...this.listQuery
        });
        if (code === ERR_OK) {
          this.tableData = data.list;
          this.total = data.total;
        }
      } catch (error) {
        msgUtil._error(DEFAULT_ERR_MSG);
      }
    },
    //用户报名信息展示
    async _uSErIGN() {
      try {
        let { code, data, msg } = await api.userApi.userIGN({
          ...this.listIgm
        });
        if (code === ERR_OK) {
          this.tableDataliset = data.list;
          this.total = data.total;
        }
      } catch (error) {
        msgUtil._error(DEFAULT_ERR_MSG);
      }
    },
    //用户个人信息导出请求
    async _expoRT() {
      try {
        this.$refs.download.download()
      } catch (error) {
        msgUtil._error(DEFAULT_ERR_MSG);
      }
    },
    //导出用户个人信息按钮
    handleAdd() {
      this._expoRT();
    },

    //用户报名信息导出请求
    async _signexcel() {
      try {
        this.$refs.usersignexcel.download()
      } catch (error) {
        msgUtil._error(DEFAULT_ERR_MSG);
      }
    },

    //用户报名信息导出按钮
    hanapply() {
      this._signexcel();
    },

    //导出用户推广详细记录表请求
    async _infoexcel() {
      try{
        this.$refs.promotionin.download()
      } catch (error) {
        msgUtil._error(DEFAULT_ERR_MSG);
      }
    },
    //导出用户推广详细记录表按钮
    detailed() {
      this._infoexcel();
    },

    //导出用户推广统计表请求
    async _onexcel() {
      try {
        this.$refs.tatistics.download()
      } catch (error) {
        msgUtil._error(DEFAULT_ERR_MSG);
      }
    },
    //导出用户推广统计表按钮
    statistical() {
      this._onexcel();
    },

    // 修改类型请求
    async _types(userName, id) {
      try {
        let { code, data, msg } = await api.userApi.usertypes({
          userName: userName,
          id: id
        });
        if (code === ERR_OK) {
          msgUtil._success(`修改${userName}用户类型成功`);
          this._getUserList();
        }
      } catch (error) {
        msgUtil._error(DEFAULT_ERR_MSG);
      }
    },
    //修改类型按钮
    initPwd(row) {
      const { accountNumber: account } = row;
      boxUtil
        ._confirm("此操作将修改用户的类型，是否继续")
        .then(() => {
          let userName = row.userName;
          let id = row.id;
          this._types(userName, id);
        })
        .catch(() => {});
    }
  },
  //渲染函数
  mounted() {
    this._getUserList();
    this._uSErIGN();
  },
  //引入组件
  components: {
    Pagination,
    Download
  },
  //过滤器
  filters: {
    //用户状态的栏颜色
    filterUserStateTag(v) {
      let map = {
        1: "success",
        2: "danger",
        0: "info"
      };
      return map[v];
    },
    //用户的状态
    filterUserStateText(v) {
      let map = {
        1: "正常",
        2: "禁用",
        0: "注销"
      };
      return map[v];
    },

    //用户类型的颜色
    filterUserTypeTag(v) {
      let map = {
        1: "warning",
        2: "success",
        3: ""
      };
      return map[v];
    },
    //用户类型的分类
    filterUserTypeText(v) {
      let map = {
        1: "注册用户",
        2: "普通用户",
        3: "船公司用户"
      };
      return map[v];
    },

    //订单状态颜色
    filteruserIGNTag(v) {
      let map = {
        1: "primary",
        2: "success",
        3: "warning",
        4: "danger"
      };
      return map[v];
    },

    //订单状态类型
    filteruserIGNText(v) {
      let map = {
        1: "待支付",
        2: "已支付",
        3: "取消订单",
        4: "超时取消"
      };
      return map[v];
    }
  }
};
</script>
