<template>
  <div class="tips-box">
    <p class="title-box">
      <span class="title"> 风险提示 </span>
    </p>
    <p class="content">上述内容通过历史、公开数据得出，非实时数据，仅供投资者参考，不构成投资建议。历史数据不代表未来趋势，股市有风险，投资者应谨慎、自主作出投资决策，自行承担投资风险。</p>
  </div>
</template>

<script setup lang="js" name="Tips"></script>

<style scoped lang="less">
.tips-box {
  flex-shrink: 0;
  background: var(--bg_content);
  text-align: center;
  padding: 10px 10px 50px 10px;
  color: var(--text_exlight);
  .title-box {
    margin-bottom: 10px;
    width: 232px;
    margin: 5px auto;
    line-height: 18px;
    font-style: normal;
    font-size: 13px;
    .title {
      font-weight: 500;
    }
  }
  .content {
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    font-style: normal;
    text-align: justify;
    text-align-last: center;
  }
}
</style>
