<template>

  <validation-observer v-slot='{ errors: fullErrors, invalid, reset }'>
  <div class='card'>
    <div class='card-header border-0 pt-5'>
      <h3 class='card-title align-items-start flex-column'>
        <span class='card-label fw-bolder fs-3 mb-1'>Settings</span>
        <span class='text-muted mt-1 fw-bold fs-7'>Custom demo...</span>
      </h3>
    </div>
    <div class='card-body py-3 px-0'>
      <div class='px-8'>
        <div class='row mb-6'>
          <label class='col-md-3 col-form-label required fw-bold fs-6'>Endpoint</label>
          <div class='col-md-9 fv-row fv-plugins-icon-container'>
            <input type='text' name='endpoint' disabled
              class='form-control form-control-sm form-control-solid'
            placeholder='API Endpoint' v-model='endpoint' />
          </div>
        </div>
        <div class='row'>
          <label class='col-md-3 col-form-label required fw-bold fs-6'>Token server</label>
          <div class='col-md-9 fv-row fv-plugins-icon-container'>
            <b-row>
              <b-col cols='md-6 mb-6 fv-row'>
                <b-dropdown
                  size='sm' :text='displaySelectedServer'
                  variant='primary' class='w-100'
                  menu-class='w-100'>
                  <b-dropdown-item v-for='server in serverList' :key='server.value'
                    :link-class="linkClass('server', server.value)"
                    @click.prevent='selectedServer = server.value'>{{ server.text }}</b-dropdown-item>
                </b-dropdown>
                <div class='form-text'>Service account token server</div>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>

      <separator bg-variant='warning' icon-variant='warning'></separator>

      <div class='px-8'>
        <div class='row'>
          <label class='col-md-3 col-form-label fw-bold fs-6'>Home page</label>
          <div class='col-md-9 fv-row fv-plugins-icon-container'>
            <b-row>
              <b-col cols='sm-6 mb-6 fv-row'>
                <b-dropdown
                  size='sm' :text='displaySelectedHomeOrderBy'
                  variant='primary' class='w-100'
                  menu-class='w-100'>
                  <b-dropdown-item v-for='orderBy in homeOrderList' :key='orderBy.value'
                    :link-class="linkClass('order', orderBy.value, 'Home')"
                    @click.prevent='home.selectedHomeOrderBy = orderBy.value'>{{ orderBy.text }}</b-dropdown-item>
                </b-dropdown>
                <div class='form-text'>Top [n] items order by</div>
              </b-col>
              <b-col cols='sm-6 mb-6 fv-row'>
                <validation-provider tag='div' rules='required|min_value:3|max_value:50'
                  v-slot='{ errors }'>
                  <input type='number' required
                    class='form-control form-control-sm form-control-solid'
                    :placeholder='defaultNumberHomeRecentItems' v-model='home.numberHomeRecentItems' />
                  <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
                </validation-provider>
                <div class='form-text required'>Number of recent items (required)</div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols='sm-6 mb-6 fv-row'>
                <validation-provider tag='div' name='numberHomeWeekSecondTab'
                  rules='required|not_equal_to:@numberHomeWeekThirdTab|min_value:2|max_value:10'
                  v-slot='{ errors }'>
                  <input type='number' required
                    class='form-control form-control-sm form-control-solid'
                    :placeholder='defaultNumberHomeWeekSecondTab' v-model='home.numberHomeWeekSecondTab' />
                  <div class='fv-plugins-message-container invalid-feedback'>
                    <div v-if="errors.length > 0" v-html="errors.join('<br/>')"></div>
                    <div v-else-if="isError_not_equal_to(fullErrors['numberHomeWeekThirdTab'])" class='inherit-from-observer'>
                      {{ fullErrors['numberHomeWeekThirdTab'][0] }}
                    </div>
                  </div>
                </validation-provider>
              </b-col>
              <b-col cols='sm-6 mb-6 fv-row'>
                <validation-provider tag='div' name='numberHomeWeekThirdTab'
                  rules='required|not_equal_to:@numberHomeWeekSecondTab|min_value:3|max_value:10'
                  v-slot='{ errors }'>
                  <input type='number' required
                    class='form-control form-control-sm form-control-solid'
                    :placeholder='defaultNumberHomeWeekThirdTab' v-model='home.numberHomeWeekThirdTab' />
                  <div class='fv-plugins-message-container invalid-feedback'>
                    <div v-if="errors.length > 0" v-html="errors.join('<br/>')"></div>
                    <div v-else-if="isError_not_equal_to(fullErrors['numberHomeWeekSecondTab'])" class='inherit-from-observer'>
                      {{ fullErrors['numberHomeWeekSecondTab'][0] }}
                    </div>
                  </div>
                </validation-provider>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>

      <separator bg-variant='success' icon-variant='success'></separator>

      <div class='px-8'>
        <div class='row'>
          <label class='col-md-3 col-form-label fw-bold fs-6'>Folder browse page</label>
          <div class='col-md-9 fv-row fv-plugins-icon-container'>
            <b-row>
              <b-col cols='sm-6 mb-6 fv-row'>
                <b-dropdown
                  size='sm' :text="displaySelectedOrderBy('Folder')"
                  variant='primary' class='w-100'
                  menu-class='w-100'>
                  <b-dropdown-item v-for='orderBy in orderList' :key='orderBy.value'
                    :link-class="linkClass('order', orderBy.value, 'FolderBrowse')"
                    @click.prevent='selectedFolderBrowseOrderBy = orderBy.value'>{{ orderBy.text }}</b-dropdown-item>
                </b-dropdown>
              </b-col>
              <b-col cols='sm-6 mb-6 fv-row'>
                <b-dropdown
                  size='sm' :text='`Page size: ${selectedFolderBrowsePageSize}`'
                  variant='primary' class='w-100'
                  menu-class='w-100'>
                  <b-dropdown-item v-for='pageSize in pageSizes' :key='pageSize'
                    :link-class="linkClass('size', pageSize, 'FolderBrowse')"
                    @click.prevent='selectedFolderBrowsePageSize = pageSize'>{{ pageSize }}</b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>

      <separator bg-variant='info' icon-variant='info'></separator>

      <div class='px-8'>
        <div class='row'>
          <label class='col-md-3 col-form-label fw-bold fs-6'>File browse page</label>
          <div class='col-md-9 fv-row fv-plugins-icon-container'>
            <b-row>
              <b-col cols='sm-6 mb-6 fv-row'>
                <b-dropdown
                  size='sm' :text="displaySelectedOrderBy('File')"
                  variant='primary' class='w-100'
                  menu-class='w-100'>
                  <b-dropdown-item v-for='orderBy in orderList' :key='orderBy.value'
                    :link-class="linkClass('order', orderBy.value, 'FileBrowse')"
                    @click.prevent='selectedFileBrowseOrderBy = orderBy.value'>{{ orderBy.text }}</b-dropdown-item>
                </b-dropdown>
              </b-col>
              <b-col cols='sm-6 mb-6 fv-row'>
                <b-dropdown
                  size='sm' :text='`Page size: ${selectedFileBrowsePageSize}`'
                  variant='primary' class='w-100'
                  menu-class='w-100'>
                  <b-dropdown-item v-for='pageSize in pageSizes' :key='pageSize'
                    :link-class="linkClass('size', pageSize, 'FileBrowse')"
                    @click.prevent='selectedFileBrowsePageSize = pageSize'>{{ pageSize }}</b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>

      <separator bg-variant='danger' icon-variant='danger'></separator>

      <div class='px-8'>
        <div class='row'>
          <label class='col-md-3 col-form-label fw-bold fs-6'>Search page</label>
          <div class='col-md-9 fv-row fv-plugins-icon-container'>
            <b-row>
              <b-col cols='md-6 mb-6 fv-row'>
                <b-dropdown
                  size='sm' :text='`Page size: ${selectedSearchPageSize}`'
                  variant='primary' class='w-100'
                  menu-class='w-100'>
                  <b-dropdown-item v-for='pageSize in pageSizes' :key='pageSize'
                    :link-class="linkClass('size', pageSize, 'Search')"
                    @click.prevent='selectedSearchPageSize = pageSize'>{{ pageSize }}</b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>

    <div class='card-footer d-flex justify-content-end py-6 px-9'>
      <button type='reset' @click.prevent='reset();resetForm();'
        class='btn btn-sm btn-light btn-active-light-primary me-2'>Reset</button>
      <button :disabled='invalid' type='submit'
        @click.prevent='save' class='btn btn-sm btn-warning'>Save Changes</button>
    </div>
  </div>
  </validation-observer>

</template>

<script src='./settings.js'></script>
