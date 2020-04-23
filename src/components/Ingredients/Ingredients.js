import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';
import ErrorModal from './../UI/ErrorModal'

const ingredientReducer = (currentIngredients, action) => {
switch (action.type) {
  case 'SET': 
  return action.ingredients
  case 'ADD': 
  return [...currentIngredients, action.ingredient]
  case 'DELETE': 
  return currentIngredients.filter(ingr => ingr.id !== action.id)
  default:
    throw new Error ('Prob!')
}
}

const httpReducer = (curHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      return {isLoading: true, error: null}
    case 'RESPONSE':
      return {...curHttpState, isLoading: false}
    case 'ERROR':
      return {isLoading: false, error: action.error}
    case 'CLEAR':
      return {...curHttpState, error: null}
    default:
      throw new Error ('Prob!') 
  }
}

const Ingredients = () => {
const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
const [httpState, dispatchHttp] = useReducer(httpReducer, {
  isLoading: false,
  error: null
})
// const [userIngredients, setUserIngredients] = useState([])
// const [isLoading, setIsLoading] = useState(0)
// const [error,setError] = useState()
/*
useEffect( () => {
  fetch('https://simplereactapp-b2b07.firebaseio.com/ingredients.json')
  .then ( response => response.json())
  .then ( responseData => {
     const loadedIngredients = []
     for (const key in responseData){
      loadedIngredients.push({
        id: key,
        title: responseData[key].title,
        amount: responseData[key].amount
      })
     }

    setUserIngredients(loadedIngredients);
  })

}, [])
*/
const removeIngredientHandler = id => {
  dispatchHttp({type: 'SEND'})
  // setIsLoading(true)
  fetch(`https://simplereactapp-b2b07.firebaseio.com/ingredients/${id}.json`, {
    method: 'DELETE'
  }).then ( response => 
    {
      dispatchHttp({type: 'RESPONSE'})
      //setIsLoading(false)
      dispatch({type: 'DELETE', id: id})
      // setUserIngredients( previousIngredients => previousIngredients.filter( ingredient => ingredient.id !== id))
    }
    )
}

const addIngredientHandler = ingredient => {
  dispatchHttp({type: 'SEND'})
  //setIsLoading(true)
  fetch('https://simplereactapp-b2b07.firebaseio.com/ingredients.json', {
    method: 'POST',
    body: JSON.stringify(ingredient),
    headers: { 'Content-type': 'application/json'}
  }).then ( response => {
    dispatchHttp({type: 'RESPONSE'})
    // setIsLoading(false)
    return response.json();
  }).then ( responseData => {
    dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
    // setUserIngredients( previousIngredients => [...previousIngredients, {id: responseData.name, ...ingredient}]);
  }
).catch( err=> {
  dispatchHttp({type: 'ERROR', error: err.message})
  // setError(err.message)
  // setIsLoading(false)
})
}

const filteredIngredientsHandler = useCallback (filteredIngredients => {
  dispatch({type: 'SET', ingredients: filteredIngredients})
  // setUserIngredients(filteredIngredients)
 }, [])

const clearError = () => {
  dispatchHttp({type: 'CLEAR'})
   //setError(null)
}
  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient = {addIngredientHandler} loading={httpState.isLoading}/>
    
      <section>
        <Search onLoadIngredients = {filteredIngredientsHandler}/>
        {/* Need to add list here! */}
        <IngredientList ingredients = {userIngredients} onRemoveItem = { removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
