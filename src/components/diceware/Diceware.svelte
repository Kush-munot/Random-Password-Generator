<script>
  import getWordsMap from "./repo.js";
  import getRandom from "./dice.js";
  import { onMount } from "svelte";

  const DEFAULT_SEPARATOR = "-";
  const MAX_PASS_LENGTH = 10;
  const MIN_PASS_LENGTH = 2;
  const DEFAULT_PASS_LENGTH = 6;
  const DEFAULT_LANGUAGE = "en";

  let passwordLength = DEFAULT_PASS_LENGTH;
  let password = "";
  let separator = DEFAULT_SEPARATOR;
  let language = DEFAULT_LANGUAGE;
  let repository = new Map();

  async function loadDicewareWordList() {
    if (repository.has(language)) {
      return;
    }
    let words = await getWordsMap(language);
    repository.set(language, words);
  }

  onMount(async function() {
    await loadDicewareWordList();
  });

  function generatePassword() {
    password = "";
    let words = repository.get(language);
    let allwords = new Array(passwordLength);
    allwords = allwords.fill().map(() => words[getRandom() % words.length]);
    password = allwords.join(separator);
  }

  function validatePasswordLength() {
    if (passwordLength > MAX_PASS_LENGTH) {
      passwordLength = MAX_PASS_LENGTH;
    }
    if (passwordLength < MIN_PASS_LENGTH) {
      passwordLength = MIN_PASS_LENGTH;
    }
  }

  function copyPasswordToClipboard() {
    let el = document.getElementById("passwordArea");
    el.select();
    document.execCommand("copy");
    el.selectionStart = el.selectionEnd;
  }
</script>

<style>
  button {
    background: green;
    color: white;
    border: none;
    border-radius: 2px;
    margin: 10px;
    text-transform: capitalize;
    padding: 10px 20px;
    font-weight: 600;
    font-size: 16px;
  }
  div {
    
    padding-bottom: 10px;
  }

  .container {
    border: 2px solid green;

    display: inline-grid;
    background-color: lightblue;
    padding: 60px 60px 20px 60px;
    border-radius: 5px;
  }
  @media only screen and (min-width: 800px) {
    .container {
      width: 600px;
    }
  }


  .column-right {
    box-sizing: border-box;
    width: 100%;  
  }

  @media only screen and (min-width: 800px) {
    .column-left {
      float: left;
      white-space: nowrap;
    }

    .column-right {
      width: 300px;
      float: right;
      box-sizing: border-box;
    }
  }

  .password-area {
    background-color: aliceblue;
    font-size: 15px;
    border: none;
    border-radius: 5px;
    width: 100%;
    text-align: center;
    padding: 10px;
  }

  .column-left{
    font-size: 16px;
    font-weight: 500;
  }
</style>

<div class="container">
  <div>
    <label class="column-left" for="language_ctrl">Language:</label>
    <select
      class="column-right"
      id="language_ctrl"
      bind:value={language}
      on:change={async () => loadDicewareWordList()}>
      <option value="en">English</option>
      <option value="fi">Finnish</option>
      <option value="mi">Maori</option>
      <option value="pl">Polish</option>
    </select>
  </div>
  <div>
    <label class="column-left" for="password_ctrl">
      Words per Password ({MIN_PASS_LENGTH}-{MAX_PASS_LENGTH}):
    </label>
    <input
      id="password_ctrl"
      class="column-right"
      type="number"
      bind:value={passwordLength}
      onkeyup="this.value=this.value.replace(/[^\d]/,'');"
      on:change={validatePasswordLength}
      min={MIN_PASS_LENGTH}
      max={MAX_PASS_LENGTH} />
  </div>
  <div>
    <label class="column-left" for="separator_ctrl">Select Separator:</label>
    <input id="separator_ctrl" class="column-right" bind:value={separator} />
  </div>
  <div>
    <button on:click={generatePassword}>Generate Password</button>
  </div>
  <div>
    <textarea
      id="passwordArea"
      class="password-area"
      readonly
      rows="2"
      value={password} />
    <button on:click={copyPasswordToClipboard}>copy to clipboard</button>
  </div>
</div>
