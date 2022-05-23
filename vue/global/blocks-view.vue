<template>

  <div v-if='hasData' class='row g-6 g-xl-9'>
    <div v-for='(item, index) in items' :key='index' :class='blocksClass'>
      <div class='card'>
        <div class='card-body d-flex flex-center flex-column pt-9 p-6'>
          <a href='#' class='symbol mb-5' :title='item.name'
            @click.prevent="$root.$emit('action', item)">
            <img :src='$icon(item.mimeType)' :alt='item.name' />
          </a>
          <a href='#' @click.prevent="$root.$emit('action', item)"
            class='fs-4 text-gray-800 text-hover-primary fw-bolder mb-1 dont-break-out'>{{ item.name }}</a>
          <div class='fw-bold text-gray-400 mb-6'>By: {{ item.owners[0].displayName }}</div>
          <div class='d-flex flex-center flex-wrap'>
            <div :title='item.createdTime | date'
              class='border border-gray-300 border-dashed rounded min-w-80px py-3 px-4 mx-2 mb-3'>
              <div class='fs-6 fw-bolder text-gray-700'>{{ item.createdTime | date(false) }}</div>
              <div class='fw-bold text-gray-400'>Created at</div>
            </div>
            <div :title='item.modifiedTime | date'
              class='border border-gray-300 border-dashed rounded min-w-80px py-3 px-4 mx-2 mb-3'>
              <div class='fs-6 fw-bolder text-gray-700'>{{ item.modifiedTime | date(false) }}</div>
              <div class='fw-bold text-gray-400'>Updated at</div>
            </div>
          </div>
          <div class='h-4px w-100 separator border-4 border-warning my-3'></div>
          <div class='mb-4'>
            <div class='dont-break-out' :title='item.mimeType'>Mime type: {{ item.mimeType }}</div>
            <div v-if='item.size' class='mt-2' :title="`In bytes: ${item.size}`">
              Size: <span :class="`badge badge-light-${$colorSize(item.size)}`">{{ $formatSize(item.size, true, 3) }}</span>
            </div>
          </div>
          <button-actions :item='item'></button-actions>
        </div>
      </div>
    </div>
  </div>

</template>

<script src='./blocks-view.js'></script>
