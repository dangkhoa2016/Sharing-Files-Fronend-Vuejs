<template>
  
  <form autocomplete='off' class='w-300px w-sm-350px position-relative'>
    <input type='hidden'>

    <span title='Click to search' @click.prevent='goToSearch'
      class='cursor-pointer svg-icon svg-icon-2 svg-icon-lg-3 svg-icon-gray-800 position-absolute top-50 translate-middle-y ms-5'>
      <i class='bi bi-search'></i>
    </span>
    
    <input title='Enter to search' type='text' class='search-input form-control form-control-sm form-control-solid ps-13'
      v-model='search' placeholder='Search...'
      @keydown.enter.prevent='goToSearch' />
    
    <span v-if='searching' class='position-absolute top-50 end-0 translate-middle-y lh-0 me-5'>
      <span class='spinner-border h-15px w-15px align-middle text-gray-400'></span>
    </span>
    <span v-else-if='search.length > 0' title='Clear keyword' @click.prevent="search = ''"
      class='btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-4'>
      <i class='bi bi-x-circle'></i>
    </span>
  </form>
</template>

<script src='./search-top.js'></script>
