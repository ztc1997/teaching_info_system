<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <v-card-title class="red darken-3 white--text subheading" primary-title>
                    <span class="title">404 Not Found</span>
                </v-card-title>
                <v-card-text>
                    您要查找的页面不存在！！！
                </v-card-text>
                <v-card-actions>
                    <v-btn flat class="red darken-3 white--text" to="/">返回首页</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
  export default {
    name: 'Page404'
  }
</script>

<style scoped>

</style>
