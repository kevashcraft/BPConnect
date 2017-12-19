<template>

  <div id="login">
    <header>
      <img src="/images/bpconnect-logo.svg" width="250px">
    </header>

      <form class="ui form">
        <div class="ui segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" v-model="user.username" placeholder="Username">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" v-model="user.password" placeholder="Password">
            </div>
          </div>
          <div class="ui loader active" v-show="loading"></div>
          <div class="align-right">
            <button class="ui primary button" @click.prevent="login">Login</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        user: {},
        loading: {},
        S: S
      }
    },
    methods: {
      login () {
        this.$set(S, 'authed', true)

        let params = new URLSearchParams(window.location.search)
        let redirect = '/'
        if (params.has('redirect')) {
          redirect = decodeURIComponent(params.get('redirect'))
        }

        this.$router.push(redirect)
      },
      click () {
        return
      }
    }
  }
</script>
