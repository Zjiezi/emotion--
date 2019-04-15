
<template>
  <div class="body">
    <div id="video-container">
      <div class="video-overlay"></div>
      <div class="video-content">
        <div class="inner">
          <h1>
            欢迎来到
            <em>Emotion</em>
          </h1>
          <p>在此</p>
          <p>可以贩卖情绪</p>
          <p>也可以购买情绪</p>
          <p></p>
          <p></p>
          <p></p>
          <p>下面三个情绪</p>
          <p>免费供应</p>
          <div class="scroll-icon">
                <Button ghost shape="circle" icon="md-heart-outline" size="large"  @click="clickSale" ></Button>
          </div>
        </div>
      </div>
      <video autoplay loop muted>
        <source src="../../../assets/mp4/highway-loop.mp4" type="video/mp4">
      </video>
    </div>

    <div class="full-screen-portfolio" id="portfolio">
      <div class="container-fluid">
        <Row>
          <Col span="8">
            <div class="portfolio-item">
              <a @click="ivewMood()">
                <div class="thumb">
                  <div class="hover-effect">
                    <div class="hover-content">
                      <h1>
                        emotion-
                        <em>亲情</em>
                      </h1>
                      <p>Awesome Subtittle Goes Here</p>
                    </div>
                  </div>
                  <div class="image">
                    <img src="../../../assets/images/portfolio_item_4.png">
                  </div>
                </div>
              </a>
            </div>
          </Col>
          <Col span="8">
            <div class="portfolio-item">
              <a @click="ivewMood()">
                <div class="thumb">
                  <div class="hover-effect">
                    <div class="hover-content">
                      <h1>
                        emotion-
                        <em>爱情</em>
                      </h1>
                      <p>Awesome Subtittle Goes Here</p>
                    </div>
                  </div>
                  <div class="image">
                    <img src="../../../assets/images/portfolio_item_2.png">
                  </div>
                </div>
              </a>
            </div>
          </Col>

          <Col span="8">
            <div class="portfolio-item">
              <a @click="ivewMood()">
                <div class="thumb">
                  <div class="hover-effect">
                    <div class="hover-content">
                      <h1>
                        emotion-
                        <em>友情</em>
                      </h1>
                      <p>Awesome Subtittle Goes Here</p>
                    </div>
                  </div>
                  <div class="image">
                    <img src="../../../assets/images/portfolio_item_3.png">
                  </div>
                </div>
              </a>
            </div>
          </Col>
        </Row>
      </div>
    </div>

    <div ref="box" :class="{'overlay-menu':active,'overlay-menu open':!active}">
      <div class="main-menu">
        <ul>
          <li>
            <a>我哪都不去</a>
          </li>
        </ul>
        <p>跟耳垂舌吻</p>
        <p>抚臀线失神</p>
        <p>在腿间印下指纹</p>
        <p>我向你眼睛说了一千零九句情话</p>
        <p>我在你身体里游曳了十万零九下</p>
        <p>羊群走失在星光里</p>
        <p>白茶花开满地</p>
        <p>当天暗下来太阳不再升起</p>
        <p>我哪都不去</p>
        <p>我就在你身体里</p>
        <div style="margin-top:100px">
          <Button type="success" ghost @click="ivewMood()">阅读</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modal1: false,
      active: true
    };
  },

  methods: {
    ivewMood() {
      this.active = !this.active;
    },
    clickSale(){
         this.$router.push("sale");
    }

  }
};
</script>

<style scoped>
@import "../../../assets/css/templatemo-style.css";
</style>


