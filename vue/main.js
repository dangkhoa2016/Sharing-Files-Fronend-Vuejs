import NavHeader from './nav-header.vue';
import ModalPreview from './modal-preview.vue';
import ModalPath from './modal-path.vue';
import ModalBrowseFolder from './modal-browse-folder.vue';
import ModalStatisticFolder from './modal-statistic-folder.vue';
import ToastMessage from './toast-message.vue';
import Home from './home/index.vue';
import Settings from './settings.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/settings', name: 'settings', component: Settings },
  { path: '/files', name: 'files-browse', component: Vue.options.components['files-browse'] },
  { path: '/browse', name: 'folders-browse', component: Vue.options.components['folders-browse'] },
  { path: '/search', name: 'search', component: Vue.options.components['search'] },
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

const store = new Vuex.Store({
  modules: {
    appStore: window['store'].appStore,
    browseStore: window['store'].browseStore,
    searchStore: window['store'].searchStore,
    homeStore: window['store'].homeStore,
  }
});

export default {
  components: {
    NavHeader,
    ModalPreview,
    ModalPath,
    ToastMessage,
    ModalBrowseFolder,
    ModalStatisticFolder
  },
  template: window.app.html,
  store,
  router,
  data() {
    return {
      sourceImageObjects: [],
    }
  },
  mounted() {
    this.listenAction();
  },
  computed: {
    ...Vuex.mapGetters({
      endpoint: 'appStore/getEndpoint',
      server: 'appStore/getServer',
      appLoaded: 'appStore/getAppLoaded',
      modalBrowseFolderOpened: 'browseStore/getModalBrowseFolderOpened',
    }),
  },
  methods: {
    ...Vuex.mapActions({
      resetCacheFolderFiles: 'browseStore/resetCacheFolderFiles',
      setModalBrowseFolder: 'browseStore/setModalBrowseFolder',
      setCurrentFile: 'browseStore/setCurrentFile',
      setAppLoaded: 'appStore/setAppLoaded',
    }),
    async setCompleted() {
      delete window['store'];
      delete window['options'];
      // await this.sleep(1000);
      this.setAppLoaded(true);
    },
    viewVideo(id) {
    },
    showPreview(item) {
      const imageIndex = this.sourceImageObjects.findIndex(img => img.id === item.id);
      if (imageIndex == -1)
        this.setCurrentFile(item);
      else {
        VueViewer.api({
          options: { url: 'data-source', initialViewIndex: imageIndex },
          images: this.sourceImageObjects
        });
      }
    },
    listenAction() {
      this.$root.$on('action', (item, text) => {
        if (text === 'Download') {
          window.open(`${this.endpoint}/download?id=${item.id}`);
          return;
        }

        if (this.$isFolder(item.mimeType)) {
          if (this.modalBrowseFolderOpened || this.$route.name === 'folders-browse')
            this.$root.$emit('sidebar-click', item);
          else
            this.setModalBrowseFolder(item);
        } else if (this.$isVideo(item.mimeType))
          window.open(`${this.endpoint}/view?id=${item.id}`);
        else if (this.$canView(item))
          this.showPreview(item);
      });
      this.$root.$on('items', this.handleItems);
    },
    getImageUrl(id, isThumbnail) {
      return `${this.endpoint}/${isThumbnail ? 'thumbnail' : 'view'}?server=${this.server}&id=${id}${isThumbnail ? '&sz=h80' : ''}`;
    },
    handleItems(items) {
      if (Array.isArray(items) && items.length > 0) {
        const arr = items.map(item => {
          if (this.$isImage(item.mimeType)) {
            return {
              id: item.id, alt: item.name,
              'data-source': this.getImageUrl(item.id, false),
              src: this.getImageUrl(item.id, true),
            };
          }
        }).filter(f => f);
        this.sourceImageObjects = arr;
      }
    }
  },
}
