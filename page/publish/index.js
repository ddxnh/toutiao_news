/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */

// 获取频道列表
async function getChannelList() {
  const res = await axios({ url: '/v1_0/channels' })
  const channelStr = res.data.channels.map(item => {
    return `
    <option value="${item.id}">${item.name}</option>
    `
  }).join('')
  document.querySelector('.form-select').innerHTML = ' <option value="" selected="">请选择文章频道</option>' + channelStr
}
getChannelList()


/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */

// 给input绑定change事件，调用接口获取图片在线地址
document.querySelector('.img-file').addEventListener('change', async e => {
  const file = e.target.files[0]
  const fd = new FormData()
  fd.append('image', file)
  const res = await axios({
    url: '/v1_0/upload',
    method: 'POST',
    data: fd
  })
  console.log(res.data.url)
  // 将图片地址更换服务器返回回来数据
  document.querySelector('.rounded').src = res.data.url
  // 图片显示 输入框隐藏
  document.querySelector('.rounded').classList.add('show')
  document.querySelector('.place').classList.add('hide')
})

//给图片绑定点击事件 让input被点击j继续更换图片
document.querySelector('.rounded').addEventListener('click', e => {
  document.querySelector('.img-file').click()
})

/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */

// 发布文章给提交按钮绑定点击事件

document.querySelector('.send').addEventListener('click', async e => {
  if (e.target.innerHTML !== '发布') return
  // 收集表单数据
  const form = document.querySelector('.art-form')
  const data = serialize(form, { hash: true, empty: true })

  // 删除data里面多于的id属性  增加图片cover对象
  delete data.id
  data.cover = {
    type: 1, // 封面类型
    images: [document.querySelector('.rounded').src] // 封面图片 URL 网址
  }
  try {
    const res = await axios({
      url: '/v1_0/mp/articles',
      method: 'POST',
      data: data
    })
    console.log(res)
    myAlert(true, '发布文章成功')
    //  表单清空
    form.reset()
    editor.setHtml('')
    document.querySelector('.rounded').src = ''
    // 图片其余恢复
    document.querySelector('.rounded').classList.remove('show')
    document.querySelector('.place').classList.remove('hide')

    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)
  } catch (error) {
    myAlert(false, error.response.data.message)
  }
})

  /**
   * 目标4：编辑-回显文章
   *  4.1 页面跳转传参（URL 查询参数方式）
   *  4.2 发布文章页面接收参数判断（共用同一套表单）
   *  4.3 修改标题和按钮文字
   *  4.4 获取文章详情数据并回显表单
   */
  ; (function () {
    // 获取查询字符串
    const paramsStr = location.search
    const params = new URLSearchParams(paramsStr)
    params.forEach(async (value, key) => {
      if (key === 'id') {
        // 修改里面内容
        document.querySelector('.title span').innerHTML = '修改文章'
        document.querySelector('.send').innerHTML = '修改'
        // 发送请求获取对应详情数据
        const res = await axios({
          url: `/v1_0/mp/articles/${value}`
        })

        const dataObj = {
          channel_id: res.data.channel_id,
          title: res.data.title,
          rounded: res.data.cover.images[0],
          content: res.data.content,
          id: res.data.id
        }
        Object.keys(dataObj).forEach(key => {
          if (key === 'rounded') {
            document.querySelector('.rounded').src = dataObj[key]
            document.querySelector('.rounded').classList.add('show')
            document.querySelector('.place').classList.add('hide')
          } else if (key === 'content') {
            editor.setHtml(dataObj[key])
          } else {
            document.querySelector(`[name=${key}]`).value = dataObj[key]
          }
        })
      }
    })

  })();



/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */

// 给修改绑定点击事件
document.querySelector('.send').addEventListener('click', async e => {
  if (e.target.innerHTML !== '修改') return

  // 获取表单里面数据
  const form = document.querySelector('.art-form')
  const data = serialize(form, { hash: true, empty: true })

  try {
    const res = await axios({
      url: `/v1_0/mp/articles/${data.id}`,
      method: 'PUT',
      data: {
        ...data,
        cover: {
          type: document.querySelector('.rounded').src ? 1 : 0,
          images: [document.querySelector('.rounded').src]
        }
      }
    })
    myAlert(true, '修改文章成功')
    form.reset()
    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)
  } catch (error) {
    myAlert(false, error.response.data.message)
  }

})
