<template>
  <div class="array-input" :class="{'array-input--invalid' : invalid}">
    <textarea 
      class="array-input__input" 
      type="text"
      :placeholder="title"
      v-model="inputValue"
      rows="1"
    ></textarea>
  </div>
  
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';

  const props= defineProps<{
    title: string,
    length: number,
    modelValue: number[]
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'invalid'): void
    (e: 'input', valid: boolean): void
  }>();

  const invalid = ref<boolean>(false);
  const inputValue = ref<string>(props.modelValue.join(','));

  const isValid = (value:string):boolean => {
    return !!value.length && /^-{0,1}[0-9]{1,}[.]{0,1}[0-9]{0,}$/.test(value.toString()) && !/^-{0,1}0{1}[0-9]{1,}$/.test(value.toString());
  };

  watch(() => props.modelValue, () => {
    inputValue.value = props.modelValue.join(',');
  });

  watch(inputValue, () => {
    const numberArray:number[] = [];

    try {
      const stringArray:string[] = inputValue.value.split(',');
      stringArray.forEach((el => {
        if (isValid(el)) {
          numberArray.push(+el);
        } else {
          throw new Error('err');
        }
      }));

      invalid.value = false;
    } catch {
      invalid.value = true;
    }
    
  });

  
</script>

<style lang="scss" scoped>
  .array-input {

    &--invalid {
      color: red;
    }

    &--invalid &__input {
      border-color: red;
      outline-color: red;
    }

    &__input {
      width: 100%;
      border-radius: 5px;
      padding: 5px 10px;
      font-family: Arial, Helvetica, sans-serif;
      border: 1px solid #000;
      min-height: 47px;
      resize: vertical;

      &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #c4c4c4;
      }
    }
  }
</style>