import zlFetch, {
  toObject,
} from 'https://cdn.jsdelivr.net/npm/zl-fetch@5.0.1/src/index.js'

const form = document.querySelector('form')

form.addEventListener('submit', async event => {
  event.preventDefault()

  const data = new FormData(form)

  const response = await zlFetch.post('http://localhost:3000/api/v1/login', {
    body: toObject(data),
  })

  console.log(response)
})
