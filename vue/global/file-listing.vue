<template>

  <div class='main'>
    <div class='d-flex mt-3 justify-content-end'>
       <b-dropdown v-if='!isSearch' :disabled='loading' size='sm' right :text='displaySelectedOrderBy' class='me-2'>
        <b-dropdown-item v-for='orderBy in orderList' :key='orderBy.value'
          :link-class="linkClass('order', orderBy.value)"
          @click='setOrderBy(orderBy.value)'>
          {{ orderBy.text }}
        </b-dropdown-item>
      </b-dropdown>
       <b-dropdown size='sm' right :disabled='loading' :text='`Page size: ${selectedPageSize}`' class='me-2'>
        <b-dropdown-item v-for='pageSize in pageSizes' :key='pageSize'
          :link-class="linkClass('size', pageSize)"
          @click='setPageSize(pageSize)'>
          {{ pageSize }}
        </b-dropdown-item>
      </b-dropdown>
      <button class='btn btn-sm btn-icon me-1' :disabled='loading' :class="isBlocks ? 'btn-primary' : 'btn-secondary'"
        @click.prevent="setType('blocks')">
        <i class='bi bi-grid-3x3'></i>
      </button>
      <button class='btn btn-sm btn-icon' :disabled='loading' :class="isList ? 'btn-primary' : 'btn-secondary'"
        @click.prevent="setType('list')">
        <i class='bi bi-list'></i>
      </button>
    </div>

    <div :class='bodyClass'>
      <loader v-if='loading'></loader>
      <error v-else-if='errorLoadingMessage' button-class='btn-primary'
        @click='loadFiles' reload-text='Retry'>
        {{ errorLoadingMessage }}
      </error>
      <div v-else-if='hasFiles' class=''>
        <blocks-view v-if='isBlocks' :items='items'
          :blocks-class='blocksClass'></blocks-view>
        <div class='card' v-if='isList'>
          <div class='card-body py-3'>
            <list-view :items='items'></list-view>
          </div>
        </div>
      </div>
      <no-content v-else @reload='loadFiles' button-reload-text='Retry'>
        No items found.
      </no-content>

      <ul v-if='hasFiles || pageNumber > 1' class='pagination pagination-outline my-6 my-xl-9'>
        <li class='page-item m-1'>
          <button class='btn btn-sm btn-white text-hover-primary'
            @click.prevent='loadPrevPage'
            :disabled='loading || pageNumber <= 1'><i class='fa fa-arrow-left'></i> Previous</button>
        </li>
        <li class='page-item m-1'>
          <button class='btn btn-sm btn-white text-hover-primary'
            @click.prevent='loadNextPage'
            :disabled='loading || !hasFiles ||!hasNextPage'>Next <i class='fa fa-arrow-right'></i></button>
        </li>
      </ul>
    </div>
  </div>

</template>

<script src='./file-listing.js'></script>
