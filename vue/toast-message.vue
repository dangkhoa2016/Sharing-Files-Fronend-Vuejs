<template>

  <b-toast id='toast-message'
    header-class='justify-content-between text-light-info bg-info d-flex'
    :no-close-button='true' auto-hide-delay='8000'
    @hide='onHide' @shown='onShown'>
    <template #toast-title='{ hide }'>
      <span class='mr-auto'>Notice !</span>
      <button type='button' aria-label='Close' @click.prevent='hide'
        class='btn btn-light-dark px-2 py-0'>x</button>
    </template>
    {{ toastMessage }}
  </b-toast>

</template>

<script>
  export default {
    methods: {
      ...Vuex.mapActions({
        setToastMessage: 'appStore/setToastMessage',
      }),
      onHide() {
        this.setToastMessage('');
      },
      onShown(ev) {
        ev.vueTarget.$refs.toast.querySelector('.toast-header button').className = 'btn btn-light-dark px-2 py-0';
      },
    },
    computed: {
      ...Vuex.mapGetters({
        toastMessage: 'appStore/getToastMessage',
      }),
    },
    watch: {
      toastMessage(val) {
        if (val)
          this.$bvToast.show('toast-message');
      },
    },
  };
</script>
