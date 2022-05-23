<template>
  <b-tab
    title-item-class='nav-item col-12 col-sm-6 col-md mb-5 mb-lg-0'
    :title-link-class="`${link_class} ${active_class} ${text_class}`"
  >
    <template #title>
      <span class='mb-5 mx-0'>
        <b-spinner type='border' v-if='loading'></b-spinner>
        <i v-else :class='icon_class'></i>
      </span>
      <span class='fs-6 fw-bold'>{{ tab.title }}</span>
    </template>

    <latest :type='tab.type' :is-current='isCurrent'></latest>
  </b-tab>
</template>

<script src='./tab-content.js'></script>
