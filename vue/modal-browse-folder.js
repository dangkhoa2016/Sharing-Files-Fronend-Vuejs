export default {
  methods: {
    ...Vuex.mapActions({
      setModalBrowseFolder: 'browseStore/setModalBrowseFolder',
    }),
    onShow() {
      document.querySelector('body').style = 'overflow: hidden; padding-right: 20px;';
    },
    onHide() {
      document.querySelector('body').style = '';
      this.setModalBrowseFolder(null);
    },
  },
  data() {
    return {
      modalShow: false,
    }
  },
  computed: {
    ...Vuex.mapGetters({
      modalBrowseFolder: 'browseStore/getModalBrowseFolder',
    }),
  },
  watch: {
    modalBrowseFolder(val) {
      if (val && val.id) {
        this.modalShow = true;
      }
    },
  },
};
