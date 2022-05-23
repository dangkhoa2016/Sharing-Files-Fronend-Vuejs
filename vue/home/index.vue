<template>
  
  <b-row>
    <h1 class='text-center'>Browse by type</h1>
    <b-tabs class='my-6' nav-class='row mb-8' v-model='tabIndex' no-nav-style='true'>
      <tab-content v-for='tab in tabs' :key='tab.title' :tabKey='tabKey'
        :variant='tab.variant' :tab='tab'>
      </tab-content>
    </b-tabs>

    <top-keyword></top-keyword>
  </b-row>

</template>

<script>
  import TabContent from './tab-content.vue';
  import TopKeyword from './top-keyword.vue';
  
  export default {
    components: {
      TabContent, TopKeyword,
    },
    data() {
      return {
        tabIndex: 0,
        tabs: [
          {
            title: 'Folders',
            icon: 'bi bi-folder-fill fs-3x',
            active: true,
            type: 'folders',
            variant: 'danger',
          },
          {
            title: 'Videos',
            icon: 'bi bi-play-btn-fill fs-3x',
            active: false,
            type: 'videos',
            variant: 'primary',
          },
          {
            title: 'Images',
            icon: 'bi bi-images fs-3x',
            active: false,
            type: 'images',
            variant: 'success',
          },
          {
            title: 'Archives',
            icon: 'bi bi-file-spreadsheet-fill fs-3x',
            active: false,
            type: 'archives',
            variant: 'info',
          },
          {
            title: 'Plains',
            icon: 'bi bi-card-text fs-3x',
            active: false,
            type: 'plains',
            variant: 'warning',
          },
          {
            title: 'Offices',
            icon: 'bi bi-bank2 fs-3x',
            active: false,
            type: 'offices',
            variant: 'dark',
          },
        ]
      }
    },
    computed: {
      tabKey() {
        return this.tabs[this.tabIndex].type;
      },
    },
  };
</script>
