<template>
  <a class="download" :download="fileName" :href="'data:text/plain;charset=utf-8,' + data">
    Зберегти у файл
  </a>
</template>

<script lang="ts" setup>
defineProps<{ 
  data: string,
  fileName: string
}>();
</script>

<style lang="scss" scoped>
.download {
  background-color: #38B9F5;
  color: #fff;
  border-radius: 5px;
  padding: 5px 10px;
  display: inline-block;
  text-decoration: none;
  width: fit-content;
  font-weight: 400;
  font-size: 14px;
  outline: none;
  border: none;
  box-shadow: none;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transition: opacity 0.07s;
    opacity: 0.6;
  }
}
</style>