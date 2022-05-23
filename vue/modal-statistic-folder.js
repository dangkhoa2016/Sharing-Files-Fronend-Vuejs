export default {
  methods: {
    ...Vuex.mapActions({
      setModalStatisticFolder: 'browseStore/setModalStatisticFolder',
    }),
    onShow() {
      document.querySelector('body').style = 'overflow: hidden; padding-right: 20px;';
    },
    onHide() {
      document.querySelector('body').style = '';
      this.stopped = true;
      this.resetData();
      this.setModalStatisticFolder(null);
    },
    calculateChildren(id, pageToken) {
      return new Promise(async (resolve, reject) => {
        if (this.stopped) {
          return resolve();
        }

        fetch(`${this.endpoint}/in_folder?id=${id}&page_size=${this.pageSize}&page_token=${pageToken || ''}&server=${this.server}`, {
          method: 'get', headers: { 'Content-Type': 'application/json' },
        }).then(this.$handleJson).then(async json => {
          await this.processResponse(id, json);
          resolve();
        }).catch(ex => {
          console.log('Error fetch', ex);
          reject(ex);
        });
      });
    },
    resetData() {
      this.totalFiles = 0;
      this.errorCalculate = null;
      this.totalFolders = 0;
      this.totalSize = 0;
    },
    run() {
      this.stopped = false;
      this.resetData();
      this.calculateChildren(this.modalStatisticFolder.id).then(() => {
        this.stopped = true;
        this.saveCache();
      }).catch((ex) => {
        console.log('Error run', ex);
        this.stopped = true;
        this.errorCalculate = 'Something wrong.<br>Please try again in a few minutes.';
      });
    },
    saveCache() {
      if (this.cacheKey && (this.totalFiles || this.totalFolders || this.totalSize)) {
        window.localStorage.setItem(this.cacheKey, JSON.stringify({
          totalFiles: this.totalFiles, totalFolders: this.totalFolders, totalSize: this.totalSize
        }));
      }
    },
    async processResponse(id, json) {
      if (this.stopped) {
        return;
      }

      if (Array.isArray(json.files) && json.files.length > 0) {
        for (const item of json.files) {
          if (this.$isFolder(item.mimeType)) {
            this.totalFolders += 1;
            if (this.totalFolders >= this.maxCalculateFolderCount) {
              // console.log('Stopped because of too many folders.');
              this.errorCalculate = 'Stopped because of too many folders.';
              this.stopped = true;
              return;
            }
            await this.calculateChildren(item.id);
          } else {
            this.totalFiles += 1;
            this.totalSize += parseFloat(item.size);
          }
        }
      }

      if (json.nextPageToken)
        await this.calculateChildren(id, json.nextPageToken);
    },
    setFromCache() {
      try {
        const json = JSON.parse(this.cacheFolder);
        const { totalFiles, totalFolders, totalSize } = json || {};
        this.totalFiles = totalFiles;
        this.totalFolders = totalFolders;
        this.totalSize = totalSize;
      } catch (error) {
        console.log('Error parse localStorage', error);
        this.run();
      }
    },
  },
  data() {
    return {
      errorCalculate: null,
      modalShow: false,
      totalFiles: 0,
      totalFolders: 0,
      totalSize: 0,
      stopped: true,
      pageSize: 300,
      maxCalculateFolderCount: 30,
    };
  },
  computed: {
    ...Vuex.mapGetters({
      endpoint: 'appStore/getEndpoint',
      server: 'appStore/getServer',
      modalStatisticFolder: 'browseStore/getModalStatisticFolder',
    }),
    bgClass() {
      if (this.totalFiles < 10) return 'bg-primary';
      else if (this.totalFiles < 20) return 'bg-warning';
      else if (this.totalFiles < 50) return 'bg-info';
      else if (this.totalFiles < 100) return 'bg-success';
      else if (this.totalFiles < 200) return 'bg-danger';
      return 'bg-dark';
    },
    cacheFolder() {
      if (this.modalStatisticFolder)
        return window.localStorage.getItem(this.cacheKey);
    },
    cacheKey() {
      if (this.modalStatisticFolder)
        return `modal-statistic-folder-[${this.modalStatisticFolder.id}]`;
    },
    processing() {
      return !this.stopped;
    },
  },
  watch: {
    modalStatisticFolder(val) {
      if (val && val.id) {
        this.modalShow = true;
        if (this.cacheFolder)
          this.setFromCache();
        else
          this.run();
      }
    },
  },
};
