<template>
  <div>

  </div>
</template>

<script>
  import api from '@/api/api'
  import apiService from '@/utils/httpUtil'

  export default {
    name: "index",
    props: {
      url: {
        required: true,
        type: String
      }
    },
    methods: {
      async download() {
        try {
          // console.log(this.url)
          const res = await apiService.get(this.url, {}, false, true)
          console.log(res);
          //此处有个坑。这里用content保存文件流，最初是content=res，但下载的test.xls里的内容如下图1，
          //检查了下才发现，后端对文件流做了一层封装，所以将content指向res.data即可
          //另外，流的转储属于浅拷贝，所以此处的content转储仅仅是便于理解，并没有实际作用=_=
          const blob = new Blob([res]) //构造一个blob对象来处理数据
          const fileName = 'test.xls'

          //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
          //IE10以上支持blob但是依然不支持download
          if ('download' in document.createElement('a')) {
            //支持a标签download的浏览器
            const link = document.createElement('a') //创建a标签
            link.download = fileName //a标签添加属性
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            document.body.appendChild(link)
            link.click() //执行下载
            URL.revokeObjectURL(link.href) //释放url
            document.body.removeChild(link) //释放标签
          } else {
            //其他浏览器
            navigator.msSaveBlob(blob, fileName)
          }
        } catch (e) {
          console.log(e);
        }

      }
    }
  }
</script>

<style scoped>

</style>