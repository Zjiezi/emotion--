<template>
  <div class="body">
    <Layout class="body">
      <nav>
        <div class="logo">
          <a href="index.html">
            E
            <em>motion</em>
          </a>
        </div>
        <div class="menu-icon">
          <span></span>
        </div>
      </nav>

      <Content>
        <Row>
          <Col span="24">
            <Scroll :on-reach-bottom="handleReachBottom" :height="2000" >
                  <!-- 这里将排名前三的情绪加载出来 -->
              <div class="container" >
                <div class="text-center tm-site-header">
                  <section id="main">
                    <div class="inner">
                      <!-- One -->
                      <div id="one" class="wrapper style1">
                        <div class="image fit flush">
                          <img src="../../../assets/images/pic02.jpg" alt>
                        </div>
                        <header class="special">
                          <h2>多年</h2>
                          <p>戒子</p>
                        </header>
                        <div class="content">
                          <p>夜又深</p>
                          <p>眸中迷离着天花板</p>
                          <p>绵羊也已经数好几万</p>
                          <p>睫毛无缘缠绵</p>
                          <p>类似我的胆怯</p>
                          <p>怕一合眼</p>
                          <p>记忆又无可幸免</p>
                          <p>我畏冷</p>
                          <p>无论天气还是人心</p>
                          <p>想来明天又不尽人意</p>
                          <p>南面无风的窗</p>
                          <p>星星在捉迷藏</p>
                          <p>刚抖落烟灰</p>
                          <p>又点亮了远方</p>
                          <p>有人说放不下的心</p>
                          <p>大都擅长埋葬</p>
                          <p>只可惜来年春临</p>
                          <p>总会发芽成长</p>
                          <p>春天藏于人生后面</p>
                          <p>子弹埋伏的旧患</p>
                          <p>留下伤后的结痂</p>
                          <p>最后生出思想</p>
                          <p>燃了所有运气的祈祷</p>
                          <p>不知所措的碰面</p>
                          <p>总将涟漪打乱</p>
                          <p>怀念陷入喉咙酝酿</p>
                          <p>生涩问候</p>
                          <p>针线缝住思念不许讲</p>
                          <p>只准祝福</p>
                          <p>你的目光从远方进场</p>
                          <p>枝丫被阳光清扫</p>
                          <p>斑驳纷纷扬扬</p>
                          <p>枯叶催促着脚步</p>
                          <p>拘谨招呼</p>
                          <p>眼底的安静终究只是</p>
                          <p>多年不见</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
              <Card
                dis-hover
                v-for="(item, index) in list1"
                :key="index"
                :bordered="false"
                class="tm-card"
              >
                <div class="container tm-container-2">
                  <!-- 这里将情绪组件加载出来 -->
                  <div class="tm-timeline-item">
                    <div class="tm-timeline-item-inner">
                      <img
                        src="../../../assets/images/img-01.jpg"
                        alt="Image"
                        class="tm-img-timeline"
                      >
                      <div class="tm-timeline-connector">
                        <p class="mb-0">&nbsp;</p>
                      </div>
                      <div class="tm-timeline-description-wrap">
                        <div class="tm-bg-dark tm-timeline-description">
                          <!-- 题目 -->
                          <h5 class="tm-text-green tm-font-400">一代宗师</h5>
                          <!-- 内容 -->
                          <p>人生若无悔，该有多无趣啊。</p>
                          <!-- 时间 -->
                          <p class="tm-text-green float-right mb-0">2018-11-30</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Scroll>
          </Col>
        </Row>
      </Content>
    </Layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  methods: {
    handleReachBottom() {
      alert(1);
      return new Promise(resolve => {
        setTimeout(() => {
          const last = this.list1[this.list1.length - 1];
          for (let i = 1; i < 11; i++) {
            this.list1.push(last + i);
          }
          resolve();
        }, 1000);
      });
    }
  }
};
</script>

<style scoped>
@import "../../../assets/css/user.css";
@import "../../../assets/css/bootstrap.min.css";
</style>