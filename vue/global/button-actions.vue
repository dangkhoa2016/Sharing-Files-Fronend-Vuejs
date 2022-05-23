<template>

  <b-dropdown split split-variant='light-primary'
    size='sm' variant='light-dark' :title="`Id: ${item.id}`"
    @click.prevent="$root.$emit('action', item, mainText)" :text='mainText' right>
    <b-dropdown-item v-if='$isFolder(item.mimeType)' @click.prevent='setModalStatisticFolder(item)'
      link-class='bg-hover-light-info text-hover-info py-2'>
      Statistic
    </b-dropdown-item>
    <b-dropdown-item v-else-if='$isVideo(item.mimeType) || $canView(item)'
      link-class='bg-hover-light-success text-hover-success py-2'>
      Download
    </b-dropdown-item>
    <b-dropdown-item
      link-class='bg-hover-light-danger text-hover-danger py-2'
      @click.prevent='setClipboard(item.id)'>
      Copy ID
    </b-dropdown-item>
    <b-dropdown-item v-if='$isVideo(item.mimeType)' @click.prevent="movieAction('info')"
      link-class='bg-hover-light-warning text-hover-warning py-2'>
      Movie info
    </b-dropdown-item>
    <b-dropdown-item v-if='$isVideo(item.mimeType)' @click.prevent="movieAction('trailer')"
      link-class='bg-hover-light-warning text-hover-warning py-2'>
      Video trailer
    </b-dropdown-item>
    <b-dropdown-item v-if='showModalFullPath' @click.prevent='setModalFullPathItem(item)'
      link-class='bg-hover-light-warning text-hover-warning py-2'>
      Show full path
    </b-dropdown-item>
  </b-dropdown>

</template>

<script src='./button-actions.js'></script>
