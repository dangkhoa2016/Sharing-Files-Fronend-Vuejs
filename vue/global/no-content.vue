<template>
  
  <div class='alert mb-0' :class='mainClass'>
    <div class='d-flex align-items-center'>
      <span class='svg-icon svg-icon-2hx svg-icon-info me-4'>
        <i class='fs-2x' :class='iconClass'></i>
      </span>
      <div class='d-flex flex-column fw-bold fs-6'>
        <slot>{{ text }}</slot>
      </div>
    </div>
    <b-button v-if='buttonReloadText' class='btn btn-sm mt-3 btn-success' @click.prevent="$emit('reload')">
      <i class='bi bi-arrow-clockwise'></i> {{ buttonReloadText }}
    </b-button>
  </div>

</template>

<script src='./no-content.js'></script>
