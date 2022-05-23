<template>

  <b-modal v-model='modalShow' no-close-on-backdrop
    @show='onShow' @hide='onHide'
    ok-only button-size='sm' size='lg' ok-title='Close'
    id='modal-statistic-folder' centered
    header-class='py-2' footer-class='py-2'>
    <template #modal-header='{ close }'>
      <h5>Statistic</h5>
      <button type='button' class='btn btn-icon btn-sm btn-light-primary ms-2' data-bs-dismiss='modal' aria-label='Close' @click.prevent='close()'>
        <i class='bi bi-x-square-fill'></i>
      </button>
    </template>

    <div class='card bg-transparent card-xl-stretch'>
      <div class='card-body p-0'>
        <div class='px-9 pt-7 card-rounded h-225px h-sm-250px h-md-275px w-100' :class='bgClass'>
          <div class='d-flex text-center flex-column text-white pt-4'>
            <span class='fw-bolder fs-2 fs-sm-1 pt-1'>{{ modalStatisticFolder && modalStatisticFolder.name }}</span>
          </div>
        </div>

        <div class='bg-body shadow-sm card-rounded mx-9 px-6 py-9 mb-4 position-relative z-index-1' style='margin-top: -100px;'>
          <div class='d-flex align-items-center mb-6'>
            <div class='symbol symbol-45px w-40px me-5'>
              <span class='symbol-label'>
                <img :src="$icon('application/vnd.google-apps.folder')" class='w-75' />
              </span>
            </div>

            <div class='d-flex align-items-center flex-wrap w-100'>
              <div class='mb-1 pe-3 flex-grow-1'>
                <span class='fs-5 text-gray-800 text-hover-primary fw-bolder'>Folders:</span>
              </div>

              <div class='badge badge-light fw-bold fw-bolder fs-5 text-gray-800 p-4'>{{ totalFolders | formatNumber }}</div>
            </div>
          </div>

          <div class='d-flex align-items-center mb-6'>
            <div class='symbol symbol-45px w-40px me-5'>
              <span class='symbol-label'>
                <img :src="$icon('unknown')" class='w-75' />
              </span>
            </div>

            <div class='d-flex align-items-center flex-wrap w-100'>
              <div class='mb-1 pe-3 flex-grow-1'>
                <span class='fs-5 text-gray-800 text-hover-primary fw-bolder'>Files:</span>
              </div>

              <div class='badge badge-light fw-bold fw-bolder fs-5 text-gray-800 p-4'>{{ totalFiles | formatNumber }}</div>
            </div>
          </div>

          <div class='d-flex align-items-center mb-6'>
            <div class='symbol symbol-45px w-40px me-5'>
              <span class='symbol-label'>
                <i class='fa text-warning fs-2x fa-atom'></i>
              </span>
            </div>

            <div class='d-flex align-items-center flex-wrap w-100'>
              <div class='mb-1 pe-3 flex-grow-1'>
                <span class='fs-5 text-gray-800 text-hover-primary fw-bolder'>Human-Readable size:</span>
              </div>

              <div class='badge badge-light fw-bold fw-bolder fs-5 text-gray-800 p-4'>{{ $formatSize(totalSize, true, 3) }}</div>
            </div>
          </div>

          <div class='d-flex align-items-center'>
            <div class='symbol symbol-45px w-40px me-5'>
              <span class='symbol-label'>
                <i class='fa fa-biohazard fs-2x'></i>
              </span>
            </div>

            <div class='d-flex align-items-center flex-wrap w-100'>
              <div class='mb-1 pe-3 flex-grow-1'>
                <span class='fs-5 text-gray-800 text-hover-primary fw-bolder'>Total size:</span>
              </div>

              <div class='badge badge-light fw-bold fw-bolder fs-5 text-gray-800 p-4'>{{ totalSize }}</div>
            </div>
          </div>
        </div>

        <div v-if='processing' class='text-center'>
          <div class='progress'>
            <div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar'
              aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'>
            </div>
          </div>
          Running...
        </div>
        <error v-else-if='errorCalculate' button-class='btn-success'
          @click='run' reload-text='Calculate again'>
          <div v-html='errorCalculate'></div>
        </error>
      </div>
    </div>

    <template #modal-footer='{ ok }'>
      <button class='btn btn-sm btn-light-success'
        :disabled='processing' @click.prevent='run'>
        <i class='bi bi-arrow-clockwise'></i>Recalculate
      </button>
      <a href='#' class='btn btn-outline btn-sm btn-outline-dashed btn-outline-primary btn-active-light-primary'
        @click.prevent='ok'>Close</a>
    </template>
  </b-modal>

</template>

<script src='./modal-statistic-folder.js'></script>
