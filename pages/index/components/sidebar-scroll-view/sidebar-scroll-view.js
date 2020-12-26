// pages/index/components/sidebar-scroll-view/sidebar-scroll-view.js

import debounce from "../../../../utils/debounce.js"

let oldActiveKey = 0

Component({
  /**
   * 组件接受的外部样式类
   */
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollLeftHeight: 0, // scroller-left 的高
    activeKey: 0, // sidebar activeKey
    scrollLeftTop: 0, // 分类 scrollTop
    // 锚点定位 与 滚动定位相应 sidebar-menu
    scrollLocationId: null, // 滚动定位Id
    scrollRightTop: 0, // 商品 scrollTop
    productChunkRects: [], // class product-body__chunk 的 rects
    scrollTopList: [], // class product-body__chunk 的每个开始的 scrollTop
  },

  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {},
    // 在组件在视图层布局完成后执行
    ready: function () {
      this.getProductChunkRectsAndScrollTop() // 获取产品块的rects
      // 获取 scroller-left 的高
      wx.createSelectorQuery().in(this).select('#scroller-left').boundingClientRect((rect) => {
        console.log('scroller-left', rect)
        this.setData({
          scrollLeftHeight: rect.height
        })
      }).exec()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // scroll --------------------------------------------------------
    // 商品 scroll-view 滚动事件
    onScrollRightEvent(event) {
      // console.log('onScrollEvent', event, event.detail)
      const {
        scrollTop
      } = event.detail
      this.setData({
        scrollRightTop: scrollTop
      })
      debounce(500, () => {
        this.computeCurrSidebarActiveByScrollTop(scrollTop)
      })()
    },
    // scroll --------------------------------------------------------
    // 锚点定位 --------------------------------------------------------
    // 切换 sidebar
    handleSidebarChange(event) {
      // console.log('handleSidebarChange', event)
      let activeKey = event.currentTarget.dataset.index
      this.setData({
        activeKey
      })
      // 锚点定位
      this.gotoAnchorPointLocation(`anchor-point-title-${activeKey}`)
    },
    // 锚点定位与scrollTop
    gotoAnchorPointLocation(scrollLocationId) {
      // console.log('gotoAnchorPointLocation', scrollLocationId)
      this.setData({
        scrollLocationId
      })
    },
    // 锚点定位 --------------------------------------------------------
    // 滚动定位相应 sidebar-menu ----------------------------------------
    // 获取产品块的rects
    getProductChunkRectsAndScrollTop() {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      wx.createSelectorQuery().in(this).selectAll('.product-body__chunk').boundingClientRect((rects) => {
        wx.hideLoading()
        let scrollTopList = []
        let acc = rects.map(item => item.height).reduce(function (accumulator, currentValue) {
          scrollTopList.push(accumulator)
          return accumulator + currentValue
        }, 0)
        scrollTopList.push(acc)
        console.log('scrollTopList', scrollTopList)
        // console.log('getProductChunkRectsAndScrollTop', rects)
        this.setData({
          productChunkRects: rects,
          scrollTopList
        })
      }).exec()
    },
    // 通过当前滚动位置计算当前 Sidebar 的 Active
    computeCurrSidebarActiveByScrollTop(scrollTop) {
      if (this.data.productChunkRects.length !== 0) {
        let currScrollTopList = this.data.scrollTopList.filter(item => item <= scrollTop)
        let activeKey = currScrollTopList.length - 1 >= 0 ? currScrollTopList.length - 1 : 0
        // console.log(currScrollTopList, scrollTop, activeKey, oldActiveKey)
        // 不直接复制通过 this.setData({ activeKey })，为了加快渲染速度
        if (oldActiveKey !== activeKey) {
          oldActiveKey = activeKey
          this.setData({
            activeKey
          }, () => {
            // 动态显示 Sidebar 的 activeKey 处在一个合理的位置
            let scrollLeftTop = Math.floor((activeKey + 1) * 70 / this.data.scrollLeftHeight) * this.data.scrollLeftHeight - 70
            // console.log(scrollLeftTop, this.data.scrollLeftHeight)
            this.setData({
              scrollLeftTop: scrollLeftTop > 0 ? scrollLeftTop : 0
            })
          })
        }
        // console.log('----', currScrollTopList, activeKey, oldActiveKey)
      } else {
        this.getProductChunkRectsAndScrollTop()
      }
    },
    // 锚点定位 ----------------------------------------
  }
})