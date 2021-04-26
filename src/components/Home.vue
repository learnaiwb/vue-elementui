<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>后台管理</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo, border-rm"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
          :collapse='isCollapse'
          :collapse-transition = 'false'
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="(item,index) in menuList" :key="item.id"  :index="item.id + '' ">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class='menuIcon[index]'></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import storage from '../net/myUtils/storage'
export default {
  data() {
    return {
      menuList: [],
      menuIcon: ['el-icon-user', 'el-icon-goods', 'el-icon-eleme', 'el-icon-s-order', 'el-icon-s-data'],
      isCollapse: false
    }
  },
  methods: {
    logout() {
      storage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const res = await this.$http.get('menu')
      console.log(res)
      this.menuList = res.data
    },
    // 菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  created() {
    this.getMenuList()
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  font-size: 15px;
  color: white;
  div {
    height: 100%;
    display: flex;
    align-items: center;
    img {
      height: 100%;
      border-radius: 50%;
      border: 1px solid #bfa;
    }
    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #2a2e3b;
  border-right: none;
  .border-rm {
    border-right: none;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: white;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}

.el-main {
  background-color: #fff;
}
</style>
