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
    results: {},
    searching: false,
    errorSearchMessage: null,
  };

  const mutations = {
    TOGGLE_SEARCHING(state, payload) {
      state.searching = payload;
    },
    SET_ERROR_SEARCH_MESSAGE(state, payload) {
      state.errorSearchMessage = payload;
    },
    SET_CACHE_RESULT_FILES(state, payload) {
      state.results = { ...state.results, ...payload };
    },
    RESET_CACHE_RESULT_FILES(state) {
      state.results = {};
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
    setErrorSearchMessage({ commit }, payload) {
      commit('SET_ERROR_SEARCH_MESSAGE', payload);
    },
    showSearching({ commit }) {
      commit('TOGGLE_SEARCHING', true);
    },
    hideSearching({ commit }) {
      commit('TOGGLE_SEARCHING', false);
    },
    clearCacheForKeyword({ commit }, keyword) {
      if (!keyword)
        return;
      commit('SET_CACHE_RESULT_FILES', {
        [keyword]: {
          cache: [],
          nextPageToken: null
        }
      });
    },
    resetCacheResultFiles({ commit }) {
      commit('RESET_CACHE_RESULT_FILES');
    },
    search(context, { keyword, pageSize } = {}) {
      if (!keyword)
        return;
      var { commit, state: { results }, rootState: { appStore: { endpoint, server, searchPageSize } } } = context;

      return new Promise(resolve => {
        commit('TOGGLE_SEARCHING', true);
        commit('SET_ERROR_SEARCH_MESSAGE', null);

        let pageToken = '';
        if (!results[keyword])
          results[keyword] = { cache: [], nextPageToken: '' };
        folderArr = results[keyword].cache || [];
        pageToken = results[keyword].nextPageToken || '';

        if (!pageSize)
          pageSize = searchPageSize;

        fetchData(`${endpoint}/search?keyword=${keyword}&page_size=${pageSize}&page_token=${pageToken}&server=${server}`)
          .then(json => {
            updatePaging(results[keyword], json.files, pageToken);

            commit('SET_CACHE_RESULT_FILES', {
              [keyword]: {
                cache: results[keyword].cache,
                nextPageToken: json.files.length > 0 ? json.nextPageToken : pageToken,
              }
            });
            commit('TOGGLE_SEARCHING', false);

            resolve();
          }).catch(ex => {
            console.log('Error fetch', ex);
            commit('TOGGLE_SEARCHING', false);
            commit('SET_ERROR_SEARCH_MESSAGE', 'Something error with server.');
            resolve();
          });
      });
    },
  };

  const getters = {
    getSearching: (state) => state.searching,
    getErrorSearchMessage: (state) => state.errorSearchMessage,
    getFiles: (state) => (keyword, pageNumber) => {
      if (!keyword)
        return [];

      if (!pageNumber)
        pageNumber = 1;
      pageNumber = parseInt(pageNumber);
      if (isNaN(pageNumber) || pageNumber < 1)
        pageNumber = 1;

      var pageFiles = state.results[keyword] &&
        state.results[keyword].cache &&
        state.results[keyword].cache.find(f => f.page === pageNumber);
      return (pageFiles && pageFiles.files) || [];
    },
    hasNextPage: (state) => (keyword, pageNumber) => {
      if (!keyword)
        return false;
      var hasNextPageToken = (state.results[keyword].nextPageToken || '').length > 0;
      if (hasNextPageToken)
        return true;

      const folderArr = state.results[keyword].cache || [];
      if (folderArr.length > 0)
        return folderArr.findIndex(f => f.page === pageNumber) !== -1;

      return false;
    },
  };

  if (!window['store'])
    window['store'] = {};
  window['store']['searchStore'] = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };
})();
