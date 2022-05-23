export default {
  data() {
    return {
      topList: [{
        type: 'Encoder',
        most_keywords: ['FGT', 'NOGRP', 'SWTYBLZ', 'B0MBARDiERS', 'OLDTiME', 'SURCODE', 'WATCHABLE']
      },
      {
        type: 'Recent search',
        most_keywords: ['Spider-Man No Way Home', 'Scream.2022',
          'The Godfather', 'Venom.Let.There.Be.Carnage.2021',
          'Resident.Evil.Welcome.to.Raccoon.City',
          'Robot.Carnival.1987', 'Silent.Night.2021', 'The.Karate.Kid']
      }],
      variant: ['info', 'success', 'warning', 'dark', 'danger', 'primary']
    };
  },
  methods: {
    color(index) {
      const is_light = true;
      index = index % this.variant.length;
      const color = (is_light ? 'light-' : '') + this.variant[index];
      return `me-3 mb-3 d-flex align-items-center cursor-pointer badge badge-${color}`;
    },
  },
};
