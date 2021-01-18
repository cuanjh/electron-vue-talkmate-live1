<template>
  <el-dialog
    title="美颜"
    :modal-append-to-body="false"
    :visible.sync="openBeautyDialog">
    <el-form ref="form" size="mini">
      <el-form-item label="美颜风格">
        <el-radio v-model="beautyStyle" :label="0" @change="onOpenBeauty">光滑</el-radio>
        <el-radio v-model="beautyStyle" :label="1" @change="onOpenBeauty">自然</el-radio>
      </el-form-item>
      <el-form-item label="磨皮">
        <el-input-number
          v-model.number="beauty" @change="onOpenBeauty" :min="0" :max="10" label="磨皮" size="small">
        </el-input-number>
      </el-form-item>
      <el-form-item label="美白">
        <el-input-number
          v-model.number="white" @change="onOpenBeauty" :min="0" :max="10" label="美白" size="small">
        </el-input-number>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      openBeautyDialog: false,
      beautyStyle: 0,
      beauty: 5,
      white: 5,
    };
  },
  methods: {
    show(params) {
      this.beautyStyle = params.style;
      this.beauty = params.beauty;
      this.white = params.white;
      this.openBeautyDialog = true;
    },
    onOpenBeauty() {
      this.$emit('openBeauty', { style: this.beautyStyle, beauty: this.beauty, white: this.white });
    },
  },
};
</script>
