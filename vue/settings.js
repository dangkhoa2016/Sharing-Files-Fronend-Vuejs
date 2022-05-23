import Separator from './separator.vue';
const { ValidationProvider, ValidationObserver, extend, } = window.VeeValidate;
const { required, min_value, max_value } = window.VeeValidateRules;

extend('required', {
  ...required,
  message: 'Please enter a value.',
});
extend('min_value', {
  ...min_value,
  message: 'Number must be greater than or equal to {min}.',
});
extend('max_value', {
  ...max_value,
  message: 'Number must be less than or equal to {max}.',
});
extend('not_equal_to', {
  params: ['target'],
  validate(value, { target }) {
    return Number(value) !== Number(target);
  },
  message: 'Numbers must not be the same.'
});

export default {
  components: {
    Separator,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      endpoint: '',
      selectedServer: '',
      serverList: [
        { text: 'Random', value: 'random', },
        { text: 'Rails', value: 'rails', },
        { text: 'Netcore', value: 'netcore', },
        { text: 'Nodejs', value: 'nodejs', }
      ],
      homeOrderList: [
        { text: 'Created Time DESC', value: 'createdTime', },
        { text: 'Modified Time DESC', value: 'modifiedTime', }
      ],
      home: {
        selectedHomeOrderBy: '',
        numberHomeRecentItems: 0,
        numberHomeWeekSecondTab: 0,
        numberHomeWeekThirdTab: 0,
      },
      selectedFolderBrowseOrderBy: '',
      selectedFolderBrowsePageSize: 0,
      selectedFileBrowseOrderBy: '',
      selectedFileBrowsePageSize: 0,
      selectedSearchPageSize: 0,
    }
  },
  computed: {
    ...Vuex.mapGetters({
      defaultNumberHomeRecentItems: 'appStore/getNumberHomeRecentItems',
      defaultNumberHomeWeekSecondTab: 'appStore/getNumberHomeWeekSecondTab',
      defaultNumberHomeWeekThirdTab: 'appStore/getNumberHomeWeekThirdTab',
      defaultHomeOrderBy: 'appStore/getHomeOrderBy',

      defaultFolderBrowseOrderBy: 'appStore/getFolderBrowseOrderBy',
      defaultFolderBrowsePageSize: 'appStore/getFolderBrowsePageSize',
      defaultFileBrowseOrderBy: 'appStore/getFileBrowseOrderBy',
      defaultFileBrowsePageSize: 'appStore/getFileBrowsePageSize',
      defaultSearchPageSize: 'appStore/getSearchPageSize',
      defaultEndpoint: 'appStore/getEndpoint',
      defaultServer: 'appStore/getServer',
      orderList: 'appStore/getOrderList',
      pageSizes: 'appStore/getPageSizes',
    }),
    displaySelectedServer() {
      if (!this.selectedServer)
        return;
      else
        return this.serverList.find(s => s.value === this.selectedServer).text;
    },
    displaySelectedHomeOrderBy() {
      if (!this.home.selectedHomeOrderBy)
        return;
      else
        return `Order by: ${this.homeOrderList.find(o => o.value === this.home.selectedHomeOrderBy).text}`;
    },
  },
  methods: {
    ...Vuex.mapActions({
      setNumberHomeRecentItems: 'appStore/setNumberHomeRecentItems',
      setHomeOrderBy: 'appStore/setHomeOrderBy',
      setNumberHomeWeekSecondTab: 'appStore/setNumberHomeWeekSecondTab',
      setNumberHomeWeekThirdTab: 'appStore/setNumberHomeWeekThirdTab',

      setFolderBrowseOrderBy: 'appStore/setFolderBrowseOrderBy',
      setFolderBrowsePageSize: 'appStore/setFolderBrowsePageSize',
      setFileBrowseOrderBy: 'appStore/setFileBrowseOrderBy',
      setFileBrowsePageSize: 'appStore/setFileBrowsePageSize',
      setSearchPageSize: 'appStore/setSearchPageSize',
      setEndpoint: 'appStore/setEndpoint',
      setServer: 'appStore/setServer',
      setToastMessage: 'appStore/setToastMessage',
      clearAllHomeData: 'homeStore/clearAllData',
    }),
    resetForm() {
      this.endpoint = this.defaultEndpoint;
      this.selectedServer = this.defaultServer;

      this.home.numberHomeRecentItems = this.defaultNumberHomeRecentItems;
      this.home.selectedHomeOrderBy = this.defaultHomeOrderBy;
      this.home.numberHomeWeekSecondTab = this.defaultNumberHomeWeekSecondTab;
      this.home.numberHomeWeekThirdTab = this.defaultNumberHomeWeekThirdTab;

      this.selectedFolderBrowsePageSize = this.defaultFolderBrowsePageSize;
      this.selectedFolderBrowseOrderBy = this.defaultFolderBrowseOrderBy;
      this.selectedFileBrowsePageSize = this.defaultFileBrowsePageSize;
      this.selectedFileBrowseOrderBy = this.defaultFileBrowseOrderBy;
      this.selectedSearchPageSize = this.defaultSearchPageSize;
    },
    displaySelectedOrderBy(type) {
      if (this[`selected${type}BrowseOrderBy`])
        return `Order by: ${this.orderList.find(o => o.value === this[`selected${type}BrowseOrderBy`]).text}`;
    },
    save() {
      this.setHomeOrderBy(this.home.selectedHomeOrderBy);
      const numberHomeWeekSecondTab = Number(this.home.numberHomeWeekSecondTab);
      const numberHomeWeekThirdTab = Number(this.home.numberHomeWeekThirdTab);
      this.setNumberHomeRecentItems(Number(this.home.numberHomeRecentItems));
      this.setNumberHomeWeekSecondTab(numberHomeWeekSecondTab);
      this.setNumberHomeWeekThirdTab(numberHomeWeekThirdTab);

      this.setFolderBrowseOrderBy(this.selectedFolderBrowseOrderBy);
      this.setFolderBrowsePageSize(this.selectedFolderBrowsePageSize);
      this.setFileBrowseOrderBy(this.selectedFileBrowseOrderBy);
      this.setFileBrowsePageSize(this.selectedFileBrowsePageSize);
      this.setSearchPageSize(this.selectedSearchPageSize);
      // this.setEndpoint(this.endpoint);
      this.setServer(this.selectedServer);
      this.clearAllHomeData();
      this.setToastMessage(`Settings was saved.`);
    },
    linkClass(type, value, for_object) {
      var isActive = false;
      if (type === 'order')
        isActive = value === this[`selected${for_object}OrderBy`];
      else if (type === 'size')
        isActive = value === this[`selected${for_object}PageSize`];
      else
        isActive = value === this.selectedServer;

      return `dropdown-item py-2 px-5 bg-hover-light-info text-hover-info${isActive ? ' text-info bg-light-info' : ''}`;
    },
    isError_not_equal_to(arr) {
      return Array.isArray(arr) && arr.length > 0 && arr[0] === 'Numbers must not be the same.';
    }
  },
  mounted() {
    this.resetForm();
  },
}
