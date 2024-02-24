document.addEventListener('DOMContentLoaded', () => {
    getAllDogs()
    handleFilterGoodDogButton()
  })
  
  function getAllDogs() {
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(dogs => dogs.forEach(dog => renderDogNames(dog)))
  }
  
  function renderDogNames(obj) {
    const span = document.createElement('span')
    span.textContent = obj.name
    span.addEventListener('click', () => {
      document.querySelector('div#dog-info').innerText = ''
      renderDogInfo(obj)
    })
    document.querySelector('div#dog-bar').appendChild(span)
  }
  
  function renderDogInfo(obj) {
    const card = document.createElement('div')
    card.id = 'dog-info' 
    let whichDog = 'Good Dog!'
    if(!obj.isGoodDog) {
      whichDog = 'Bad Dog!'
      obj.isGoodDog = false
    }
    card.innerHTML = `
    <img src='${obj.image}'/>
    <h2>${obj.name}</h2>
    <button>${whichDog}</button>`
  
    const button = card.querySelector('button')
    button.addEventListener('click', () => {
      if(whichDog === 'Good Dog!') {
        whichDog = 'Bad Dog!'
        obj.isGoodDog = false
      } else {
        whichDog = 'Good Dog!'
        obj.isGoodDog = true
      }
      button.innerText = whichDog
      updateDogOnDB(obj)
      card.appendChild(button)
    })
    document.querySelector('div#dog-info').appendChild(card)
  }
  
  function updateDogOnDB(obj) {
    fetch(`http://localhost:3000/pups/${obj.id}`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj) 
    })
    .then(res => res.json())
    .then(obj => console.log(obj))
  }
  
  function handleFilterGoodDogButton() {
    const dogBar = document.querySelector('div#dog-bar')
    document.querySelector('button#good-dog-filter').addEventListener('click', (e) => {
      if(e.target.innerText === 'Filter good dogs: ON') {
        dogBar.innerText = ''
        e.target.innerText = 'Filter good dogs: OFF'
        getAllDogs()
      } else {
        e.target.innerHTML = 'Filter good dogs: ON'
        dogBar.innerText = ''
        fetch('http://localhost:3000/pups')
        .then(res => res.json())
        .then(dogs => {
          let goodDogs = dogs.filter(dog => dog.isGoodDog === true)
          goodDogs.forEach(dog => renderDogNames(dog))
        })
      }    
    })
  }
  