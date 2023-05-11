
<template>
  <section class="card">
    <header class="card__header">{{ title }}</header>
    <main class="card__body">
      <div class="card__inner">
        <slot></slot>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ 
  title: string,
}>();

</script>

<style lang="scss" scoped>
.card {
  border: 3px solid #00346E;
  border-radius: 20px;
  margin-bottom: 40px;
  background-color: #fff;
  width: 100%;

  &__header {
    margin: -1px -1px -1px -1px;
    padding: 20px 40px;
    border-radius: 18px 18px 0 0;
    font-weight: 700;
    font-size: 25px;
    background-color: #00346E;
    color: #fff;
  }

  &__body {
    overflow: hidden;
  }

  &__inner {
    padding: 10px;
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
  }
}
</style>
