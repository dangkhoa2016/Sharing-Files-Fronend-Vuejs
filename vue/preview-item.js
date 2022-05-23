export default {
  data() {
    return {
      frameLoading: 'frame-loading',
      frameAllow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    }
  },
  watch: {
    getMovieTrailer(val) {
      if (val)
        this.frameLoading = 'frame-loading';
    },
    movieInfo(val) {
      if (val)
        this.frameLoading = 'frame-loading';
    },
  },
  computed: {
    ...Vuex.mapGetters({
      loading: 'browseStore/getLoadingFile',
      errorLoadingMessage: 'browseStore/errorLoadingFileMessage',
      currentFile: 'browseStore/getCurrentFile',
      fileInfoResult: 'browseStore/getFileInfoResult',
      movieInfo: 'browseStore/getMovieInfo',
      getMovieTrailer: 'browseStore/getMovieTrailer',
    }),
    movieTrailer() {
      return this.getMovieTrailer ? { ...this.getMovieTrailer, link: this.$getEmbedUrl(this.getMovieTrailer.link) } : null;
    },
    hasMovieTrailerAction() {
      return this.isVideo && this.currentFile.movieAction.toLowerCase() === 'trailer';
    },
    hasMovieInfoAction() {
      return this.isVideo && this.currentFile.movieAction.toLowerCase() === 'info';
    },
    isVideo() {
      return this.currentFile && this.$isVideo(this.currentFile.mimeType);
    },
    isPlain() {
      return this.currentFile && (
        this.$isPlainTextByMimeType(this.currentFile.mimeType)
        ||
        this.$isPlainTextByFileName(this.currentFile.name)
      );
    },
    isCSV() {
      return this.currentFile && this.$isCSV(this.currentFile.mimeType);
    },
    isShellContent() {
      return this.currentFile && (/\.(bash|sh)$/i).test(this.currentFile.name);
    },
    csvToTable() {
      var h = this.fileInfoResult || '';
      h = h.replace(/\,\n/g, '\n');
      h = h.replace(/\n/g, '</td></tr>\n<tr><td>');
      h = h.replace(/\,/g, '</td><td>');
      var full = `<tr><td>${h}</td></tr>`;
      const regFirstRow = /(<tr>)(.*?)(<\/tr>)/s;
      const content = `<thead class='fw-bolder text-muted text-hover-info'>` +
        `<tr>$2</tr></thead><tbody class='bg-white'>`;
      return full.replace(regFirstRow, content) + '</tbody>';
    },
    codemirror_options() {
      const mixedMode = {
        name: 'htmlmixed',
        scriptTypes: [
          { matches: /\/x-handlebars-template|\/x-mustache/i, mode: null },
          { matches: /(text|application)\/(x-)?vb(a|script)/i, mode: 'vbscript' }
        ]
      };

      const is_html = (this.fileInfoResult || '').indexOf('<html') === 0 || (this.fileInfoResult || '').indexOf('<!DOCTYPE') === 0;
      return {
        mode: is_html ? mixedMode : (this.isShellContent ? 'shell' : 'text/plain'),
        tabSize: 2,
        autoCloseBrackets: true,
        autoCloseTags: true,
        lineNumbers: true,
        selectionPointer: true,
        matchBrackets: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        extraKeys: { 'Alt-F': 'findPersistent' },
        readOnly: true
      };
    },
    div_wrap_class() {
      if (this.loading)
        return '';
      if (
        (this.isPlain && this.fileInfoResult) ||
        (this.hasMovieInfoAction && this.movieInfo) ||
        (this.hasMovieTrailerAction && this.movieTrailer)
      )
        return 'justify-content-between';
    },
  },
  methods: {
    frameLoaded(event) {
      this.frameLoading = '';
      var frame = event.path && event.path[0];
      document.querySelector('h1.file-name').setAttribute('title', frame.title);
    },
  },
}
