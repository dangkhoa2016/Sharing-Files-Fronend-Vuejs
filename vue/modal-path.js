export default {
  methods: {
    ...Vuex.mapActions({
      setModalBrowseFolder: 'browseStore/setModalBrowseFolder',
      setModalFullPathItem: 'browseStore/setModalFullPathItem',
    }),
    onShow() {
      document.querySelector('body').style = 'overflow: hidden; padding-right: 20px;';
    },
    onHide() {
      document.querySelector('body').style = '';
      this.stopped = true;
      this.resetData();
      this.setModalFullPathItem(null);
    },
    setFromCache() {
      try {
        const arr = JSON.parse(this.cacheFolders);
        this.arrPaths = arr;
      } catch (error) {
        console.log('Error parse localStorage', error);
        this.run();
      }
    },
    showFolder(folder) {
      this.modalShow = false;
      (this.modalBrowseFolderOpened || this.$route.name !== 'folders-browse') ? this.setModalBrowseFolder(folder) : this.$root.$emit('sidebar-click', folder);
    },
    resetData() {
      this.arrPaths = [];
      this.errorRun = null;
    },
    run() {
      this.stopped = false;
      this.resetData();
      this.loadParent(this.item.id).then(() => {
        this.stopped = true;
        this.saveCache();
      }).catch((ex) => {
        console.log('Error run', ex);
        this.stopped = true;
        this.errorRun = 'Something wrong.<br>Please try again in a few minutes.';
      });
    },
    loadParent(id) {
      return new Promise(async (resolve, reject) => {
        if (this.stopped) {
          return resolve();
        }

        fetch(`${this.endpoint}/info?id=${id}&fields=id,name,parents&server=${this.server}`, {
          method: 'get', headers: { 'Content-Type': 'application/json' },
        }).then(this.$handleJson).then(async json => {
          await this.processResponse(json);
          resolve();
        }).catch(ex => {
          console.log('Error fetch', ex);
          reject(ex);
        });
      });
    },
    saveCache() {
      if (this.cacheKey && this.hasData)
        window.localStorage.setItem(this.cacheKey, JSON.stringify(this.arrPaths));
    },
    async processResponse(json) {
      if (this.stopped || !json)
        return;

      var needLoadParent = Array.isArray(json.parents) && json.parents.length > 0;
      if (json.id !== this.item.id)
        this.arrPaths.unshift({ id: json.id, name: needLoadParent ? json.name : 'root' });
      if (needLoadParent)
        await this.loadParent(json.parents[0]);
    },
  },
  data() {
    return {
      modalShow: false,
      arrPaths: [],
      stopped: true,
    }
  },
  computed: {
    ...Vuex.mapGetters({
      modalBrowseFolderOpened: 'browseStore/getModalBrowseFolderOpened',
      endpoint: 'appStore/getEndpoint',
      server: 'appStore/getServer',
      item: 'browseStore/getModalFullPathItem',
    }),
    cacheFolders() {
      if (this.item)
        return window.localStorage.getItem(this.cacheKey);
    },
    cacheKey() {
      if (this.item)
        return `modal-full-path-item-[${this.item.id}]`;
    },
    itemName() {
      return this.item && this.item.name;
    },
    processing() {
      return !this.stopped;
    },
    hasData() {
      return Array.isArray(this.arrPaths) && this.arrPaths.length > 0;
    },
  },
  watch: {
    item(val) {
      if (val) {
        this.modalShow = true;
        if (this.cacheFolders)
          this.setFromCache();
        else
          this.run();
      }
    },
  },
};