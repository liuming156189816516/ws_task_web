<template>
  <div v-if="visible" class="modal-mask">
    <div class="modal-container">
      <span class="close-btn" @click="close">×</span>

      <div class="modal-content ">
        <p>
          O novo sistema já está em funcionamento; o sistema antigo será desativado.
          <br />
          Faça o download do novo aplicativo.
        </p>
      </div>

      <div class="modal-footer">
        <a
            class="download-btn font_30"
            :href="downloadUrl"
            download
        >
          下载
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalModal',
  data() {
    return {
      visible: false,
      downloadUrl:
          'https://levelrush.s3.ap-southeast-1.amazonaws.com/app/LevelRush.apk'
    }
  },
  methods: {
    open() {
      // 防止一分钟内重复打开
      if (this.visible) return
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 80%;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  position: relative;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 0;
  cursor: pointer;
}

.modal-content {
  line-height: 1.6;
  margin-bottom: 20px;
  color: #333;
  font-size: 22px;
  padding-right: 30px;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.download-btn {
  padding: 10px 26px;
  background: #409eff;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
}
</style>
