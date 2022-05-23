<template>
  <div class='card'>
    <div class='card-header border-0 pt-5'>
      <h3 class='card-title align-items-start flex-column'>
        <span class='card-label fw-bolder fs-3 mb-1'>Recent</span>
        <span class='text-muted mt-1 fw-bold fs-7'>Listing top {{ numberHomeRecentItems }} items by...</span>
      </h3>
      <div class='card-toolbar'>
        <b-tabs v-model='tabIndex' no-nav-style='true' ref='tab' v-if='isCurrent'>
          <table-items v-for='tab in tabs' :key='tab.week' :tab='{ ...tab, type }' :tabKey='tabKey'></table-items>
        </b-tabs>
      </div>
    </div>

    <b-card-body :id='cardBodyId' class='py-3'></b-card-body>
  </div>
</template>

<script>
  import TableItems from './table-items.vue';

  export default {
    components: { TableItems, },
    props: {
      type: String,
      isCurrent: Boolean,
    },
    mounted() {
      this.moveTabs();
    },
    methods: {
      moveTabs() {
        if (this.$refs.tab) {
          document
            .getElementById(this.cardBodyId)
            .replaceChildren(this.$refs.tab.$refs.content);
        }
      },
    },
    data() {
      return {
        tabIndex: 0,
      };
    },
    computed: {
      ...Vuex.mapGetters({
        numberHomeRecentItems: 'appStore/getNumberHomeRecentItems',
        numberHomeWeekSecondTab: 'appStore/getNumberHomeWeekSecondTab',
        numberHomeWeekThirdTab: 'appStore/getNumberHomeWeekThirdTab',
      }),
      cardBodyId() {
        return `${this.type}-card-body`;
      },
      tabKey() {
        return this.tabs[this.tabIndex].week;
      },
      tabs() {
        return [
          { title: 'Last 7 days', week: 1 },
          { title: 'Last 2 weeks', week: this.numberHomeWeekSecondTab },
          { title: 'Last 3 weeks', week: this.numberHomeWeekThirdTab },
        ];
      },
    },
    watch: {
      isCurrent(val) {
        if (val)
          this.$nextTick(this.moveTabs);
      },
    },
  };
</script>
