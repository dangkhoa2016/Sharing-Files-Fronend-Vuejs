<template>

  <div v-if='hasData' class='table-responsive'>
    <table class='table align-middle gs-0 gy-3 min-h-200px'>
      <tbody>
        <tr v-for='item in items' :key='item.id'>
          <td class='w-5'>
            <a href='#' :title='item.name'
              @click.prevent="$root.$emit('action', item)">
              <img class='w-50px' :src='$icon(item.mimeType)' :alt='item.name' />
            </a>
          </td>
          <td class='w-40 dont-break-out min-w-200px'>
            <a href='#' @click.prevent="$root.$emit('action', item)"
              class='text-dark text-hover-primary mb-1 fs-6' :title='item.name'>{{ item.name }}</a>
            <span class='text-muted fw-bold d-block fs-7'>By: {{ item.owners[0].displayName }}</span>
          </td>
          <td class='w-20'>
            <span class='text-muted d-block fs-7 mb-1'>Created at: <span class='d-block badge badge-secondary'>{{ item.createdTime | date }}</span></span>
            <span class='text-muted d-block fs-7'>Updated at: <span class='d-block badge badge-secondary'>{{ item.modifiedTime | date }}</span></span>
          </td>
          <td class='d-none text-center d-lg-table-cell w-20'>
            <span class='text-muted fw-bold'>{{ item.mimeType }}</span>
          </td>
          <td class='w-10 text-end'>
            <span v-if='item.size' class='mb-2 d-block'
              :title="`In bytes: ${item.size}`">Size: <span :class="`badge badge-light-${$colorSize(item.size)}`">{{ $formatSize(item.size, true, 3) }}</span>
            </span>

            <button-actions :item='item'></button-actions>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
  export default {
    props: {
      items: Array,
    },
    computed: {
      hasData() {
        return Array.isArray(this.items) && this.items.length > 0;
      },
    },
  };
</script>
