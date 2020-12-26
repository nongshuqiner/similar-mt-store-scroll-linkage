# similar-mt-store-scroll-linkage
微信小程序-实现类似美团外卖店铺页面滑动左右联动效果（代码案例）

### 技术点：
1.点击滚动到锚点位置：可以通过 scroll-view 的 scroll-into-view="" 属性来实现。scroll-view
2.滚动到锚点，激活相应的menu：滚动list的时候，记录 scroll-view 的 scrollTop；获取相关wxml元素的高度，根据高度算出来每个锚点的scrollTop；menu根据 scrollTop 是否滚动到相应锚点，去确定决定是否激活。
3.吸顶效果采用：position: sticky;。
4.页面滚动到后面时，左侧相应的menu可能会被隐藏，因此我们需要在左侧menu变为下面时，把左侧的向上滚动。
