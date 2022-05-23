import Latest from './latest.vue';

export default {
  components: {
    Latest,
  },
  props: {
    tab: Object,
    tabKey: String,
    variant: String,
  },
  data() {
    return {
      loading: false,
      link_class:
        'nav-link btn btn-flex btn-outline btn-outline-default ' +
        'd-flex flex-grow-1 flex-column flex-center py-5 h-lg-175px',
      items: []
    };
  },
  computed: {
    active_class() {
      return `btn-active-${this.variant}`;
    },
    text_class() {
      return `text-active-inverse-${this.variant} text-${this.variant} text-hover-inverse-${this.variant}`;
    },
    icon_class() {
      return `${this.tab.icon} text-${this.variant}`;
    },
    isCurrent() {
      return this.tab && this.tabKey === this.tab.type;
    },
  },
};
