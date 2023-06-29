<script setup lang="ts">
import { EditorContent, Editor } from '@tiptap/vue-3'
import { anthropometryVars } from './../helpers/anthropometryVars'
import { toLookup } from './../helpers/lookup'
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ExpandVarLetters, encodeText } from './../tiptap/Variables'
import TTParagraph from '@tiptap/extension-paragraph'
import TTDoc from '@tiptap/extension-document'
import TTText from '@tiptap/extension-text'
import TTPlaceholder from '@tiptap/extension-placeholder'
import { getNextNumber } from '../sharedState/numberGenerator';

  const props = defineProps<{ modelValue: string }>()
  const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()

  const editor = ref<Editor>()

  const id = 'xpressn-' + getNextNumber()
  const entries = toLookup(Object.entries(anthropometryVars), e => Boolean(e[1].isAge))
  const ageVars = Object.fromEntries(entries.get(true)!)
  const nonAgeVars = Object.fromEntries(entries.get(false)!)

  onMounted(() => {
    editor.value = new Editor({
      extensions: [
        TTDoc,
        TTParagraph,
        TTText,
        TTPlaceholder.configure({
          placeholder: 'Enter formula',
        }),
        ExpandVarLetters,
      ],
      content: {
        type: 'doc',
        content: [ encodeText(props.modelValue.replaceAll(' ', '')) ],
      },
      onUpdate() {
        // todo - this may be too inefficient & checking editor value only on submit may be more worthwhile
        const txt = editor.value!.getText()
        if (txt !== props.modelValue) { emit('update:modelValue', txt) }
      }
    })
  })
  
  onBeforeUnmount(() => {
    editor.value?.destroy()
  })

  const insertVariable = (varName: string) => {
    editor.value?.chain().insertVariable({
      varName
    }).run()
  }
</script>
<template>
  <v-card
    color="grey-lighten-4"
    flat
    rounded="0"
    class="expression-card"
  >
    <v-toolbar density="compact">
      <v-toolbar-title>
        <v-label :for="id">
          Expression
        </v-label>
      </v-toolbar-title>

      <v-btn v-for="(v, k) in nonAgeVars" :key="k" :title="v.description" icon @click="insertVariable(k as string)">
        <v-icon :icon="v.icon"/>
      </v-btn>
      <v-menu >
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            dark
            v-bind="props"
            icon
            title="age variables…"
          >
            <v-icon icon="mdi-cake-variant"/>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(v, k) in ageVars"
            :key="k"
          >
            <v-list-item-title>
              <v-btn :title="v.description" @click="insertVariable(k as string)">{{ v.name }}</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card-text>
      <EditorContent :editor="editor" :rows="1" class="expression-editor" id="id"/>
    </v-card-text>
  </v-card>
</template>
<style>
.variable {
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  white-space: break-spaces;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 6px;
  display: inline-block;
  box-sizing: border-box;
  color: rgb(31, 35, 40);
  letter-spacing: normal;
}
.expression-editor {
  letter-spacing: 0.2em;
}
.expression-card {
  margin-bottom: 1em;
}
.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
