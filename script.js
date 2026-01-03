/* Prompt Library - saves prompts to localStorage */
(function(){
  const STORAGE_KEY = 'prompt_library_prompts_v1';

  const form = document.getElementById('promptForm');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const promptsList = document.getElementById('promptsList');
  const clearFormBtn = document.getElementById('clearForm');
  const clearAllBtn = document.getElementById('clearAll');

  function readStorage(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      console.error('Failed to read storage', e);
      return [];
    }
  }

  function writeStorage(arr){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function createPrompt(title, content){
    return { id: Date.now().toString(36) + Math.random().toString(36).slice(2,8), title: title.trim(), content: content.trim(), created: Date.now() };
  }

  function renderPrompts(){
    const items = readStorage();
    promptsList.innerHTML = '';
    if(items.length === 0){
      const empty = document.createElement('div');
      empty.className = 'small';
      empty.textContent = 'No prompts saved yet. Add one using the form above.';
      promptsList.appendChild(empty);
      return;
    }

    items.slice().reverse().forEach(item => {
      const card = document.createElement('div');
      card.className = 'prompt-card';

      const h = document.createElement('h3');
      h.textContent = item.title || 'Untitled';
      card.appendChild(h);

      const p = document.createElement('p');
      p.textContent = item.content;
      card.appendChild(p);

      const actions = document.createElement('div');
      actions.className = 'prompt-actions';

      const del = document.createElement('button');
      del.className = 'btn ghost danger';
      del.textContent = 'Delete';
      del.addEventListener('click', function(){
        if(confirm('Delete this prompt?')) deletePrompt(item.id);
      });

      actions.appendChild(del);
      card.appendChild(actions);

      promptsList.appendChild(card);
    });
  }

  function savePrompt(title, content){
    const arr = readStorage();
    arr.push(createPrompt(title, content));
    writeStorage(arr);
    renderPrompts();
  }

  function deletePrompt(id){
    const arr = readStorage().filter(i => i.id !== id);
    writeStorage(arr);
    renderPrompts();
  }

  function clearAll(){
    if(!confirm('Delete all saved prompts?')) return;
    writeStorage([]);
    renderPrompts();
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const t = titleInput.value;
    const c = contentInput.value;
    if(!t.trim() || !c.trim()) return;
    savePrompt(t,c);
    form.reset();
    titleInput.focus();
  });

  clearFormBtn.addEventListener('click', function(){ form.reset(); titleInput.focus(); });
  clearAllBtn.addEventListener('click', clearAll);

  document.addEventListener('DOMContentLoaded', renderPrompts);
  renderPrompts();
})();
