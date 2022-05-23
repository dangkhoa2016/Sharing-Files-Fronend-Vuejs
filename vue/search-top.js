export default {
  methods: {
    goToSearch() {
      if (this.$route.name !== 'search' || this.$route.query.keyword !== this.search)
        this.$router.push({ name: 'search', query: { keyword: this.search } });
    },
  },
  data() {
    return {
      search: '',
      searching: false,
    }
  },
  watch: {
    '$route'(to) {
      this.search = (to.name === 'search') ? (to.query.keyword || '') : '';
    },
  },
  mounted() {
    this.search = this.$route.query.keyword || '';
  },
};
