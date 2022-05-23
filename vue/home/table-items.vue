<template>

  <b-tab
    :title-link-class='link_class' no-body>
    <template #title>
      <span :id='buttonId'>
        {{ tab.title }}
      </span>
    </template>

    <loader v-if='loading'></loader>
    <error v-else-if='errorMessage' button-class='btn-success'
      @click='loadData(true)' :reload-text='reloadText'>
      {{ errorMessage }}
    </error>
    <list-view v-else-if='hasData' :items='items'></list-view>
    <no-content v-else @reload='loadData' button-reload-text='Reload...'>
      No item on this date range.
    </no-content>

    <b-tooltip :target='buttonId' triggers='hover'
      custom-class='tooltip-dark'>
      <div class='text-start' v-html='tooltipContent'></div>
    </b-tooltip>
  </b-tab>

</template>

<script src='./table-items.js'></script>
