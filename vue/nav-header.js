import SearchTop from './search-top.vue';

export default {
  components: { SearchTop, },
  data() {
    return {
      links: [{
        to: { name: 'folders-browse' },
        text: 'Browse'
      }, {
        to: { name: 'files-browse' },
        text: 'Files only'
      }, {
        to: { name: 'search' },
        text: 'Search'
      },
      ],
    }
  },
};
