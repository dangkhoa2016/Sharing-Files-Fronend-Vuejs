const template = `
<div class='row'>
  <div class='col-md-3 order-sm-last order-md-first'>
    <div v-if='loadingFiles && !hasData' class='bg-white p-2 rounded'>Loading...</div>
    <div v-else-if='!loadingFiles && !hasData' class='bg-white p-2 rounded'>No folders.</div>
    <v-jstree v-else :data='jstree' class='bg-white mb-4 py-2 rounded'
      ref='main-tree' @item-toggle='itemToggle'
      @item-click='itemClick'></v-jstree>
  </div>
  <div class='col-md-9'>
    <div class='d-flex justify-content-between'>
      <h1 class='m-0 one-line' :title='rootName'>
        <a class='btn btn-sm btn-icon me-2'
          @click.prevent='showRoot' :class="isRoot ? 'btn-warning' : 'btn-secondary'">
          <i class='bi bi-house'></i>
        </a> Browse [{{ rootName }}]
      </h1>
      <button class='btn btn-sm btn-light-success'
        :disabled='loadingFiles'  @click.prevent='$refs.fl.loadFiles(true)'>
        <i class='bi bi-arrow-clockwise'></i>Reload
      </button>
    </div>
    <file-listing :root='root' :loadType='loadType' ref='fl'
      blocks-class='col-lg-4 col-md-6 col-xxl-3'>
    </file-listing>
  </div>
</div>
`;

Vue.component('folders-browse', {
  props: {
    root: Object,
    default: { id: '#' }
  },
  created() {
    this.listenAction();
    this.setCurrentFolderId(this.rootId);
  },
  mounted() {
    if (this.$refs['main-tree'])
      this.$refs['main-tree'].$el.setAttribute('id', 'main-tree');
  },
  data() {
    return {
      selectedFolder: null,
      loadType: 'folders',
      jstree: [],
      hasFiles: false,
      iconOpened: 'fa fa-folder-open text-warning',
      iconLoading: 'fas fa-circle-notch fa-spin',
    }
  },
  methods: {
    ...Vuex.mapActions({
      listChildItems: 'browseStore/listChildItems',
      actionSetCurrentFolderId: 'browseStore/setCurrentFolderId',
    }),
    setCurrentFolderId(id) {
      this.hasFiles = false;
      this.actionSetCurrentFolderId(id);
    },
    showRoot() {
      if (this.selectedFolder)
        this.selectedFolder.model.icon = 'fa fa-folder';
      this.selectedFolder = null;
      this.setCurrentFolderId(this.rootId);
    },
    removeClassHover() {
      const currentSelected = document.querySelector('#main-tree .tree-wholerow-clicked');
      if (currentSelected)
        currentSelected.classList.remove('tree-wholerow-clicked');
    },
    itemToggle(node, item) {
      if (this.loadingFiles)
        item.icon = this.iconLoading;
      else if (item.opened)
        item.icon = this.iconOpened;
      else
        item.icon = 'fa fa-folder';
    },
    itemClick(node) {
      this.removeClassHover();
      if (this.selectedFolder && this.selectedFolder !== node)
        this.selectedFolder.model.icon = 'fa fa-folder';
      this.selectedFolder = node;
      this.setCurrentFolderId(node.model.id);
      if (node.model.loaded) {
        node.model.icon = this.iconOpened;
        return;
      }

      if (this.hasFiles) {
        node.model.loaded = true;
        node.model.icon = this.iconOpened;
      } else
        this.selectedFolder.model.icon = this.iconLoading;
    },
    pickFolder(arr) {
      const isFolder = this.$isFolder;
      const existed = this.isRoot ? (this.jstree || []) : (this.selectedFolder && this.selectedFolder.model.children || []);
      arr.forEach(item => {
        if (isFolder(item.mimeType) && (existed.findIndex(f => f.id === item.id) === -1)) {
          existed.push({
            id: item.id, isLeaf: false,
            opened: false,
            text: item.name, icon: 'fa fa-folder',
            children: []
          });
        }
      });

      this.setTreeData(existed);
    },
    setTreeData(data) {
      if (this.isRoot)
        this.jstree = data;
      else if (this.selectedFolder) {
        this.selectedFolder.model = {
          ...this.selectedFolder.model,
          opened: true, loaded: true,
          children: data,
          icon: this.iconOpened,
        };
      }
    },
    listenAction() {
      this.$root.$on('items', this.handleItems);
      this.$root.$on('sidebar-click', (item) => {
        const currentTree = this.selectedFolder || this.$refs['main-tree'];
        if (item && item.id && currentTree) {
          const node = currentTree.$children.find(child => child.model.id === item.id);
          if (node)
            this.itemClick(node);
        }
      });
    },
    handleItems(items) {
      if (Array.isArray(items) && items.length > 0) {
        this.hasFiles = true;
        this.pickFolder(items);
      } else {
        this.hasFiles = false;
        if (this.selectedFolder) {
          this.selectedFolder.model = {
            ...this.selectedFolder.model,
            opened: true, loaded: false,
            children: [], icon: this.iconOpened,
          }
        }
      }
    },
  },
  computed: {
    ...Vuex.mapGetters({
      getLoadingFiles: 'browseStore/getLoadingFiles',
      currentFolderId: 'browseStore/getCurrentFolderId',
    }),
    rootId() {
      return !this.root ? '#' : this.root.id;
    },
    loadingFiles() {
      return this.getLoadingFiles(this.currentFolderId ?? this.rootId);
    },
    rootName() {
      return this.rootId === '#' ? 'root' : this.root.name;
    },
    isRoot() {
      return this.currentFolderId === this.rootId;
    },
    hasData() {
      return Array.isArray(this.jstree) && this.jstree.length > 0;
    },
  },
  template,
  watch: {
    currentFolderId() {
      this.hasFiles = false;
    },
  },
});
