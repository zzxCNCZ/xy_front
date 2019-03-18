export default {
  namespaced: true,
  state: {
    ueConfig: {
      zIndex: 2999,
      // toolbars: [
      //   ['undo', 'redo', 'indent', 'bold', 'italic', '|', 'fontfamily', 'fontsize', '|', 'template'],
      //   ['justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', 'print', 'preview']
      // ],
      // 工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的重新定义
      toolbars: [[
        'fullscreen', 'source', '|', 'undo', 'redo', '|',
        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
        'directionalityltr', 'directionalityrtl', 'indent', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
        'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
        'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
        'print', 'preview', 'searchreplace', 'drafts', 'help'
      ]],
      // theme: 'gray',
      elementPathEnabled: false,
      wordCount: false,
      serverUrl: ''
    }
  },
  mutations: {
  }
}
