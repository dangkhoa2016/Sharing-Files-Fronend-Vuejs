<template>

  <b-modal v-model='modalShow' static id='modal-path'
    ok-only button-size='sm' ok-title='Close' centered
    @show='onShow' @hide='onHide' size='lg' no-close-on-backdrop
    header-class='py-2' footer-class='py-2'>
    <template #modal-header='{ close }'>
      <h5>Full folder path</h5>
      <button type='button' class='btn btn-icon btn-sm btn-light-primary ms-2' data-bs-dismiss='modal' aria-label='Close' @click.prevent='close()'>
        <i class='bi bi-x-square-fill'></i>
      </button>
    </template>

    <h3 class='text-center mb-4'>{{ itemName }}</h3>

    <b-card no-body>
      <b-card-body class='px-4 py-3'>
        <ol v-if='hasData' class='breadcrumb text-muted fs-6 fw-bold'>
          <li v-for='folder in arrPaths' :key='folder.id' class='breadcrumb-item pe-3'>
            <a href='#' class='' @click.prevent='showFolder(folder)'>{{ folder.name }}</a>
          </li>
        </ol>
        <span v-else>...</span>
      </b-card-body>
    </b-card>
    
    <div v-if='processing' class='text-center mt-4'>
      <div class='progress'>
        <div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar'
          aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'>
        </div>
      </div>
      Locating...
    </div>
    <error v-else-if='errorRun' button-class='btn-success'
      @click='run' reload-text='Check again'>
      <div v-html='errorRun'></div>
    </error>

    <template #modal-footer='{ ok }'>
      <button class='btn btn-sm btn-light-success'
        :disabled='processing' @click.prevent='run'>
        <i class='bi bi-arrow-clockwise'></i>Re check
      </button>
      <a href='#' class='btn btn-outline btn-sm btn-outline-dashed btn-outline-primary btn-active-light-primary' @click.prevent='ok'>Close</a>
    </template>
  </b-modal>

</template>

<script src='./modal-path.js'></script>
