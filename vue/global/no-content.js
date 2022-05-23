export default {
  props: {
    buttonReloadText: {
      type: String,
    },
    bgVariant: {
      type: String,
      default: 'bg-light-info',
    },
    textVariant: {
      type: String,
      default: 'text-info',
    },
    icon: {
      type: String,
      default: 'fa fa-exclamation-triangle',
    },
  },
  data() {
    return {
      text: 'No content to show.',
    }
  },
  computed: {
    mainClass() {
      return `${this.bgVariant} ${this.textVariant}`.trim();
    },
    iconClass() {
      return `${this.icon} ${this.textVariant}`.trim();
    },
  },
};
