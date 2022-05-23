export default {
  props: {
    item: Object,
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',
      setModalStatisticFolder: 'browseStore/setModalStatisticFolder',
      setModalFullPathItem: 'browseStore/setModalFullPathItem',
      setCurrentFile: 'browseStore/setCurrentFile',
    }),
    async setClipboard(id) {
      try {
        await this.$copyText(id);
        this.setToastMessage(`Google file or folder [${id}] has been placed in clipboard.`);
      } catch (ex) {
        console.log('Error copy to clipboard', ex);
      }
    },
    movieAction(type) {
      this.setCurrentFile({ ...this.item, movieAction: type });
    },
  },
  computed: {
    ...Vuex.mapGetters({
      endpoint: 'appStore/getEndpoint',
      modalBrowseFolderOpened: 'browseStore/getModalBrowseFolderOpened',
    }),
    mainText() {
      if (!this.item)
        return;

      if (this.$isFolder(this.item.mimeType))
        return 'Open';
      else if (this.$isVideo(this.item.mimeType))
        return 'View';
      else if (this.$canView(this.item))
        return 'Preview';
      else if (!this.$isFolder(this.item.mimeType))
        return 'Download';
    },
    showModalFullPath() {
      return !this.modalBrowseFolderOpened && this.$route.name !== 'folders-browse';
    },
  },
};