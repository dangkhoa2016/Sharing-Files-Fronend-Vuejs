const template = `
<div>
  <div class='d-flex justify-content-between'>
    <h1 class='m-0'>Browse files only</h1>
    <button class='btn btn-sm btn-light-success'
      :disabled='loadingFiles' @click.prevent='$refs.fl.loadFiles(true)'>
      <i class='bi bi-arrow-clockwise'></i>Reload
    </button>
  </div>
  <file-listing ref='fl' :load-type='loadType'></file-listing>
</div>
`;

Vue.component('files-browse', {
  data() {
    return {
      loadType: 'filesOnly',
    }
  },
  computed: {
    ...Vuex.mapGetters({
      getLoadingFiles: 'browseStore/getLoadingFiles',
    }),
    loadingFiles() {
      return this.getLoadingFiles(this.loadType);
    },
  },
  template,
});
