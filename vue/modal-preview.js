import PreviewItem from './preview-item.vue';

export default {
    components: {
      PreviewItem,
    },
    methods: {
      ...Vuex.mapActions({
        setCurrentFile: 'browseStore/setCurrentFile',
        loadFileInfo: 'browseStore/loadFileInfo',
        searchMovieInfo: 'browseStore/searchMovieInfo',
        searchMovieTrailer: 'browseStore/searchMovieTrailer',
        setFileInfoResult: 'browseStore/setFileInfoResult',
        setMovieInfo: 'browseStore/setMovieInfo',
        setMovieTrailer: 'browseStore/setMovieTrailer',
      }),
      onShow() {
        document.querySelector('body').style = 'overflow: hidden; padding-right: 20px;';
      },
      onHide() {
        document.querySelector('body').style = '';
        this.setCurrentFile(null);
        this.setFileInfoResult(null);
      },
      doPreview() {
        if (!this.currentFile.movieAction) {
          this.loadFileInfo();
          return;
        }

        if (this.currentFile.movieAction.toLowerCase() === 'info') {
          this.setMovieInfo(null);
          this.searchMovieInfo(this.$extractName(this.currentFile.name));
        }
        else {
          this.setMovieTrailer(null);
          this.searchMovieTrailer(`${this.$extractName(this.currentFile.name)} trailer`);
        }
      },
    },
    data() {
      return {
        modalShow: false,
      }
    },
    computed: {
      ...Vuex.mapGetters({
        currentFile: 'browseStore/getCurrentFile',
      }),
    },
    watch: {
      currentFile(val) {
        if (val && val.id) {
          this.modalShow = true;
          this.doPreview();
        }
      },
    },
  };