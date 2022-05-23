const { loadModule, vueVersion } = window['vue2-sfc-loader'];
window.options = {
  moduleCache: {
    vue: Vue,
  },
  async getFile(url) {
    const res = await fetch(url);
    if (!res.ok)
      throw Object.assign(new Error(url + ' ' + res.statusText), { res });
    return await res.text();
  },

  addStyle(textContent) {
    const style = Object.assign(document.createElement('style'), { textContent });
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  },

  log(type, ...args) {
    console[type](...args);
  },
};

(async function () {

  const loadStore = function (file) {
    return loadJs(`/stores/${file}.js`);
  };
  const loadJsComponent = function (file) {
    return loadJs(`/js-components/${file}.js`);
  };
  const loadJs = function (file) {
    return new Promise((resolve, reject) => {
      // console.log(`loading file: ${file}`);
      fetch(file)
        .then(res => res.text())
        .then(js => {
          eval(js);
          resolve();
        }).catch(ex => console.log(ex));
    });
  };

  const arrLibraries = [
    'npm/viewerjs@1.10.5', 'npm/v-viewer@1.6.4',
    'npm/vue-clipboard2@0.3.3/dist/vue-clipboard.min.js',
    'npm/vue-jstree@2.1.6/dist/vue-jstree.min.js',
    'npm/vee-validate@3.4.14/dist/vee-validate.min.js',
    'npm/vee-validate@3.4.14/dist/rules.umd.min.js',

    /* code mirror */
    'npm/codemirror@5.65.2/lib/codemirror.min.js',
    'npm/vue-codemirror@4.0.6/dist/vue-codemirror.min.js',
    'npm/codemirror@5.65.2/addon/mode/overlay.js',
    'npm/codemirror@5.65.2/addon/dialog/dialog.js',
    'npm/codemirror@5.65.2/addon/search/searchcursor.js',
    'npm/codemirror@5.65.2/addon/search/search.js',
    'npm/codemirror@5.65.2/addon/search/jump-to-line.js',
    'npm/codemirror@5.65.2/addon/search/matchesonscrollbar.js',
    'npm/codemirror@5.65.2/addon/scroll/annotatescrollbar.js',
    'npm/codemirror@5.65.2/addon/edit/matchbrackets.js',
    'npm/codemirror@5.65.2/addon/selection/selection-pointer.js',
    'npm/codemirror@5.65.2/addon/fold/foldcode.js',
    'npm/codemirror@5.65.2/addon/fold/foldgutter.js',
    // 'npm/codemirror@5.65.2/addon/fold/brace-fold.js',
    'npm/codemirror@5.65.2/addon/fold/xml-fold.js',
    'npm/codemirror@5.65.2/addon/fold/comment-fold.js',
    // 'npm/codemirror@5.65.2/addon/hint/javascript-hint.js',
    'npm/codemirror@5.65.2/addon/hint/show-hint.js',
    'npm/codemirror@5.65.2/mode/javascript/javascript.js',
    'npm/codemirror@5.65.2/mode/xml/xml.js',
    'npm/codemirror@5.65.2/mode/css/css.js',
    'npm/codemirror@5.65.2/mode/shell/shell.js',
    'npm/codemirror@5.65.2/mode/vbscript/vbscript.js',
    'npm/codemirror@5.65.2/mode/htmlmixed/htmlmixed.js',
  ];

  new Vue({
    el: '#loader',
    data: {
      variants: {
        'info': { action: 'loadStore', status: 0, title: 'Loading vuex store' },
        'success': { action: 'loadVueComponent', status: 0, title: 'Loading vue components' },
        'danger': { action: 'initApp', status: 0, title: 'Initing app' },
        'warning': { action: '', status: 0, title: 'All done, now start' }
      },
      current: '',
      completed: false
    },
    computed: {
      currentAction() {
        if (!this.current)
          return 'Done';
        return this.current === 'start' ? 'App loading...' : this.variants[this.current].title;
      },
    },
    methods: {
      async setCompleted() {
        this.completed = true;

        await this.sleep(1000);
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
        window.app.setCompleted();
      },
      sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },
      async loadStore() {
        await Promise.all([
          loadStore('appStore'),
          loadStore('searchStore'),
          loadStore('browseStore'),
          loadStore('homeStore'),
        ]);
      },
      async loadVueComponent() {
        await loadJs('https://cdn.jsdelivr.net/combine/' + arrLibraries.join(','));
        await loadJs('/helpers.js');

        const components = ['error', 'loader', 'no-content', 'blocks-view',
          'button-actions', 'list-view', 'file-listing'];
        await Promise.all(components.map(async (name) => {
          Vue.component(name, await loadModule(`/vue/global/${name}.vue`, options));
        }));

        await Promise.all([
          loadJsComponent('folders-browse'),
          loadJsComponent('search'),
          loadJsComponent('files-browse'),
        ]);
      },
      initApp() {
        return new Promise(async (resolve) => {
          await loadJs('/script.js');
          const intervalId = setInterval(() => {
            if (typeof window.app.setCompleted === 'function') {
              clearInterval(intervalId);
              resolve();
            }
          }, 500);
        });
      },
    },
    async created() {
      this.current = 'start';

      for (var key in this.variants) {
        this.current = key;
        if (this.variants[key].action) {
          await this[this.variants[key].action]();
          // await this.sleep(2000);
          this.variants[key].status = 25;
          this.current = '';
        }
        else {
          await this.sleep(500);
          this.variants[key].status = 25;
          await this.sleep(1500);

          // console.log('Loader all done');
        }
      }

      await this.setCompleted();
    }
  });

})();
