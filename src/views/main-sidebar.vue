<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'home'"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu">
        <el-menu-item index="home" @click="$router.push({ name: 'home' })">
          <icon name="shouye"  :scale="2" class="site-sidebar__menu-icon"></icon>
          <span slot="title">首页</span>
        </el-menu-item>
        <!--<el-menu-item index="test" @click="$router.push({ name: 'test' })">-->
          <!--<icon name="menu" :scale="2" class="site-sidebar__menu-icon"></icon>-->
          <!--<span slot="title">测试</span>-->
        <!--</el-menu-item>-->
        <!--<el-menu-item index="testprint" @click="$router.push({ name: 'testprint' })">-->
          <!--<icon name="menu" :scale="2" class="site-sidebar__menu-icon"></icon>-->
          <!--<span slot="title">测试打印</span>-->
        <!--</el-menu-item>-->
        <!--<el-menu-item index="testue" @click="$router.push({ name: 'testue' })">-->
          <!--<icon name="menu" :scale="2" class="site-sidebar__menu-icon"></icon>-->
          <!--<span slot="title">测试UEditor</span>-->
        <!--</el-menu-item>-->
       <!-- <el-menu-item index="demo-01" @click="$router.push({ name: 'demo-01' })">
          <icon name="mudedi" :scale="2" class="site-sidebar__menu-icon"></icon>
          <span slot="title">demo-01</span>
        </el-menu-item>
        <el-menu-item index="test" @click="$router.push({ name: 'test1' })">
          <icon name="mudedi" :scale="2" class="site-sidebar__menu-icon"></icon>
          <span slot="title">测试</span>
        </el-menu-item>-->
     <!--   <el-menu-item index="demo-echarts" @click="$router.push({ name: 'demo-echarts' })">
          <icon name="mudedi" :scale="2" class="site-sidebar__menu-icon"></icon>
          <span slot="title">echarts</span>
        </el-menu-item>-->
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
import { isURL } from '@/utils/validate'
export default {
  data () {
    return {
      dynamicMenuRoutes: []
    }
  },
  components: {
    SubMenu
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    },
    menuList: {
      get () { return this.$store.state.common.menuList },
      set (val) { this.$store.commit('common/updateMenuList', val) }
    },
    menuActiveName: {
      get () { return this.$store.state.common.menuActiveName },
      set (val) { this.$store.commit('common/updateMenuActiveName', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    }
  },
  watch: {
    $route: 'routeHandle'
  },
  created () {
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
    this.routeHandle(this.$route)
  },
  methods: {
    // 路由操作
    routeHandle (route) {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        var tab = this.mainTabs.filter(item => item.name === route.name)[0]
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
            if (!route) {
              return console.error('未能找到可用标签页!')
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            title: route.meta.title,
            type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
            iframeUrl: route.meta.iframeUrl || ''
          }
          this.mainTabs = this.mainTabs.concat(tab)
        }
        this.menuActiveName = tab.menuId + ''
        this.mainTabsActiveName = tab.name
      }
    }
  }
}
</script>
