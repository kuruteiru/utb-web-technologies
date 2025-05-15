<template>
  <div>
    <div class="container">
      <div class="jumbotron my-5">
        <h1 class="display-4">
          <i class="fas fa-globe-africa"></i> Translator APP
        </h1>
        <p class="lead">Translate what you need...</p>
        <hr class="my-4" />
        <p>Using MyMemory Translated API</p>
      </div>
    </div>

    <div id="loading" class="container" v-show="loading">
      <div class="alert alert-primary" role="alert">
        Loading translation...
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-md-5">
          <div class="input-group mb-3">
            <select class="form-select" v-model="sourceLang" style="max-width: 140px;">
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                {{ lang.name }}
              </option>
            </select>
            <input
              v-model="userInput"
              @keyup.enter="translate"
              type="text"
              class="form-control"
              placeholder="Text for translation..."
              aria-label="Input phrase"
            />
          </div>
        </div>

        <div class="col-md-2 text-center">
          <button
            @click="translate"
            :disabled="loading"
            type="button"
            class="btn btn-outline-primary mb-3 mb-md-0"
          >
            Translate <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <div class="col-md-5">
          <div class="input-group mb-3">
            <select class="form-select" v-model="targetLang" style="max-width: 140px;">
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                {{ lang.name }}
              </option>
            </select>
            <input
              v-model="result"
              type="text"
              class="form-control"
              placeholder=""
              aria-label="Translation"
              disabled
            />
          </div>
        </div>
      </div>
    </div>

    <section class="container mt-4" v-show="history.length > 0">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Translation History</h5>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="(entry, idx) in history"
              :key="idx"
            >
              <strong>{{ entry.input }}</strong> → {{ entry.translations.join(', ') }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const userInput = ref('')
const result = ref('')
const loading = ref(false)

const languages = [
  { code: 'cs', name: 'Czech' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
]
const sourceLang = ref('cs')
const targetLang = ref('en')

const history = ref([])

onMounted(() => {
  const stored = localStorage.getItem('translationHistory')
  if (stored) {
    try {
      const arr = JSON.parse(stored)
      if (Array.isArray(arr)) history.value = arr
    }
    catch (e) {
      console.err(e)
    }
  }
})

watch(history, (newVal) => {
    localStorage.setItem('translationHistory', JSON.stringify(newVal))
  },
  { deep: true }
)

async function translate() {
  const text = userInput.value.trim()
  if (!text) return

  loading.value = true
  const q = encodeURIComponent(text)
  const langpair = `${sourceLang.value}|${targetLang.value}`
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${langpair}`

  try {
    const res = await fetch(url)
    const json = await res.json()
    const main = json.responseData.translatedText || ''
    const matches = (json.matches || [])
      .map((m) => m.translation)
      .filter(Boolean)
    const set = new Set([main, ...matches])
    const variants = Array.from(set)
    result.value = variants[0] || ''
    history.value.unshift({
      input: text,
      translations: variants,
    })
  } catch (e) {
    result.value = e
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
