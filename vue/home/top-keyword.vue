<template>

  <b-col class='mb-6'>
    <div class='card'>
      <div class='card-header border-0 pt-5'>
        <h3 class='card-title align-items-start flex-column'>
          <span class='card-label fw-bolder fs-3 mb-1'>Top keyword</span>
          <span class='text-muted mt-1 fw-bold fs-7'>Most search tag...</span>
        </h3>
      </div>

      <b-card-body class='py-3'>
        <div v-for='(top, indx) in topList' :key='indx' class='mb-5'>
          <h5 class='text-muted mb-3'>By {{ top.type }}</h5>
          <div class='d-flex flex-wrap'>
            <span v-for='(item, index) in top.most_keywords'
              :title="`Click to search for ${item}`"
              @click="$router.push({ name: 'search', query: { keyword: item } })"
              :class='color(index)' :key='index'>{{ item }}</span>
          </div>
        </div>
      </b-card-body>
    </div>
  </b-col>

</template>

<script src='./top-keyword.js'></script>
