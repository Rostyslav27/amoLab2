<template>
  <label class="upload">
    {{ fileName.length ? fileName : 'Заватнажити з файлу' }}
    <input ref="input" type="file" @input="handleInput">
  </label>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const emit = defineEmits<{
    (e: 'upload', data: string): void
  }>();

  const input = ref<HTMLInputElement>();
  const reader:FileReader = new FileReader();
  const fileName = ref<string>('');

  reader.onload = (e:ProgressEvent<FileReader>) => {
    if (e.target) {
      emit('upload', String(e.target.result));
    }
  }

  const handleInput = ():void => {
    if (input.value && input.value.files) {
      fileName.value = input.value.files[0].name;
      reader.readAsText(input.value.files[0], 'UTF-8');
    } else {
      fileName.value = '';
    }
  };  
</script>

<style lang="scss" scoped>
  .upload {
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

  input {
    display: none;
  }
</style>