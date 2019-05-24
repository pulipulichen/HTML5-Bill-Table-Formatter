Vue.config.productionTip = false
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
      let header = '本期交易明細'
      let output  = this.input.slice(this.input.indexOf(header) + header.length).trim()
      
      let footer = '您的信用卡循環信用利率為'
      output = output.slice(0, output.indexOf(footer)).trim()
      // 先取得頭跟尾
      
      // -------------
      // 再來把它換成表格
      
      let table = $(`<table border="1" cellpadding="0" cellspacing="0">
                        <thead></thead>
                        <tbody></tbody>
                     </table>`)
      let tbody = table.find('tbody')
      output.split('\n').forEach((line) => {
        line = line.trim()
        let tr = $('<tr></tr>').appendTo(tbody)
        if (line.startsWith('1')) {
          // 表示這是一般支付
          
          let dateFields = line.slice(0, 19).split(' ')
          //$(`<td>${dateFields}</td>`).appendTo(tr)
          
          
          let fieldShoppingDate = dateFields[0].trim()
          //$(`<td>${fieldShoppingDate}</td>`).appendTo(tr)
          let fieldChargeDate = dateFields[1].trim()
          //$(`<td>${fieldShoppingDate}</td>`).appendTo(tr)
          
          // 再從尾巴找回來
          let tabSpaces = '   '
          let lastSpacesPos = line.lastIndexOf(tabSpaces)
          let fieldNTDPrice = line.slice(lastSpacesPos).trim()
          //$(`<td>${fieldNTDPrice}</td>`).appendTo(tr)
          
          let last2Line = line.slice(0, lastSpacesPos).trim()
          let last2SpacesPos = last2Line.lastIndexOf(tabSpaces, lastSpacesPos - 1)
          let fieldOriginalPrice = last2Line.slice(last2SpacesPos).trim()
          //console.log([last2SpacesPos, lastSpacesPos])
          //$(`<td>${fieldOriginalPrice}</td>`).appendTo(tr)
          
          let last3Line = last2Line.slice(0, last2SpacesPos).trim()
          let last3SpacesPos = last3Line.lastIndexOf(tabSpaces, last2SpacesPos - 1)
          let fieldCurrency = last3Line.slice(last3SpacesPos).trim()
          //$(`<td>${fieldCurrency}</td>`).appendTo(tr)
          
          let last4Line = last3Line.slice(0, last3SpacesPos).trim()
          //console.log(last4Line)
          let last4SpacesPos = last4Line.lastIndexOf('  ')
          //console.log(last4SpacesPos)
          if (last4SpacesPos === -1 || last4SpacesPos < 30) {
            last4SpacesPos = last4Line.lastIndexOf('　')
            
          }
          let fieldLocation = last4Line.slice(last4SpacesPos).trim()
          if (fieldLocation.endsWith('%') || fieldLocation.endsWith('扣')) {
            fieldLocation = ''
          }
          //$(`<td>${fieldLocation}</td>`).appendTo(tr)
          
          if (last4SpacesPos === -1) {
            last4SpacesPos = last3SpacesPos
          }
          let fieldTitle = line.slice(19, last4SpacesPos).trim()
          while (fieldTitle.endsWith('　')) {
            fieldTitle = fieldTitle.slice(0, fieldTitle.length - 1)
          }
          
          if (fieldTitle.indexOf(' (自動分期 ') > 0 
                  && fieldTitle.indexOf(')分') > 0) {
            fieldTitle = fieldTitle.replace(' (自動分期 ', ' <br />(自動分期 ')
            fieldTitle = fieldTitle.replace(')分', ')<br />分')
          }
          
          $(`<td valign="top" class="shopping-date">${fieldShoppingDate}</td>`).appendTo(tr)
          $(`<td valign="top" class="charge-date">${fieldChargeDate}</td>`).appendTo(tr)
          $(`<td valign="top" class="description">${fieldTitle}</td>`).appendTo(tr)
          $(`<td valign="top" class="location">${fieldLocation}</td>`).appendTo(tr)
          $(`<td valign="top" class="currency">${fieldCurrency}</td>`).appendTo(tr)
          $(`<td valign="top" class="original-price">${fieldOriginalPrice}</td>`).appendTo(tr)
          $(`<td valign="top" class="ntd-price">${fieldNTDPrice}</td>`).appendTo(tr)
        }
        else if (line.startsWith('應付')) {
          console.log(line)
          let td = tbody.find('td.description:last')
          //console.log(td.length)
          
          td.html(td.html() + '<br />' + line.split('　').join('<br />'))
        }
      })
      
      
      return table.prop('outerHTML')
    },
    outputTitle: function () {
      let header = '\n  TWD         1'
      let pos1 = this.input.indexOf(header) + header.length - 1
      let pos2 = this.input.indexOf(' ', pos1)
      let title = this.input.slice(pos1, pos2).trim()
      
      let yearMingGou = parseInt(title.slice(0, 3), 10)
      let year = yearMingGou + 1911
      title = year + title.slice(3)
      
      title = title.split('/').join('')
      title = '兆豐信用卡帳單' + title
      return title
    }
  },
  created: function () {
    $(this.$refs.modal).find('.ui.dropdown').dropdown()
    
    // 載入檔案
    $.get('./data.txt', (data) => {
      this.input = data
    })
  },
  methods: {
    persist: function () {
      VueHelper.persist(this, 'fileType')
    },
    reset: function () {
      this.input = ''
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
