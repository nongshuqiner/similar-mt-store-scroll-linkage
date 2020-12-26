// pages/index/index.js

import dataJson from '../../data/data'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    submitLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(dataJson.result)
    setTimeout(() => {
      this.setData({
        list: dataJson.result
      })
    }, 1500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})