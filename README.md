
  # tahaa-resume-maker

  This is a code bundle for tahaa-resume-maker. The original project is available at https://www.figma.com/design/WAm22gGR2sUhy0sNfrSjhm/tahaa-resume-maker.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## AI assistant setup

  1. Copy `.env.example` to `.env`.
  2. Add your Groq API key to `VITE_GROQ_API_KEY`.
  3. Optionally change `VITE_GROQ_MODEL` if you want a different Groq model.

  Example:

  ```bash
  copy .env.example .env
  ```

  Then edit `.env` and set:

  ```env
  VITE_GROQ_API_KEY=your_groq_api_key_here
  VITE_GROQ_MODEL=llama-3.1-8b-instant
  ```
  