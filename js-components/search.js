const template = `
<div>
  <div class='d-flex justify-content-between mb-3'>
    <h1 class='m-0'>Search</h1>
    <button v-if='hasKeyword' class='btn btn-sm btn-light-success'
      :disabled='searching' @click.prevent='$refs.fl.loadFiles(true)'>
      <i class='bi bi-arrow-clockwise'></i>Search again
    </button>
  </div>

  <div v-if='hasKeyword'>
    <h4 class='mb-3'>Search result for keyword: {{ search_keyword }}</h4>

    <file-listing ref='fl' :load-type='loadType' body-class='mt-4'></file-listing>
  </div>
  <no-content v-else>
    Enter keyword to process.
  </no-content>
</div>
`;

Vue.component('search', {
  template,
  data() {
    return {
      loadType: 'search',
    }
  },
  computed: {
    ...Vuex.mapGetters({
      searching: 'searchStore/getSearching',
    }),
    search_keyword() {
      return this.$route.query.keyword || '';
    },
    hasKeyword() {
      return this.search_keyword.length > 1;
    },
  },
  mounted() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },
});
