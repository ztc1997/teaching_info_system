<template>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>用户登录</v-toolbar-title>
                </v-toolbar>

                <v-alert
                        :value="alert"
                        type="error"
                >
                    {{alert}}
                </v-alert>

                <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field prepend-icon="person" name="username" label="用户名" type="text"
                                      v-model="form.username" :rules="rules.username"></v-text-field>
                        <v-text-field id="password" prepend-icon="lock" name="password" label="密码"
                                      type="password" v-model="form.password" :rules="rules.password"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit" :loading="loading" :disabled="loading">登录
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
  import axios from 'axios'
  import {LOAD_USER} from '@/store/action-types'
  import {SET_CSRF_TOKEN} from '@/store/mutation-types'

  export default {
    name: 'Login',
    data: () => ({
      valid: true,

      form: {
        username: '',
        password: '',
      },

      rules: {
        username: [
          v => !!v || '请输入用户名',
          v => (v && v.length <= 20) || '用户名不能超过20个字符'
        ],
        password: [
          v => !!v || '请输入密码',
          v => (v && v.length >= 8) || '密码必须大于8个字符'
        ],
      },

      loading: false,
      alert: ''
    }),
    methods: {
      submit() {
        if (this.$refs.form.validate()) {
          axios.post('/login', this.form).then((response) => {
            if (response.data.ok) {
              this.$store.commit(SET_CSRF_TOKEN, response.data.data.CSRFToken)

              this.$store.dispatch(LOAD_USER).then(() => {
                const redirect = this.$route.query.hasOwnProperty('redirect') ?
                  this.$route.query.redirect : '/'

                this.$router.push(redirect)
                this.loading = false
              }).catch((error) => {
                this.alert = error.message
                this.loading = false
              })
            } else {
              this.alert = response.data.err
              this.loading = false
            }
          }).catch((error) => {
            this.alert = error.message
            this.loading = false
          })

          this.loading = true
        }
      },
    }
  }
</script>

<style scoped>

</style>
