var app = new Vue({
  el: '#app',
  data: {
    input: '',
    fileType: 'ods'
  },
  mounted() {
    VueHelper.mount(this, 'fileType')
  },
  computed: {
    output: function () {
      let output = []
      for (let i = 0; i < 100; i++) {
        output.push('<div>Hello, world.</div>')
      }
      return output.join('<br />')
    }
  },
  created: function () {
    $(this.$refs.modal).find('.ui.dropdown').dropdown()
  },
  methods: {
    persist: function () {
      VueHelper.persist(this, 'fileType')
    },
    upload: function () {
      
    },
    download: function () {
      let filetypeExt = this.fileType
      
      let filename = this.count + 'MobilePhoneNumbers-' + DateHelper.getCurrentTimeString() + '.' + filetypeExt
      let content = this.phoneNumbers
      
      if (['csv', 'txt'].indexOf(filetypeExt) > -1) {
        if (filetypeExt === 'csv') {
          content = 'Mobile Phone Numbers\n' + content
        }

        DownloadHelper.downloadAsFile(filename, content)
        //console.log(this.phoneNumbers)
      }
      else if (filetypeExt === 'ods') {
        let data = {
          "data": []
        }
        
        content.split('\n').forEach((line) => {
          if (typeof(line) !== 'string' || line.trim() === '') {
            return
          }
          line = line.trim()
          data.data.push({
            'Mobile Phone Numbers': line
          })
        })
        
        xlsx_helper_ods_download(filename, data)
      }
    }
  }
  /*
  methods: {
    
  }
  */
})
