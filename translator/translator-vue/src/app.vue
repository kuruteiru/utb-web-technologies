<template>
	<div>
		<div class="container">
			<div class="jumbotron my-5">
				<h1 class="display-4"><i class="fas fa-globe-africa"></i> Translator APP</h1>
				<p class="lead">Translate what you need...</p>
				<hr class="my-4" />
				<p>Using MyMemory Translated API</p>
			</div>
		</div>

		<div id="loading" class="container" v-show="loading">
			<div class="alert alert-primary" role="alert">Loading translation...</div>
		</div>

		<div class="container">
			<div class="row">
				<div class="col-md-5">
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon1"> Input phrase </span>
						</div>
						<input
							v-model="userInput"
							@keyup.enter="translate"
							type="text"
							class="form-control"
							placeholder="Text for translation..."
							aria-label="Input phrase"
							aria-describedby="basic-addon1"
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
						<div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon2"> Translation </span>
						</div>
						<input
							v-model="result"
							type="text"
							class="form-control"
							placeholder=""
							aria-label="Translation"
							aria-describedby="basic-addon2"
							disabled
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const userInput = ref('')
const result = ref('')
const loading = ref(false)

async function translate() {
	if (!userInput.value.trim()) return

	loading.value = true
	const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
		userInput.value,
	)}&langpair=cs|en`

	try {
		const res = await fetch(url)
		const json = await res.json()
		result.value = json.responseData.translatedText
	} catch (err) {
		console.error(err)
		result.value = 'Error fetching translation'
	} finally {
		loading.value = false
	}
}
</script>

<style></style>
