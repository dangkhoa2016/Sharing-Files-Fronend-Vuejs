(function () {
  const state = {
    showModal: false,
    toastMessage: '',
    appLoaded: false,

    homeOrderBy: 'createdTime',
    numberHomeRecentItems: 10,
    numberHomeWeekSecondTab: 2,
    numberHomeWeekThirdTab: 3,

    pageSizes: [5, 10, 15, 20, 24, 30, 40, 60, 100],
    orderList: [{
      text: 'Created Time ASC',
      value: 'createdTime asc'
    }, {
      text: 'Created Time DESC',
      value: 'createdTime desc'
    }, {
      text: 'Modified Time ASC',
      value: 'modifiedTime asc'
    }, {
      text: 'Modified Time DESC',
      value: 'modifiedTime desc'
    }, {
      text: 'Recency ASC',
      value: 'recency asc'
    }, {
      text: 'Recency DESC',
      value: 'recency desc'
    }, {
      text: 'Name ASC',
      value: 'name asc'
    }, {
      text: 'Name DESC',
      value: 'name desc'
    }],
    folderBrowseOrderBy: 'name asc',
    folderBrowsePageSize: 10,
    fileBrowseOrderBy: 'recency desc',
    fileBrowsePageSize: 15,
    searchPageSize: 10,
    endpoint: 'https://gdrive-service.dangkhoa2016.workers.dev',
    server: 'random',
  };

  const mutations = {
    SET_ENDPOINT(state, payload) {
      state.endpoint = payload;
    },
    SET_SERVER(state, payload) {
      state.server = payload;
    },
    SET_TOAST_MESSAGE(state, payload) {
      state.toastMessage = payload;
    },
    SET_APP_LOADED(state, payload) {
      state.appLoaded = payload;
    },
    TOGGLE_MODAL(state, payload) {
      state.showModal = payload;
    },
    SET_NUMBER_RECENT_ITEMS(state, payload) {
      state.numberHomeRecentItems = payload;
    },
    SET_HOME_ORDER_BY(state, payload) {
      state.homeOrderBy = payload;
    },
    SET_NUMBER_HOME_WEEK_SECOND_TAB(state, payload) {
      state.numberHomeWeekSecondTab = payload;
    },
    SET_NUMBER_HOME_WEEK_THIRD_TAB(state, payload) {
      state.numberHomeWeekThirdTab = payload;
    },
    SET_FILE_BROWSE_ORDER_BY(state, payload) {
      state.fileBrowseOrderBy = payload;
    },
    SET_FILE_BROWSE_PAGE_SIZE(state, payload) {
      state.fileBrowsePageSize = payload;
    },
    SET_FOLDER_BROWSE_ORDER_BY(state, payload) {
      state.folderBrowseOrderBy = payload;
    },
    SET_FOLDER_BROWSE_PAGE_SIZE(state, payload) {
      state.folderBrowsePageSize = payload;
    },
    SET_SEARCH_PAGE_SIZE(state, payload) {
      state.searchPageSize = payload;
    },
  };

  const actions = {
    showModal({ commit }) {
      commit('TOGGLE_MODAL', true);
    },
    hideModal({ commit }) {
      commit('TOGGLE_MODAL', false);
    },
    setEndpoint({ commit }, payload) {
      commit('SET_ENDPOINT', payload);
    },
    setToastMessage({ commit }, payload) {
      commit('SET_TOAST_MESSAGE', payload);
    },
    setAppLoaded({ commit }, payload) {
      commit('SET_APP_LOADED', payload);
    },
    setNumberHomeRecentItems({ commit }, payload) {
      commit('SET_NUMBER_RECENT_ITEMS', payload);
    },
    setHomeOrderBy({ commit }, payload) {
      commit('SET_HOME_ORDER_BY', payload);
    },
    setNumberHomeWeekSecondTab({ commit }, payload) {
      commit('SET_NUMBER_HOME_WEEK_SECOND_TAB', payload);
    },
    setNumberHomeWeekThirdTab({ commit }, payload) {
      commit('SET_NUMBER_HOME_WEEK_THIRD_TAB', payload);
    },
    setFolderBrowseOrderBy({ commit }, payload) {
      commit('SET_FOLDER_BROWSE_ORDER_BY', payload);
    },
    setFileBrowseOrderBy({ commit }, payload) {
      commit('SET_FILE_BROWSE_ORDER_BY', payload);
    },
    setFolderBrowsePageSize({ commit }, payload) {
      commit('SET_FOLDER_BROWSE_PAGE_SIZE', payload);
    },
    setFileBrowsePageSize({ commit }, payload) {
      commit('SET_FILE_BROWSE_PAGE_SIZE', payload);
    },
    setServer({ commit }, payload) {
      commit('SET_SERVER', payload);
    },
    setSearchPageSize({ commit }, payload) {
      commit('SET_SEARCH_PAGE_SIZE', payload);
    },
  };

  const getters = {
    getModalState: (state) => state.showModal,
    getToastMessage: (state) => state.toastMessage,
    
    getNumberHomeRecentItems: (state) => state.numberHomeRecentItems,
    getNumberHomeWeekSecondTab: (state) => state.numberHomeWeekSecondTab,
    getNumberHomeWeekThirdTab: (state) => state.numberHomeWeekThirdTab,
    getHomeOrderBy: (state) => state.homeOrderBy,

    getFolderBrowseOrderBy: (state) => state.folderBrowseOrderBy,
    getFolderBrowsePageSize: (state) => state.folderBrowsePageSize,
    getFileBrowseOrderBy: (state) => state.fileBrowseOrderBy,
    getFileBrowsePageSize: (state) => state.fileBrowsePageSize,
    getSearchPageSize: (state) => state.searchPageSize,
    getAppLoaded: (state) => state.appLoaded,
    getEndpoint: (state) => state.endpoint,
    getOrderList: (state) => state.orderList,
    getServer: (state) => state.server,
    getPageSizes: (state) => state.pageSizes,
  };

  if (!window['store'])
    window['store'] = {};
  window['store']['appStore'] = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };
})();
