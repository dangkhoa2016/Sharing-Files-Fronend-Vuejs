export default {
  props: {
    defaultViewType: {
      type: String,
      default: 'list',
    },
    bodyClass: {
      type: String,
      default: 'my-4',
    },
    root: {
      type: Object,
      default: { id: '#' }
    },
    blocksClass: String,
    loadType: {
      type: String,
      required: true,
    },
    errorLoadingMessage: String,
  },
  created() {
    if (this.isSearch) {
      this.selectedPageSize = this.searchPageSize;
      this.selectedOrderBy = '';
    } else {
      this.selectedOrderBy = (this.isFilesOnly ? this.fileBrowseOrderBy : this.folderBrowseOrderBy);
      this.selectedPageSize = (this.isFilesOnly ? this.fileBrowsePageSize : this.folderBrowsePageSize);
    }
  },
  mounted() {
    if (!this.hasFiles)
      this.loadFiles();
    else
      this.$root.$emit('items', this.items);
  },
  data() {
    return {
      selectedOrderBy: '',
      pageNumber: 1,
      selectedPageSize: 0,
      viewType: this.defaultViewType || 'list',
    }
  },
  methods: {
    ...Vuex.mapActions({
      setErrorLoadingFiles: 'browseStore/setErrorLoadingFiles',
      actionLoadFilesOnly: 'browseStore/loadFilesOnly',
      clearCacheFolder: 'browseStore/clearCacheFolder',
      setCurrentFolderId: 'browseStore/setCurrentFolderId',
      listChildItems: 'browseStore/listChildItems',
      clearCacheSearch: 'searchStore/clearCacheForKeyword',
      processSearch: 'searchStore/search',
      clearCacheFilesOnly: 'browseStore/clearCacheFilesOnly',
    }),
    setType(type) {
      this.viewType = type;
    },
    setPageSize(pageSize) {
      if (pageSize && pageSize !== this.selectedPageSize) {
        this.selectedPageSize = pageSize;
        this.loadFiles(true);
      }
    },
    setOrderBy(orderBy) {
      if (orderBy && orderBy !== this.selectedOrderBy) {
        this.selectedOrderBy = orderBy;
        this.loadFiles(true);
      }
    },
    async loadNextPage(e) {
      e.target.blur();

      this.pageNumber += 1;
      if (!this.hasFiles)
        await this.loadFiles();
    },
    async loadPrevPage(e) {
      e.target.blur();

      if (this.pageNumber > 0)
        this.pageNumber -= 1;
    },
    async loadFiles(resetCache = false) {
      if (this.isFilesOnly) {
        if (resetCache) {
          this.clearCacheFilesOnly();
          this.pageNumber = 1;
        }
        return await this.actionLoadFilesOnly({ pageSize: this.selectedPageSize, orderBy: this.selectedOrderBy });
      }

      if (this.isFolders && this.root) {
        if (resetCache) {
          this.clearCacheFolder(this.currentFolderId);
          this.pageNumber = 1;
        }
        return await this.listChildItems({ pageSize: this.selectedPageSize, orderBy: this.selectedOrderBy });
      }

      if (this.isSearch) {
        if (resetCache) {
          this.clearCacheSearch(this.search_keyword);
          this.pageNumber = 1;
        }
        await this.processSearch({ pageSize: this.selectedPageSize, keyword: this.search_keyword });
      }
    },
    linkClass(type, value) {
      var isActive = false;
      if (type === 'order')
        isActive = value === this.selectedOrderBy;
      else
        isActive = value === this.selectedPageSize;

      return `dropdown-item py-2 px-5 bg-hover-light-info text-hover-info${isActive ? ' text-info bg-light-info' : ''}`;
    },
  },
  computed: {
    ...Vuex.mapGetters({
      pageSizes: 'appStore/getPageSizes',
      orderList: 'appStore/getOrderList',
      folderBrowsePageSize: 'appStore/getFolderBrowsePageSize',
      folderBrowseOrderBy: 'appStore/getFolderBrowseOrderBy',
      fileBrowsePageSize: 'appStore/getFileBrowsePageSize',
      fileBrowseOrderBy: 'appStore/getFileBrowseOrderBy',
      searchPageSize: 'appStore/getSearchPageSize',

      getLoadingFiles: 'browseStore/getLoadingFiles',
      getErrorLoadingFilesMessage: 'browseStore/getErrorLoadingFilesMessage',
      currentFolderId: 'browseStore/getCurrentFolderId',
      computedHasNextPage: 'browseStore/hasNextPage',
      getFiles: 'browseStore/getFiles',

      errorSearchMessage: 'searchStore/getErrorSearchMessage',
      searchHasNextPage: 'searchStore/hasNextPage',
      getSearchFiles: 'searchStore/getFiles',
      searching: 'searchStore/getSearching',
    }),
    isRoot() {
      return this.root && this.currentFolderId === this.root.id;
    },
    items() {
      return this.isSearch ? (this.getSearchFiles(this.search_keyword, this.pageNumber) || []) : (this.getFiles(this.loadType, this.pageNumber) || []);
    },
    isFilesOnly() {
      return this.loadType && this.loadType.toLowerCase() === 'filesonly';
    },
    isFolders() {
      return this.loadType && this.loadType.toLowerCase() === 'folders';
    },
    isSearch() {
      return this.loadType && this.loadType.toLowerCase() === 'search';
    },
    currentLoadType() {
      return this.isFolders ? this.currentFolderId : this.loadType;
    },
    loading() {
      return this.isSearch ? this.searching : this.getLoadingFiles(this.currentLoadType);
    },
    errorLoadingMessage() {
      return this.isSearch ? this.errorSearchMessage : this.getErrorLoadingFilesMessage(this.currentLoadType);
    },
    hasNextPage() {
      return this.isSearch ? (this.searchHasNextPage(this.search_keyword, this.pageNumber + 1) || false) : (this.computedHasNextPage(this.loadType, this.pageNumber + 1) || false);
    },
    displaySelectedOrderBy() {
      if (this.selectedOrderBy)
        return `Order by: ${this.orderList.find(o => o.value === this.selectedOrderBy).text}`;
    },
    isBlocks() {
      return this.viewType === 'blocks';
    },
    isList() {
      return this.viewType === 'list';
    },
    hasFiles() {
      return Array.isArray(this.items) && this.items.length > 0;
    },
    search_keyword() {
      return this.$route.query.keyword || '';
    },
    hasKeyword() {
      return this.search_keyword.length > 1;
    },
  },
  watch: {
    root(newRoot) {
      if (newRoot) {
        this.hasFiles = false;
        this.setCurrentFolderId(newRoot.id);
      }
    },
    items(arr) {
      if (Array.isArray(arr) && arr.length > 0) {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }

      this.$root.$emit('items', arr);
    },
    currentFolderId(val) {
      this.pageNumber = 1;
      if (!this.hasFiles && !this.loading)
        this.loadFiles();
    },
    search_keyword(val, old) {
      if (val && val.length > 1) {
        this.clearCacheSearch(old);
        this.processSearch({ pageSize: this.selectedPageSize, keyword: val });
      }
    },
    pageNumber() {
      this.setErrorLoadingFiles({ [this.currentLoadType]: null });
    },
  },
};
