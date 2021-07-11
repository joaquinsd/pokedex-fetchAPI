// Regular function to capitalize the first letter of a word
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// Function to load more pokemons on the website
function getPokemons(url, button){
  fetch(url).then(function(response){
    return response.json();
  })
  .then(function(response){
    var data = response.next
    button.dataset.more = data
    response.results.forEach(function(result){
      createPokeCards(result)
    })
  })
}
// Function to extract the pokemon number from the string to get image
function extractPokeNumber(element){
  var pokeNumber = element.substring(
    element.lastIndexOf("pokemon/") + 8, 
    element.lastIndexOf("/")
  );
  return pokeNumber
}
// Function that creates the bootstrap card for the displayed pokemons
function createPokeCards(result){
  var mainDiv = document.querySelector('#main-container')
  var cardDiv = document.createElement('div')
  var pokeDiv = document.createElement('div')
  var h5Name = document.createElement('h5')
  var cardButton = document.createElement('button')
  var cardImg = document.createElement('img')
  var pokeNumber = extractPokeNumber(result.url)
  var imgUrl = 'https://pokeres.bastionbot.org/images/pokemon/'+pokeNumber+'.png'
  $(cardImg).attr({'src': imgUrl, 'class': "card-img-top", 'alt': result.name})
  cardDiv.className = 'card m-1'
  cardDiv.style.width = '18rem'
  pokeDiv.className = 'card-body'
  h5Name.className = 'card-title text-center'
  $(cardButton).attr({'class': 'btn btn-danger btn-sm','data-bs-toggle':'modal','data-bs-target':'#pokemon-modal', 'data-pokemon': result.name})

  h5Name.appendChild(document.createTextNode(capitalizeFirstLetter(result.name)))
  cardButton.appendChild(document.createTextNode('Learn more about this pokémon!'))
  pokeDiv.appendChild(h5Name)
  pokeDiv.appendChild(cardButton)
  cardDiv.appendChild(cardImg)
  cardDiv.appendChild(pokeDiv)
  mainDiv.appendChild(cardDiv)

  cardButton.addEventListener('click', function(event){
    fetch(result.url).then(function(response){
      return response.json();
    })
    .then(function(response){
      fillPokemonModal(response, result)
    })
  })
}
// Function that fills in the learn more modal for each pokemon
function fillPokemonModal(response, result){
  var modal = document.querySelector('#pokemon-modal')
  var modalTitle = document.querySelector('#pokemonModal')
  var regularPic = document.querySelector('#regular-sprite')
  var shinyPic = document.querySelector('#shiny-sprite')
  var mainModalBtn = document.querySelector('#close-modal')
  var ulType = document.querySelector('#types')
  var ulAbility = document.querySelector('#abilities')
  var ulGens= document.querySelector('#generations')
  var olMoves = document.querySelector('#moves')

  ulType.innerHTML =''
  ulAbility.innerHTML =''
  ulGens.innerHTML =''
  olMoves.innerHTML = ''
  modalTitle.innerHTML = ''

  response.types.forEach(function(iterable){
    var li = document.createElement('li')
    li.className = 'col-2'
    var typeBtn = document.createElement('button')
    typeBtn.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.type.name)))
    $(typeBtn).attr({'class': 'btn btn-success btn-sm','data-bs-toggle':'modal','data-bs-target':'#damage-data', 'data-damage': iterable.type.name})
    li.appendChild(typeBtn)
    ulType.appendChild(li)
  })

  response.abilities.forEach(function(iterable){
    var li = document.createElement('li')
    li.className = 'col-4'
    var abilityBtn = document.createElement('button')
    abilityBtn.appendChild(document.createTextNode('Other pokémon with this ability'))
    $(abilityBtn).attr({'class': 'btn btn-info btn-sm','data-bs-toggle':'modal','data-bs-target':'#ability-data', 'data-ability': iterable.ability.name})
    li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.ability.name)))
    li.appendChild(abilityBtn)
    ulAbility.appendChild(li)
    
  })

  response.game_indices.forEach(function(iterable){
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.version.name)))
    ulGens.appendChild(li)
  })

  response.moves.forEach(function(iterable, index){
    if(index < 5){
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.move.name)))
    olMoves.appendChild(li)
    }
  })

  modalTitle.appendChild(document.createTextNode(capitalizeFirstLetter(result.name)))  
  regularPic.src = response.sprites.front_default
  shinyPic.src = response.sprites.front_shiny

  mainModalBtn.addEventListener('click', function(event){
    modal.style.display = 'none'
  })
}
// Function that requests and displays the damage interaction between pokemon types
function getDamageData(type){
  typeUrl = 'https://pokeapi.co/api/v2/type/'+type
  fetch(typeUrl).then(function(response){
    return response.json();
  })
  .then(function(response){
    var modalTitle = document.querySelector('#damageModal')
    var ulDoubleTo = document.querySelector('#double-to')
    var ulHalfTo = document.querySelector('#half-to')
    var ulInmuneTo= document.querySelector('#inmune-to')
    var ulDoubleFrom = document.querySelector('#double-from')
    var ulHalfFrom = document.querySelector('#half-from')
    var ulInmuneFrom = document.querySelector('#inmune-from')
    ulDoubleTo.innerHTML = ''
    ulHalfTo.innerHTML = ''
    ulInmuneTo.innerHTML = ''
    ulDoubleFrom.innerHTML = ''
    ulHalfFrom.innerHTML = ''
    ulInmuneFrom.innerHTML = ''
    modalTitle.innerHTML = ''

    response.damage_relations.double_damage_from.forEach(function(iterable){
      var li = document.createElement('li')
      li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.name)))
      ulDoubleFrom.appendChild(li)
    })

    response.damage_relations.half_damage_from.forEach(function(iterable){
      var li = document.createElement('li')
      li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.name)))
      ulHalfFrom.appendChild(li)
    })

    response.damage_relations.no_damage_from.forEach(function(iterable){
      var li = document.createElement('li')
      li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.name)))
      ulInmuneFrom.appendChild(li)
    })

    response.damage_relations.double_damage_to.forEach(function(iterable){
      var li = document.createElement('li')
      li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.name)))
      ulDoubleTo.appendChild(li)
    })

    response.damage_relations.half_damage_to.forEach(function(iterable){
      var li = document.createElement('li')
      li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.name)))
      ulHalfTo.appendChild(li)
    })

    response.damage_relations.no_damage_to.forEach(function(iterable){
      var li = document.createElement('li')
      li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.name)))
      ulInmuneTo.appendChild(li)
    })

    modalTitle.appendChild(document.createTextNode(capitalizeFirstLetter(type)))  

    $('#back-damage').on('click', function(event){
      $('#damage-data').modal('hide')
      $('#pokemon-modal').modal('show')
    })
  })
}
// Function that requests and display all the other pokemon with the same ability selected
function getAbilityPeers(ability){
  abilityUrl = 'https://pokeapi.co/api/v2/ability/'+ability
  fetch(abilityUrl).then(function(response){
    return response.json();
  })
  .then(function(response){
    var modalTitle = document.querySelector('#damageModal')
    var olAbilityPeers = document.querySelector('#ability-peers')
    olAbilityPeers.innerHTML = ''
    modalTitle.innerHTML = ''

    response.pokemon.forEach(function(iterable){
      var li = document.createElement('li')
      li.appendChild(document.createTextNode(capitalizeFirstLetter(iterable.pokemon.name)))
      olAbilityPeers.appendChild(li)
    })

    modalTitle.appendChild(document.createTextNode(capitalizeFirstLetter(ability)))  

    $('#back-abilities').on('click', function(event){
      $('#ability-data').modal('hide')
      $('#pokemon-modal').modal('show')
    })
  })
}
// Main function for populating the HTML and defining the event listeners
document.addEventListener('DOMContentLoaded',function() {
  var urlString = 'https://pokeapi.co/api/v2/pokemon/'
  var button = document.querySelector('#load')
  var typeBtn = document.querySelector('#types')
  var abilityBtn = document.querySelector('#abilities')
    
  getPokemons(urlString, button) // Instantly loads the first batch of pokemon

  button.addEventListener('click', function(){ 
    getPokemons(button.dataset.more, button)
  }) // When the button is clicked, loads another batch of pokemon 

  typeBtn.addEventListener('click', function(event){
    $('#pokemon-modal').modal('hide')
    getDamageData(event.target.dataset.damage)
  }) // When a type button is clicked, displays the damage interaction modal

  abilityBtn.addEventListener('click', function(event){
    $('#pokemon-modal').modal('hide')
    getAbilityPeers(event.target.dataset.ability)
  }) // When an ability button is clicked, displays the pokemon ability peers modal
  
});

