<template>
  
  <div class='text-center bg-light-warning px-6 py-8 rounded-2'>
    <span class='svg-icon svg-icon-3x svg-icon-warning d-block my-2'>
      <i class='fas fa-cogs fa-2x text-warning fa-spin'></i>
    </span>
    
    <span class='text-warning fw-bold fs-6'>{{ text }}</span>
  </div>

</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: 'Loading...'
      },
    },
  };
</script>
