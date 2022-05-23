(async function () {

  const loadHtml = function (file) {
    return new Promise((resolve, reject) => {
      fetch(`/${file}.html`)
        .then(res => res.text())
        .then(html => {
          app.html = html;
          resolve();
        }).catch(ex => console.log(ex));
    });
  };

  await loadHtml('app');

  loadModule('/vue/main.vue', window.options)
    .then(component => {
      window.app = new Vue(component).$mount('#app');
    });

})();
