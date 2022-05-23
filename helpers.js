
(function () {
  const mimeTypeIcons = {
    'application/x-gzip': 'https://cdn-icons-png.flaticon.com/128/7327/7327728.png',
    'application/x-tar': 'https://cdn-icons-png.flaticon.com/128/3979/3979421.png',
    'application/x-rar': 'https://cdn-icons-png.flaticon.com/128/6354/6354326.png',
    'application/x-compressed': 'https://cdn-icons-png.flaticon.com/128/3979/3979411.png',
    'application/x-zip-compressed': 'https://cdn-icons-png.flaticon.com/128/3979/3979411.png',
    'application/vnd.google-apps.folder': 'https://cdn-icons-png.flaticon.com/128/1333/1333744.png',
    'application/vnd.oasis.opendocument.presentation': 'https://drive-thirdparty.googleusercontent.com/128/type/application/vnd.oasis.opendocument.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'https://cdn-icons-png.flaticon.com/128/3050/3050245.png',
    'application/pdf': 'https://cdn-icons-png.flaticon.com/128/2305/2305982.png',
    'application/vnd.oasis.opendocument.text': 'https://drive-thirdparty.googleusercontent.com/128/type/application/vnd.oasis.opendocument.text',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'https://drive-thirdparty.googleusercontent.com/128/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/x-vnd.oasis.opendocument.spreadsheet': 'https://cdn-icons-png.flaticon.com/128/732/732220.png',
    'application/vnd.ms-excel': 'https://drive-thirdparty.googleusercontent.com/128/type/application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'https://drive-thirdparty.googleusercontent.com/128/type/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword': 'https://drive-thirdparty.googleusercontent.com/128/type/application/msword',
    'application/vnd.google-apps.presentation': 'https://drive-thirdparty.googleusercontent.com/128/type/application/vnd.google-apps.presentation',
    'application/vnd.google-apps.document': 'https://drive-thirdparty.googleusercontent.com/128/type/application/vnd.google-apps.document',
    'application/vnd.google-apps.spreadsheet': 'https://drive-thirdparty.googleusercontent.com/128/type/application/vnd.google-apps.spreadsheet',
    'application/rtf': 'https://cdn-icons-png.flaticon.com/128/1126/1126899.png',
    'audio/mpeg': 'https://cdn-icons-png.flaticon.com/128/2904/2904752.png',
    'audio/x-wav': 'https://cdn-icons-png.flaticon.com/128/2904/2904750.png',
    'image/bmp': 'https://cdn-icons-png.flaticon.com/128/1829/1829586.png',
    'image/png': 'https://cdn-icons-png.flaticon.com/128/2924/2924661.png',
    'image/jpeg': 'https://cdn-icons-png.flaticon.com/128/7331/7331657.png',
    'image/webp': 'https://cdn-icons-png.flaticon.com/128/2659/2659360.png',
    'video/x-matroska': 'https://cdn-icons-png.flaticon.com/128/7398/7398996.png',
    'video/mp4': 'https://cdn-icons-png.flaticon.com/128/7390/7390638.png',
    'video/x-flv': 'https://cdn-icons-png.flaticon.com/128/916/916132.png',
    'text/plain': 'https://cdn-icons-png.flaticon.com/128/4021/4021726.png',
    'text/html': 'https://cdn-icons-png.flaticon.com/128/2867/2867342.png',
    'text/csv': 'https://cdn-icons-png.flaticon.com/128/2305/2305906.png',
    'text/x-sh': 'https://cdn-icons-png.flaticon.com/128/708/708922.png',
    'unknown': 'https://cdn-icons-png.flaticon.com/128/7395/7395603.png',
  };

  const strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  Vue.use(VueViewer.default);
  Vue.use(VueClipboard);
  Vue.use(window.VueCodemirror);

  Vue.prototype.$handleJson = (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  };

  Vue.filter('date', function (date, full = true) {
    if (typeof date === 'string')
      date = Date.parse(date);
    if (date) {
      if (typeof date.getDate !== 'function')
        date = new Date(date);
      var d = date.getDate();
      var m = strArray[date.getMonth()];
      var y = date.getFullYear();
      if (full) {
        var mm = date.getMinutes();
        var hh = date.getHours();
        return `${d <= 9 ? '0' + d : d} ${m} ${y} ${hh <= 9 ? '0' + hh : hh}:${mm <= 9 ? '0' + mm : mm}`;
      }

      return `${d <= 9 ? '0' + d : d} ${m} ${y}`;
    }
  });

  Vue.filter('to_yes_no', function (value) {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return 'Not set';
  });

  Vue.prototype.$colorSize = function (size) {
    if (size < 10 * 1000 * 1000) return 'dark';
    else if (size < 100 * 1000 * 1000) return 'warning';
    else if (size < 1000 * 1000 * 1000) return 'info';
    else if (size < 10000 * 1000 * 1000) return 'success';
    else if (size < 50000 * 1000 * 1000) return 'danger';
    return 'primary';
  };

  Vue.prototype.$formatSize = function (bytes, si = false, dp = 1) {
    if (bytes === null || bytes === undefined)
      return '0';

    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    };

    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
  };

  Vue.prototype.$weekRange = function (weekNumber) {
    if (weekNumber < 1)
      weekNumber = 1;

    var fromNum = 7 * weekNumber;
    var fromDate = new Date();
    fromDate.setSeconds(0);
    if (fromNum > 0)
      fromDate.setDate(fromDate.getDate() - fromNum);
    var toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 7);
    return [fromDate, toDate];
  };

  Vue.filter('formatNumber', function (num, thousand = ',') {
    if (typeof num !== 'number')
      num = parseInt(num) || 0;
    num = '' + num;
    x = num.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + thousand + '$2');
    }
    return x1 + x2;
  });

  Vue.prototype.$icon = function (mime) {
    mime = (mime || '').toLowerCase();
    if (mimeTypeIcons[mime])
      return mimeTypeIcons[mime];
    return mimeTypeIcons['unknown'];
  };


  Vue.prototype.$canView = function (item) {
    return item && (this.$isPreviewable(item.mimeType) || this.$isPlainTextByFileName(item.name));
  };

  Vue.prototype.$isFolder = function (mime) {
    mime = (mime || '').toLowerCase();
    return mime === 'application/vnd.google-apps.folder';
  };

  function mimeTypeContains(mime, text) {
    mime = (mime || '').toLowerCase();
    text = (text || '').toLowerCase();
    return mime.indexOf(text) === 0;
  };

  Vue.prototype.$isImage = function (mime) {
    return mimeTypeContains(mime, 'image/');
  };

  Vue.prototype.$isVideo = function (mime) {
    return mimeTypeContains(mime, 'video/');
  };

  Vue.prototype.$isPlainTextByMimeType = function (mime) {
    mime = (mime || '').toLowerCase();
    return mimeTypeContains(mime, 'text/') || mime.indexOf('application/vnd.google-apps.document') === 0;
  };

  Vue.prototype.$isPlainTextByFileName = function (name) {
    name = (name || '').toLowerCase();
    return name && (/\.(nfo|bash|sh|log|vtt|text|srt)$/i).test(name);
  };

  Vue.prototype.$isCSV = function (mime) {
    mime = (mime || '').toLowerCase();
    return mimeTypeContains(mime, 'text/csv') || mime.indexOf('application/vnd.google-apps.spreadsheet') === 0;
  };

  Vue.prototype.$isGoogleDoc = function (mime) {
    mime = (mime || '').toLowerCase();
    return mime.indexOf('application/vnd.google-apps.') === 0;
  };

  Vue.prototype.$isPreviewable = function (mime) {
    return this.$isGoogleDoc(mime) || this.$isImage(mime) || this.$isPlainTextByMimeType(mime);
  };



  const regexYoutube = /^.*(youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)(?<id>[^#\&\?]*).*/i;
  const regexVimeo = /(?:http|https)?:?\/?\/?(?:www\.)?(?:player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(?<id>\d+)(?:|\/\?)/i;

  function GetVideoId(url, type) {
    url = url || '';
    var match = ((type || '').toLowerCase() === 'vimeo') ? regexVimeo.exec(url) : regexYoutube.exec(url);
    if (match && match.groups)
      return match.groups['id'];
    else if (url.length < 10)
      return url;
  };

  Vue.prototype.$getVimeoId = function (url) { return GetVideoId(url, 'vimeo'); };

  Vue.prototype.$getYouTubeID = function (url) { return GetVideoId(url, 'youtube'); };

  Vue.prototype.$getEmbedUrl = function (url) {
    var id = GetVideoId(url, 'youtube');

    if (id)
      return `https://www.youtube.com/embed/${id}`;
    id = GetVideoId(url, 'vimeo');

    if (id)
      return `https://player.vimeo.com/video/${id}`;
  };

  const regexQuality = /2160p|1080p|720p|.4k.|-4k-/i;
  const movieNameRemoveWords = ['_', 'RECONSTRUCTED.VERSION', 'directors.cut', 'THEATRICAL', 'remastered', '-aka-', '.aka.', ' aka ', '.UNCUT.'];

  function simpleTrim(str, c) {
    if (c === "]") c = "\\]";
    if (c === "^") c = "\\^";
    if (c === "\\") c = "\\\\";
    return str.replace(new RegExp(
      "^[" + c + "]+|[" + c + "]+$", "g"
    ), "");
  };

  Vue.prototype.$extractName = function (name) {
    var seg = (name || '').split(regexQuality)[0];
    if (seg && seg !== name) {
      seg = simpleTrim(seg, ',-. ');
      for (let item of movieNameRemoveWords)
        seg = seg.replace(new RegExp(item.toLowerCase(), 'i'), '-');
      return simpleTrim(seg, ',-. ');
    }
  };
})();