export default {
  props: {
    items: Array,
    blocksClass: {
      type: String,
      default: 'col-sm-6 col-md-4 col-lg-3'
    },
  },
  computed: {
    hasData() {
      return Array.isArray(this.items) && this.items.length > 0;
    },
  },
};
