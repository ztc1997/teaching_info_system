<template>
    <div class="hello">
        <v-card>
            <v-card-title>
                <h2>课题管理</h2>
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="搜索"
                        single-line
                        hide-details
                ></v-text-field>
                <v-dialog v-model="dialog" max-width="500px">
                    <v-btn slot="activator" color="primary" dark class="mb-2">新建课题</v-btn>
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
                                                          label="课题编号/ID"
                                                          disabled></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="editedItem.name"
                                                          label="课题名称"
                                                          :rules="itemRules.name"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="editedItem.principal"
                                                          label="课题负责人"
                                                          :rules="itemRules.principal"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="editedItem.fundsTotal"
                                                          label="资金"
                                                          type="number"
                                                          prefix="¥"
                                                          :rules="itemRules.fundsTotal"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="editedItem.fundsUsed"
                                                          label="已使用资金"
                                                          type="number"
                                                          prefix="¥"
                                                          :rules="itemRules.fundsUsed"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-menu
                                                    ref="menu"
                                                    :close-on-content-click="false"
                                                    v-model="menu"
                                                    :nudge-right="40"
                                                    :return-value.sync="editedItem.deadline"
                                                    lazy
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    min-width="290px"
                                            >
                                                <v-text-field
                                                        slot="activator"
                                                        v-model="editedItem.deadline"
                                                        label="截止日期"
                                                        prepend-icon="event"
                                                        readonly
                                                        :rules="itemRules.deadline"
                                                ></v-text-field>
                                                <v-date-picker v-model="editedItem.deadline" no-title scrollable>
                                                    <v-spacer></v-spacer>
                                                    <v-btn flat color="primary"
                                                           @click="menu = false">Cancel
                                                    </v-btn>
                                                    <v-btn flat color="primary"
                                                           @click="$refs.menu.save(editedItem.deadline)">OK
                                                    </v-btn>
                                                </v-date-picker>
                                            </v-menu>
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
                    :items="projects"
                    :search="search"
                    class="elevation-1"
                    rows-per-page-text="每页行数"
            >
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.principal }}</td>
                    <td>{{ props.item.fundsTotal }}</td>
                    <td>{{ props.item.fundsUsed }}</td>
                    <td>{{ props.item.deadline }}</td>
                    <td>
                        <v-icon
                                small
                                class="mr-2"
                                @click="editItem(props.item)"
                        >
                            edit
                        </v-icon>
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
    name: 'ProjectManagement',
    data: () => ({
      valid: true,
      menu: false,
      dialog: false,
      loading: false,
      alert: '',
      search: '',
      headers: [
        {text: '课题编号/ID', value: 'id'},
        {text: '课题名称', value: 'name'},
        {text: '课题负责人', value: 'principal'},
        {text: '资金', value: 'fundsTotal'},
        {text: '已使用资金', value: 'fundsUsed'},
        {text: '截止时间', value: 'deadline'},
        {text: '操作', value: 'action'}
      ],
      projects: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        principal: '',
        id: '',
        fundsTotal: '',
        fundsUsed: '',
        deadline: ''
      },
      defaultItem: {
        name: '',
        principal: '',
        id: '',
        fundsTotal: '',
        fundsUsed: '',
        deadline: ''
      },
      itemRules: {
        name: [
          v => !!v || '请输入课题名称'
        ],
        principal: [
          v => !!v || '请输入课题负责人'
        ],
        fundsTotal: [
          v => !!v || '请输入资金'
        ],
        fundsUsed: [
          v => !!v || '请输入已使用资金'
        ],
        deadline: [
          v => !!v || '请输入截止时间'
        ]
      }
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? '新建课题' : '编辑课题'
      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      }
    },

    methods: {
      editItem(item) {
        this.editedIndex = this.projects.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        const index = this.projects.indexOf(item)
        axios.delete('/project/' + item.id).then((response) => {
          if (response.data.ok) {
            this.projects.splice(index, 1)
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
        axios.post('/project', this.editedItem).then((response) => {
          if (response.data.ok) {
            this.projects.push(response.data.data)
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
        axios.put('/project', this.editedItem).then((response) => {
          if (response.data.ok) {
            Object.assign(this.projects[this.editedIndex], response.data.data)
          } else {
            this.alert = response.data.err
          }
          this.loading = false
          this.close()
        }).catch((error) => {
          this.alert = error.message
          this.loading = false
        })
      }
    },

    created() {
      axios.get(`/projects?timestamp=${new Date().getTime()}`).then((response) => {
        if (response.data.ok) {
          this.projects = response.data.data
        }
      })
    }
  }
</script>

<style scoped>
</style>
