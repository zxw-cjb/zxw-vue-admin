import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  /*
  获取品牌属性一级分类列表
  */
  getCategorys1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: 'GET',
    })
  },

  /*
  获取品牌属性二级分类列表
  */
  getCategorys2(getCategory1Id) {
    return request({
      url: `${api_name}/getCategory2/${getCategory1Id}`,
      method: 'GET',
    })
  },

  /*
  获取品牌属性三级分类列表
  */
  getCategorys3(getCategory2Id) {
    return request({
      url: `${api_name}/getCategory3/${getCategory2Id}`,
      method: 'GET',
    })
  },

  /*
  获取品牌属性列表
  */
  getAttrList({
    category1Id,
    category2Id,
    category3Id
  }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: 'GET',
    })
  },

  /*
  删除属性
  */
  deleteAttr(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: 'DELETE',
    })
  },

  /*
  获取属性的属性
  */
  getAttrValueList(attrId) {
    return request({
      url: `${api_name}/getAttrValueList/${attrId}`,
      method: 'GET',
    })
  },

  /*
   保存属性
   */
  saveAttrInfo(attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: 'POST',
      data: attr
    })
  },
}
