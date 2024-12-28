<template>
  <div class="ys-float-btn" :style="{
    width: itemWidth + 'px',
    height: itemHeight + 'px',
    left: left + 'px',
    top: top + 'px',
  }" ref="dragIcon" @click="onBtnClick" @touchstart.stop="handleTouchStart"
    @touchmove.prevent.stop="handleTouchMove($event)" @touchend.stop="handleTouchEnd">
    <slot class="aaa" name="icon"></slot>
  </div>
</template>

<script>
export default {
  name: "DragIcon",
  props: {
    // 距离屏幕边距的距离 传入px,进行处理
    gapWidthPx: {
      type: Number,
      default: 0,
    },
    // 页面初始化到顶部的百分比，小数形式展示
    coefficientHeight: {
      type: Number,
      default: 0.65,
    },
  },
  computed: {
    gapWidth() {
      let num = this.gapWidthPx;
      if (
        document.getElementsByTagName("html")[0] &&
        document.getElementsByTagName("html")[0].style.fontSize.split("px")[0]
      ) {
        num =
          (num / 100) *
          document
            .getElementsByTagName("html")[0]
            .style.fontSize.split("px")[0];
      }
      return num;
    },
    itemWidth() {
      return this.itemWidth1 || 40;
    },
    itemHeight() {
      return this.itemHeight1 || 40;
    },
  },
  watch: {
    // 初始化计算组件宽度，获取组件距离左边的宽度
    itemWidth: {
      handler(newV, oldV) {
        if (newV > 0 && newV != oldV) {
          this.clientWidth = document.documentElement.clientWidth;
          this.clientHeight = document.documentElement.clientHeight;
          this.left = this.clientWidth - this.itemWidth - this.gapWidth;
        }
      },
    },
  },
  updated() {
    this.$nextTick(() => {
      if (
        this.$refs.dragIcon &&
        this.$refs.dragIcon.children[0] &&
        this.$refs.dragIcon.children[0].clientHeight
      ) {
        this.itemHeight1 = this.$refs.dragIcon.children[0].clientHeight;
        this.itemWidth1 = this.$refs.dragIcon.children[0].clientWidth;
      }
    });
  },
  created() {
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
    this.left = this.clientWidth - this.itemWidth - this.gapWidth;
    this.top = this.clientHeight * this.coefficientHeight;
  },
  methods: {
    onBtnClick() {
      this.$emit("onBtnClick");
    },
    handleTouchStart() {
      this.startToMove = true;
      this.$refs.dragIcon.style.transition = "none";
    },
    handleTouchMove(e) {
      if (this.startToMove && e.targetTouches.length === 1) {
        const clientX = e.targetTouches[0].clientX; //手指相对视口的x
        const clientY = e.targetTouches[0].clientY; //手指相对视口的y
        this.left = clientX - this.itemWidth / 2;
        this.top = clientY - this.itemHeight / 2;
      }
    },
    handleTouchEnd() {
      this.$refs.dragIcon.style.transition = "all 0.3s";
      if (this.left > this.clientWidth / 2) {
        this.left = this.clientWidth - this.itemWidth - this.gapWidth;
      } else {
        this.left = this.gapWidth;
      }
      if (this.top <= 36) {
        this.top = 36 + this.gapWidth;
      } else {
        let bottom = this.clientHeight - 50 - this.itemHeight - this.gapWidth;
        if (this.top >= bottom) {
          this.top = bottom;
        }
      }
    },
  },
  data() {
    return {
      currentTop: 0,
      clientWidth: 0,
      clientHeight: 0,
      left: 0,
      top: 0,
      itemWidth1: 40,
      itemHeight1: 40,
    };
  },
};
</script>

<style lang="scss" scoped>
.ys-float-btn {
  z-index: 20;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 20vw;
}
</style>