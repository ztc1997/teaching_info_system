<template>
    <div class="hello">
        <v-card>
            <v-card-title>
                <h2>用户管理</h2>
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="搜索"
                        single-line
                        hide-details
                ></v-text-field>
                <v-dialog v-model="dialog" max-width="500px">
                    <v-btn slot="activator" color="primary" dark class="mb-2">新建用户</v-btn>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
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
                                    <v-layout wrap>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="editedItem.id"
                                                          label="用户 ID"
                                                          disabled></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="editedItem.username"
                                                          label="用户名"
                                                          :rules="itemRules.username"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="editedItem.password"
                                                          label="密码"
                                                          type="password"
                                                          :rules="itemRules.password"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-select v-model="editedItem.userTypeEntry"
                                                      :items="userTypeEntries"
                                                      label="用户类型"
                                                      :rules="itemRules.fundsTotal"
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close" :disable="loading">取消</v-btn>
                            <v-btn color="blue darken-1" flat @click="save" :loading="loading" :disable="loading">保存
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="userEntries"
                    :search="search"
                    class="elevation-1"
                    rows-per-page-text="每页行数"
            >
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.username }}</td>
                    <td>{{ props.item.userTypeEntry }}</td>
                    <td>
                        <!--<v-icon
                                small
                                class="mr-2"
                                @click="editItem(props.item)"
                        >
                            edit
                        </v-icon>-->
                        <v-icon
                                small
                                @click="deleteItem(props.item)"
                        >
                            delete
                        </v-icon>
                    </td>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'UserManagement',
    data: () => ({
      valid: true,
      menu: false,
      dialog: false,
      loading: false,
      alert: '',
      search: '',
      headers: [
        {text: '用户 ID', value: 'id'},
        {text: '用户名', value: 'username'},
        {text: '用户类型', value: 'userTypeEntry'},
        {text: '操作', value: 'action'}
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        username: '',
        password: '',
        id: '',
        userTypeEntry: ''
      },
      defaultItem: {
        username: '',
        password: '',
        id: '',
        userTypeEntry: ''
      },
      itemRules: {
        username: [
          v => !!v || '请输入用户名',
          v => (v && v.length <= 20) || '用户名不能超过20个字符'
        ],
        password: [
          v => !!v || '请输入密码',
          v => (v && v.length >= 8) || '密码必须大于8个字符'
        ],
        userTypeEntry: [
          v => !!v || '请输入用户类型'
        ]
      },
      userTypeEntries: ['学生', '教师', '管理员']
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? '新建课题' : '编辑课题'
      },

      userEntries() {
        const val = []
        for (const i of this.users) {
          const item = {
            id: i.id,
            username: i.username,
            userTypeEntry: this.userTypeEntries[i.userType]
          }
          val.push(item)
        }
        return val
      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      },
    },

    methods: {
      editItem(item) {
        this.editedIndex = this.userEntries.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        const index = this.userEntries.indexOf(item)
        axios.delete('/user/' + item.id).then((response) => {
          if (response.data.ok) {
            this.users.splice(index, 1)
          }
        })

      },

      close() {
        this.dialog = false
        setTimeout(() => {
          this.alert = ''
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.$refs.form.reset()
        }, 300)
      },

      save() {
        if (this.$refs.form.validate()) {
          if (this.editedIndex > -1) {
            this.update()
          } else {
            this.create()
          }
        }
      },

      create() {
        this.loading = true
        axios.post('/user', this.userEntryToValue(this.editedItem)).then((response) => {
          if (response.data.ok) {
            this.users.push(response.data.data)
          } else {
            this.alert = response.data.err
          }
          this.loading = false
          this.close()
        }).catch((error) => {
          this.alert = error.message
          this.loading = false
        })
      },

      update() {
        this.loading = true
        axios.put('/user', this.editedItem).then((response) => {
          if (response.data.ok) {
            Object.assign(this.users[this.editedIndex], response.data.data)
          } else {
            this.alert = response.data.err
          }
          this.loading = false
          this.close()
        }).catch((error) => {
          this.alert = error.message
          this.loading = false
        })
      },

      userEntryToValue(entry) {
        return {
          id: entry.id,
          username: entry.username,
          password: entry.password,
          userType: this.userTypeEntries.indexOf(entry.userTypeEntry)
        }
      }
    },

    created() {
      axios.get('/users').then((response) => {
        if (response.data.ok) {
          this.users = response.data.data
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
</script>

<style scoped>
</style>
