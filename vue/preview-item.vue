<template>

  <div class='flex-column h-100 d-flex h-100cal' :class='div_wrap_class'>
    <h1 class='mb-3 file-name dont-break-out text-center'>{{ currentFile && currentFile.name }}</h1>

    <loader v-if='loading'></loader>
    <error v-else-if='errorLoadingMessage' button-class='btn-success'
      @click="$emit('reload')" reload-text='Reload...'>
      {{ errorLoadingMessage }}
    </error>
    <div v-else-if='isVideo' class='h-100cal'>
      <iframe v-if='hasMovieInfoAction && movieInfo' type='text/html' :title='movieInfo.snippet'
        allowfullscreen frameborder='0' class='h-100 w-100' :allow='frameAllow'
        @load='frameLoaded' :class='frameLoading' :src='movieInfo.link'></iframe>
      <no-content v-else-if='hasMovieInfoAction && !movieInfo'
        @reload="$emit('reload')" button-reload-text='Search again'>
        Can't find movie information.
      </no-content>
      
      <iframe v-if='hasMovieTrailerAction && movieTrailer' :src='movieTrailer.link'
        class='frame-video w-100 mh-100' :title='movieTrailer.snippet' allowfullscreen
        @load='frameLoaded' :class='frameLoading' frameborder='0' :allow='frameAllow'></iframe>
      <no-content v-else-if='hasMovieTrailerAction && !movieTrailer'
        @reload="$emit('reload')" button-reload-text='Search again'>
        No trailer found.
      </no-content>
    </div>
    <div v-else-if='fileInfoResult' class='h-100cal'>
      <div v-if='isCSV' class='h-100 overflow-auto'>
        <div class='card'>
          <div class='card-body px-4 pb-3'>
            <div class='table-responsive'>
              <table class='table table-row-bordered table-row-gray-300 align-middle gx-5 gy-3 table-striped table-rounded border'
                v-html='csvToTable'></table>
            </div>
          </div>
        </div>
      </div>
      <codemirror v-else-if='isPlain' class='p-3 bg-white rounded h-100 overflow-auto'
        v-model='fileInfoResult' :options='codemirror_options'></codemirror>
    </div>
    <no-content v-else @reload="$emit('reload')" button-reload-text='Reload...'>
      Can't load file content.
    </no-content>
  </div>

</template>

<script src='./preview-item.js'></script>
