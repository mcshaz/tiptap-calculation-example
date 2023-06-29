<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3';
import { getNextNumber } from './../pinia/numberGenerator'
  defineProps<{ rows: number, editor: Editor, label: string }>()
  const id = 'vue-tt-' + getNextNumber()
</script>
<template>
  <div class="v-input v-input--horizontal v-input--density-default v-locale--is-ltr v-textarea v-text-field">
    <div class="v-input__control">
      <div class="v-field v-field--no-label v-field--variant-filled v-theme--light v-locale--is-ltr" role="textbox">
        <div class="v-field__overlay">
        </div>
        <div class="v-field__field" data-no-activator="">
          <label class="v-label v-field-label" :for="id">
            {{  label  }}
          </label>
          <EditorContent :editor="editor" class="v-field__input" :rows="rows" :id="id" aria-describedby="input-1-messages"/>
        </div>
        <div class="v-field__outline">
        </div>
      </div>
    </div>
    <div class="v-input__details">
      <div class="v-messages" role="alert" aria-live="polite" id="input-0-messages">
      </div>
    </div>
  </div>
</template>