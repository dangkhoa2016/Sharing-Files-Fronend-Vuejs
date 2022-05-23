(function () {
  function fetchData(url) {
    return new Promise(resolve => {
      fetch(url, {
        method: 'get', headers: { 'Content-Type': 'application/json' },
      })
        .then(gatherResponse)
        .then(json => resolve(json));
    })
  };

  async function gatherResponse(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }

    const { headers } = response;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json'))
      return response.json();

    /*
    if (contentType.includes('application/text')) {
      return response.text();
    } else if (contentType.includes('text/html')) {
      return response.text();
    }
    */

    return response.text();
  };

  const state = {
    folders: {},
    filesOnly: {
      cache: [],
      nextPageToken: null
    },
    currentFile: null,
    fileInfoResult: null,
    currentFolderId: '#',
    loadingFiles: {},
    loadingFile: null,
    errorLoadingFilesMessage: {},
    errorLoadingFileMessage: null,
    movieTrailer: null,
    movieInfo: null,
    modalBrowseFolder: null,
    modalFullPathItem: null,
    modalStatisticFolder: null,
    modalBrowseFolderOpened: false,
  };

  const mutations = {
    SET_FOLDER_FILES(state, payload) {
      state.folders = { ...state.folders, ...payload };
    },
    RESET_FOLDER_FILES(state) {
      state.folders = {};
    },
    SET_FILES_ONLY_FILES(state, payload) {
      state.filesOnly = payload;
    },
    SET_MOVIE_TRAILER(state, payload) {
      state.movieTrailer = payload;
    },
    SET_MOVIE_INFO(state, payload) {
      state.movieInfo = payload;
    },
    SET_LOADING_FILES(state, payload) {
      state.loadingFiles = { ...state.loadingFiles, ...payload };
    },
    SET_LOADING_FILE(state, payload) {
      state.loadingFile = payload;
    },
    SET_ERROR_LOADING_FILES_MESSAGE(state, payload) {
      state.errorLoadingFilesMessage = { ...state.errorLoadingFilesMessage, ...payload };
    },
    SET_ERROR_LOADING_FILE_MESSAGE(state, payload) {
      state.errorLoadingFileMessage = payload;
    },
    SET_CURRENT_FOLDER_ID(state, payload) {
      state.currentFolderId = payload;
    },
    SET_MODAL_BROWSE_FOLDER(state, payload) {
      state.modalBrowseFolder = payload;
    },
    SET_MODAL_FULL_PATH_ITEM(state, payload) {
      state.modalFullPathItem = payload;
    },
    SET_MODAL_BROWSE_FOLDER_OPENED(state, payload) {
      state.modalBrowseFolderOpened = payload;
    },
    SET_MODAL_STATISTIC_FOLDER(state, payload) {
      state.modalStatisticFolder = payload;
    },
    SET_CURRENT_FILE(state, payload) {
      state.currentFile = payload;
    },
    SET_FILE_INFO_RESULT(state, payload) {
      state.fileInfoResult = payload;
    },
  };

  const updatePaging = (results, arrFiles = [], pageToken) => {
    var folderArr = (results && results.cache) || [];
    pageToken = pageToken || '';
    if ((results.nextPageToken || '') === pageToken && folderArr.length > 0) {
      if (folderArr[folderArr.length - 1].files.length === 0)
        folderArr[folderArr.length - 1].files = arrFiles;
      else
        folderArr.push({ files: arrFiles, page: folderArr.length + 1 });
    }
    else
      folderArr.push({ files: arrFiles, page: folderArr.length + 1 });

    results.cache = folderArr;
  };

  const actions = {
    setLoadingFiles({ commit }, payload) {
      commit('SET_LOADING_FILES', payload);
    },
    showLoadingFile({ commit }) {
      commit('SET_LOADING_FILE', true);
    },
    hideLoadingFile({ commit }) {
      commit('SET_LOADING_FILE', false);
    },
    setErrorLoadingFile({ commit }, payload) {
      commit('SET_ERROR_LOADING_FILE_MESSAGE', payload);
    },
    setMovieTrailer({ commit }, payload) {
      commit('SET_MOVIE_TRAILER', payload);
    },
    setMovieInfo({ commit }, payload) {
      commit('SET_MOVIE_INFO', payload);
    },
    setFileInfoResult({ commit }, payload) {
      commit('SET_FILE_INFO_RESULT', payload);
    },
    setErrorLoadingFiles({ commit }, payload) {
      commit('SET_ERROR_LOADING_FILES_MESSAGE', payload);
    },
    setFolderFiles({ commit }, payload) {
      commit('SET_FOLDER_FILES', payload);
    },
    setFilesOnly({ commit }, payload) {
      commit('SET_FILES_ONLY_FILES', payload);
    },
    setCurrentFile({ commit }, payload) {
      commit('SET_CURRENT_FILE', payload);
    },
    setCurrentFolderId({ commit }, payload) {
      commit('SET_CURRENT_FOLDER_ID', payload);
    },
    setModalBrowseFolder({ commit, dispatch }, payload) {
      commit('SET_MODAL_BROWSE_FOLDER', payload);
      dispatch('setModalBrowseFolderOpened', payload ? true : false);
    },
    setModalFullPathItem({ commit }, payload) {
      commit('SET_MODAL_FULL_PATH_ITEM', payload);
    },
    setModalBrowseFolderOpened({ commit }, payload) {
      commit('SET_MODAL_BROWSE_FOLDER_OPENED', payload);
    },
    setModalStatisticFolder({ commit }, payload) {
      commit('SET_MODAL_STATISTIC_FOLDER', payload);
    },
    clearCacheFolder({ commit }, id) {
      commit('SET_FOLDER_FILES', {
        [id]: {
          cache: [],
          nextPageToken: null
        }
      });
    },
    resetCacheFolderFiles({ commit }) {
      commit('RESET_FOLDER_FILES');
    },
    clearCacheFilesOnly({ commit }) {
      commit('SET_FILES_ONLY_FILES', {
        cache: [],
        nextPageToken: null
      });
    },
    loadFilesOnly(context, { pageSize, orderBy } = {}) {
      var { commit, state: { filesOnly }, rootState: { appStore: { endpoint, server, fileBrowsePageSize, fileBrowseOrderBy } } } = context;

      return new Promise(resolve => {
        commit('SET_LOADING_FILES', { filesOnly: true });
        commit('SET_ERROR_LOADING_FILES_MESSAGE', { filesOnly: null });
        const pageToken = filesOnly.nextPageToken || '';

        if (!pageSize)
          pageSize = fileBrowsePageSize;
        if (!orderBy)
          orderBy = fileBrowseOrderBy;

        fetchData(`${endpoint}/files?page_size=${pageSize}&page_token=${pageToken}&order_by=${orderBy}&server=${server}`)
          .then(json => {
            updatePaging(filesOnly, json.files, pageToken);

            commit('SET_FILES_ONLY_FILES', {
              ...filesOnly,
              nextPageToken: json.files.length > 0 ? json.nextPageToken : pageToken,
            });
            commit('SET_LOADING_FILES', { filesOnly: false });

            resolve();
          }).catch(ex => {
            console.log('Error fetch', ex);
            commit('SET_LOADING_FILES', { filesOnly: false });
            commit('SET_ERROR_LOADING_FILES_MESSAGE', { filesOnly: 'Something error with server.' });
            resolve();
          });
      });
    },
    listChildItems(context, { pageSize, orderBy } = {}) {
      var { commit, state: { folders, currentFolderId }, rootState: {
        appStore: { endpoint, server, folderBrowseOrderBy, folderBrowsePageSize } }
      } = context;
      currentFolderId = currentFolderId || '#';

      return new Promise(resolve => {
        commit('SET_LOADING_FILES', { [currentFolderId]: true });
        commit('SET_ERROR_LOADING_FILES_MESSAGE', { [currentFolderId]: null });

        if (!pageSize)
          pageSize = folderBrowsePageSize;
        if (!orderBy)
          orderBy = folderBrowseOrderBy;

        let pageToken = '';
        if (!folders[currentFolderId])
          folders[currentFolderId] = { cache: [], nextPageToken: '' };
        folderArr = folders[currentFolderId].cache || [];
        pageToken = folders[currentFolderId].nextPageToken || '';

        fetchData(`${endpoint}/in_folder?id=${currentFolderId}&page_size=${pageSize}&page_token=${pageToken}&order_by=${orderBy}&server=${server}`)
          .then(json => {
            updatePaging(folders[currentFolderId], json.files, pageToken);

            commit('SET_FOLDER_FILES', {
              [currentFolderId]: {
                cache: folders[currentFolderId].cache,
                nextPageToken: json.files.length > 0 ? json.nextPageToken : pageToken,
              }
            });
            commit('SET_LOADING_FILES', { [currentFolderId]: false });

            resolve();
          }).catch(ex => {
            console.log('Error fetch', ex);
            commit('SET_LOADING_FILES', { [currentFolderId]: false });
            commit('SET_ERROR_LOADING_FILES_MESSAGE', { [currentFolderId]: 'Something error with server.' });
            resolve();
          });
      });
    },
    loadFileInfo(context) {
      var { commit, state: { currentFile }, rootState: { appStore: { endpoint, server } } } = context;
      return new Promise(async (resolve) => {
        commit('SET_LOADING_FILE', true);
        commit('SET_ERROR_LOADING_FILE_MESSAGE', null);

        fetchData(`${endpoint}/view?id=${currentFile.id}&server=${server}`)
          .then(plain => {
            commit('SET_FILE_INFO_RESULT', plain.error ? `Can't load file content: ${plain.error}` : plain);
            commit('SET_LOADING_FILE', false);

            resolve();
          }).catch(ex => {
            console.log('Error fetch', ex);
            commit('SET_LOADING_FILE', false);
            commit('SET_ERROR_LOADING_FILE_MESSAGE', 'Something error with server.');
            resolve();
          });
      });
    },
    searchMovieTrailer(context, name) {
      var { commit, rootState: { appStore: { endpoint, server } } } = context;
      return new Promise(async (resolve) => {
        commit('SET_LOADING_FILE', true);
        commit('SET_ERROR_LOADING_FILE_MESSAGE', null);

        fetchData(`${endpoint}/movie_trailer?name=${name}&server=${server}`)
          .then(json => {
            let { link, snippet } = json || {};
            commit('SET_LOADING_FILE', false);
            commit('SET_MOVIE_TRAILER', { link, snippet });

            resolve();
          }).catch(ex => {
            console.log('Error fetch', ex);
            commit('SET_LOADING_FILE', false);
            commit('SET_ERROR_LOADING_FILE_MESSAGE', 'Something error with server.');
            resolve();
          });
      });
    },
    searchMovieInfo(context, name) {
      var { commit, rootState: { appStore: { endpoint, server } } } = context;
      return new Promise(async (resolve) => {
        commit('SET_LOADING_FILE', true);
        commit('SET_ERROR_LOADING_FILE_MESSAGE', null);

        fetchData(`${endpoint}/movie_info?name=${name}&server=${server}`)
          .then(json => {
            let { link, snippet } = json || {};
            link = link.replace('www.imdb.com', 'imdb.dangkhoa2016.workers.dev');
            commit('SET_LOADING_FILE', false);
            commit('SET_MOVIE_INFO', { link, snippet });

            resolve();
          }).catch(ex => {
            console.log('Error fetch', ex);
            commit('SET_LOADING_FILE', false);
            commit('SET_ERROR_LOADING_FILE_MESSAGE', 'Something error with server.');
            resolve();
          });
      });
    },
  };

  function parsePageNumber(pageNumber) {
    if (!pageNumber)
      pageNumber = 1;
    pageNumber = parseInt(pageNumber);
    if (isNaN(pageNumber) || pageNumber < 1)
      pageNumber = 1;
    return pageNumber;
  }

  function internalHasNextPage(obj, pageNumber) {
    pageNumber = parsePageNumber(pageNumber);
    var hasNextPageToken = (obj.nextPageToken || '').length > 0;
    if (hasNextPageToken)
      return true;

    const folderArr = obj.cache || [];
    if (folderArr.length > 0)
      return folderArr.findIndex(f => f.page === pageNumber) !== -1;
    else
      return false;
  };

  function internalGetFiles(obj, pageNumber) {
    pageNumber = parsePageNumber(pageNumber);
    const pageFiles = obj && obj.cache && obj.cache.find(f => f.page === pageNumber);
    return (pageFiles && pageFiles.files) || [];
  };

  const getters = {
    getFiles: (state) => (type, pageNumber) => {
      if (!type)
        return [];

      if (type.toLowerCase() === 'folders') {
        var currentFolderId = state.currentFolderId || '#';
        if (!state[type][currentFolderId])
          return [];
        else
          return internalGetFiles(state[type][currentFolderId], pageNumber);
      }

      return internalGetFiles(state[type], pageNumber);
    },
    getLoadingFiles: (state) => (type) => {
      return state.loadingFiles[type];
    },
    getLoadingFile: (state) => state.loadingFile,
    getFileInfoResult: (state) => state.fileInfoResult,
    getCurrentFolderId: (state) => state.currentFolderId,
    getModalBrowseFolder: (state) => state.modalBrowseFolder,
    getModalFullPathItem: (state) => state.modalFullPathItem,
    getModalStatisticFolder: (state) => state.modalStatisticFolder,
    getCurrentFile: (state) => state.currentFile,
    getErrorLoadingFilesMessage: (state) => (type) => {
      return state.errorLoadingFilesMessage[type];
    },
    getErrorLoadingFileMessage: (state) => state.errorLoadingFileMessage,
    getMovieInfo: (state) => state.movieInfo,
    getMovieTrailer: (state) => state.movieTrailer,
    getModalBrowseFolderOpened: (state) => state.modalBrowseFolderOpened,
    hasNextPage: (state) => (type, pageNumber) => {
      if (type.toLowerCase() === 'folders') {
        var currentFolderId = state.currentFolderId || '#';
        if (!state[type][currentFolderId])
          return false;
        else
          return internalHasNextPage(state[type][currentFolderId], pageNumber);
      }

      return internalHasNextPage(state[type], pageNumber);
    },
  };

  if (!window['store'])
    window['store'] = {};
  window['store']['browseStore'] = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };
})();
