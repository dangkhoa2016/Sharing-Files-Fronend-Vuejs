<template>

  <div class='container-fluid bg-white d-flex flex-stack flex-wrap gap-2 fixed-top'>
    <div class='d-flex flex-column align-items-start justify-content-center flex-wrap me-lg-2 my-2'>
      <h1 class='d-flex flex-column text-dark fw-bolder my-0 fs-1'>
        <b-link :to="{ name: 'home' }">File Sharing Demo</b-link>
      </h1>
      <ul class='breadcrumb breadcrumb-dot fw-bold fs-base my-1'>
        <router-link v-for='link in links' :key='link.text'
          :to='link.to' custom v-slot='{ href, navigate, isActive }'>
          <li class='breadcrumb-item'>
            <b-link :class="isActive ? 'text-dark active' : 'text-muted'"
            :active='isActive' :href='href' @click='navigate'>{{ link.text }}</b-link>
          </li>
        </router-link>
      </ul>
    </div>
    <div class='d-flex align-items-center flex-shrink-0 mb-3 mb-md-0'>
      <div class='d-flex align-items-center'>
        <search-top></search-top>
      </div>
      <div class='d-flex align-items-center ms-3 ms-lg-4'>
        <b-link :to="{ name: 'settings' }"
          class='btn btn-sm btn-color-gray-700 btn-active-color-primary btn-outline btn-outline-secondary'
          :class="$route.name === 'settings' ? 'active' : ''">
          <i class='fonticon-sun fs-2'></i> Settings
        </b-link>
      </div>
    </div>
  </div>

</template>

<script src='./nav-header.js'></script>
