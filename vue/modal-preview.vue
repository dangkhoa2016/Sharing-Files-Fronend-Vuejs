<template>

  <b-modal v-model='modalShow' static id='modal-preview'
    ok-only button-size='sm' ok-title='Close'
    @show='onShow' @hide='onHide' size=''
    header-class='py-2' footer-class='py-2'
    dialog-class='modal-fullscreen'>
    <template #modal-header='{ close }'>
      <h5>Preview</h5>
      <button type='button' class='btn btn-icon btn-sm btn-light-primary ms-2' data-bs-dismiss='modal' aria-label='Close' @click.prevent='close()'>
        <i class='bi bi-x-square-fill'></i>
      </button>
    </template>

    <preview-item @reload='doPreview'></preview-item>
    
    <template #modal-footer='{ ok }'>
      <a href='#' class='btn btn-outline btn-sm btn-outline-dashed btn-outline-primary btn-active-light-primary' @click.prevent='ok'>Close</a>
    </template>
  </b-modal>

</template>

<script src='./modal-preview.js'></script>
