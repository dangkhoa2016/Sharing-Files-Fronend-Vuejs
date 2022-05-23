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

  const types = ['folders', 'videos', 'images', 'archives', 'offices', 'plains'];
  const state = {};
  for (let type of types) {
    state[type] = { data: {}, error: {} };
  }

  const mutations = {
    SET_TYPE_DATA(state, { type, week, data }) {
      const update = { data: { ...state[type].data, ...{ ['week_' + week]: data } } };
      state[type] = { ...state[type], ...update };
    },
    SET_ERROR_TYPE_DATA(state, { type, week, message }) {
      state[type].error['week_' + week] = message;
    },
    CLEAR_ALL_DATA(state) {
      for (let type of types) {
        state[type] = { data: {}, error: {} };
      }
    },
  };

  const actions = {
    setTypeData({ commit }, payload) {
      commit('SET_TYPE_DATA', payload);
    },
    clearAllData({ commit }) {
      commit('CLEAR_ALL_DATA');
    },
    setErrorTypeData({ commit }, payload) {
      commit('SET_ERROR_TYPE_DATA', payload);
    },
    getTypeData(context, { type, week, fromDate, toDate }) {
      const { commit, rootState: { appStore: { endpoint, server, homeOrderBy, numberHomeRecentItems } } } = context;
      commit('SET_ERROR_TYPE_DATA', { type, week, message: '' });

      return new Promise(resolve => {
        if (!type || !week)
          return resolve([]);

        fetchData(`${endpoint}/home?type=${type}&page_size=${numberHomeRecentItems}&order_by=${homeOrderBy}` +
          `&from_date=${fromDate.toISOString()}&to_date=${toDate.toISOString()}&server=${server}`)
          .then(json => {
            commit('SET_TYPE_DATA', { type, week, data: json ? (json.files || []) : [] });
            resolve();
          }).catch(ex => {
            console.log('Error fetch', ex);
            commit('SET_ERROR_TYPE_DATA', { type, week, message: ex.message });
            resolve();
          });
      });
    }
  };

  function getStateField(sta, field, type, week)  {
    if (!type || !week)
      return [];

    return sta[type][field]['week_' + week];
  };

  const getters = {
    getFiles: (state) => (type, week) => getStateField(state, 'data', type, week),
    getErrorLoadingFilesMessage: (state) => (type, week) => getStateField(state, 'error', type, week),
  };

  if (!window['store'])
    window['store'] = {};
  window['store']['homeStore'] = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };
})();
