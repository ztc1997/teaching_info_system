<template>
    <v-app id="inspire">
        <v-navigation-drawer
                v-model="drawer"
                clipped
                fixed
                app
        >
            <v-list dense>
                <v-list-tile to="/projectManagement">
                    <v-list-tile-action>
                        <v-icon>info</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>课题管理</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/userManagement" v-if="this.$store.state.user.userType === 2">
                    <v-list-tile-action>
                        <v-icon>account_circle</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>用户管理</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app fixed clipped-left dark color="primary" v-show="showToolBar">
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>教学信息管理系统</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y>
                <v-btn icon large slot="activator">
                    <v-avatar size="32px">
                        <img
                                src="/favicon.ico"
                                :alt="this.$store.state.user.username"
                        >
                    </v-avatar>
                </v-btn>
                <v-list>

                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="/favicon.ico"
                                 :alt="this.$store.state.user.username">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>{{this.$store.state.user.username}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{['学生', '教师', '管理员'][this.$store.state.user.userType]}}
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-dialog v-model="dialog" max-width="500px">
                        <v-list-tile slot="activator">
                            <v-list-tile-title>修改密码</v-list-tile-title>
                        </v-list-tile>
                        <v-card>
                            <v-card-title>
                                <span class="headline">修改密码</span>
                            </v-card-title>
                            <v-alert
                                    :value="alert"
                                    type="error"
                            >
                                {{alert}}
                            </v-alert>
                            <v-card-text>
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-container grid-list-md>
                                        <v-text-field v-model="dialogItem.form.currentPassword"
                                                      label="当前密码"
                                                      type="password"
                                                      :rules="rules.currentPassword"
                                                      autocomplete="current-password"></v-text-field>

                                        <v-text-field v-model="dialogItem.form.newPassword"
                                                      label="新密码"
                                                      type="password"
                                                      :rules="rules.newPassword"
                                                      autocomplete="new-password"></v-text-field>

                                        <v-text-field v-model="dialogItem.confirmPassword"
                                                      label="确认密码"
                                                      type="password"
                                                      :rules="rules.confirmPassword"
                                                      autocomplete="new-password"></v-text-field>

                                    </v-container>
                                </v-form>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="close" :disable="loading">取消</v-btn>
                                <v-btn color="blue darken-1" flat @click="setPassword" :loading="loading"
                                       :disable="loading">保存
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-list-tile @click="logout">
                        <v-list-tile-title>退出登录</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>
        <v-content>
            <v-container fluid>
                <transition name="fade" mode="out-in">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </v-container>
        </v-content>
        <v-footer app>
            <v-layout align-center justify-center>
                教学信息管理系统 &copy; 2018 Alex Zhang aka. ztc1997. Licensed under Apache License 2.0.&nbsp;
                <a href="https://github.com/ztc1997/gxmu_teaching_monitor_spawner"
                   target="_blank"
                   rel="noopener noreferrer">Source</a>
            </v-layout>
        </v-footer>
    </v-app>
</template>

<script>
  import axios from 'axios'
  import {CLEAR_USER} from '@/store/mutation-types'

  export default {
    name: 'App',
    data() {
      return {
        valid: true,
        menu: false,
        dialog: false,
        loading: false,
        alert: '',
        drawer: null,
        lastDrawer: null,
        dialogItem: {
          form: {
            currentPassword: '',
            newPassword: '',
          },
          confirmPassword: '',
        },
        defaultItem: {
          form: {
            currentPassword: '',
            newPassword: '',
          },
          confirmPassword: '',
        },
        rules: {
          currentPassword: [
            v => !!v || '请输入旧密码',
            v => (v && v.length >= 8) || '旧密码必须大于8个字符'
          ],
          newPassword: [
            v => !!v || '请输入新密码',
            v => (v && v.length >= 8) || '新密码必须大于8个字符'
          ],
          confirmPassword: [
            v => v === this.dialogItem.form.newPassword || '请重复新密码'
          ],
        }
      }
    },
    methods: {
      controlDrawer() {
        if (this.showToolBar) {
          if (window.innerWidth > 960)
            this.drawer = this.lastDrawer
        } else {
          this.lastDrawer = this.drawer
          this.drawer = false
        }
      },
      onResize() {
        if (!this.showToolBar) {
          this.drawer = false
        }
      },
      logout() {
        // 一定要在请求结束后清除状态，否则无法进行 CSRF 效验
        axios.post('/logout').then(() => {
          this.$store.commit(CLEAR_USER)
          this.$router.push('/login')
        }).catch(() => {
          this.$store.commit(CLEAR_USER)
          this.$router.push('/login')
        })
      },

      close() {
        this.dialog = false
        setTimeout(() => {
          this.alert = ''
          this.dialogItem = Object.assign({}, this.defaultItem)
          this.$refs.form.reset()
        }, 300)
      },

      setPassword() {
        if (this.$refs.form.validate()) {
          axios.post('setPassword', this.dialogItem.form).then((response) => {
            if (response.data.ok) {
              this.$store.commit(CLEAR_USER)
              this.$router.push('/login')
              this.dialog = false
              this.close()
            } else {
              this.alert = response.data.err
              this.dialog = false
            }
          }).catch((error) => {
            this.alert = error.message
            this.loading = false
          })
        }
      },
    },
    watch: {
      showToolBar() {
        this.controlDrawer()
      }
    },
    computed: {
      showToolBar() {
        return ['login', '404'].indexOf(this.$route.name) < 0
      },
    },
    created() {
      this.controlDrawer()
    },
    mounted() {
      window.addEventListener('resize', this.onResize, {passive: true})
    },
    beforeDestroy() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, {passive: true})
      }
    }
  }
</script>

<style>
    .fade-enter-active,
    .fade-leave-active {
        transition-duration: 250ms;
        transition-property: opacity;
        transition-timing-function: ease;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0
    }
</style>
