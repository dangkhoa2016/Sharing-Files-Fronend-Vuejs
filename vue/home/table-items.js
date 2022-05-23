export default {
  props: {
    tab: Object,
    tabKey: String,
  },
  mounted() {
    if (this.isActive)
      this.loadData();
  },
  methods: {
    ...Vuex.mapActions({
      setTypeData: 'homeStore/setTypeData',
      setCurrentFile: 'browseStore/setCurrentFile',
      setErrorTypeData: 'homeStore/setErrorTypeData',
      getTypeData: 'homeStore/getTypeData',
    }),
    async loadData(force = false) {
      if (this.loading) {
        return;
      }

      if (!force && this.errorMessage) {
        return;
      }

      if (this.items)
        return;

      const [fromDate, toDate] = this.$weekRange(this.tab.week);

      this.loading = true;
      this.getTypeData({ type: this.tab.type, week: this.tab.week, fromDate, toDate });
    },
  },
  data() {
    return {
      loading: false,
      link_class: 'nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bolder px-4 me-1',
    }
  },
  computed: {
    ...Vuex.mapGetters({
      getFiles: 'homeStore/getFiles',
      getErrorLoadingFilesMessage: 'homeStore/getErrorLoadingFilesMessage',
    }),
    items() {
      return this.isActive && this.tab ? this.getFiles(this.tab.type, this.tab.week) : [];
    },
    errorMessage() {
      return this.tab ? this.getErrorLoadingFilesMessage(this.tab.type, this.tab.week) : null;
    },
    reloadText() {
      return this.errorMessage ? 'Reload...' : '';
    },
    buttonId() {
      return `${this.tab.type}-${this.tab.week}-${(new Date()).valueOf()}`;
    },
    tooltipContent() {
      const [fromDate, toDate] = this.$weekRange(this.tab.week);
      return `From: <span class='text-primary fw-bolder'>${this.$options.filters.date(fromDate)}</span><br/>` +
        `To: <span class='text-primary fw-bolder'>${this.$options.filters.date(toDate)}</span>`;
    },
    hasData() {
      return Array.isArray(this.items) && this.items.length > 0;
    },
    isActive() {
      return this.tab && this.tabKey === this.tab.week;
    },
  },
  watch: {
    tabKey(newType) {
      if (this.tab && newType === this.tab.week)
        this.loadData();
    },
    errorMessage(val) {
      if (val)
        this.loading = false;
    },
    items(arr, old) {
      if (this.isActive) {
        if (arr !== null && old === undefined) {
          this.loading = false;
          this.$root.$emit('items', arr);
        }
      }
    },
  },
};