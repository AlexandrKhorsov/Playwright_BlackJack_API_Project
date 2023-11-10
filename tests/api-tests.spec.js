import {test, expect} from '@playwright/test';


test('Confirm the site is up test', async({request}) =>{
    const response = await request.get('https://deckofcardsapi.com')
    expect(response.status()).toBe(200);
    expect(response).not.toBeNull();
})

test('Get a new deck_id test', async({request}) =>{
    const response = await request.get('https://deckofcardsapi.com/api/deck/new/')
    const jsonResponse = await response.json();
    //deck_id from the parsed JSON
    const deck_id = jsonResponse.deck_id;
    expect(deck_id).not.toBeNull();

    const responseShuffle = await request.get(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`)
    expect(responseShuffle.status()).toBe(200);
    expect(responseShuffle).not.toBeNull();


    const responseDraw = await request.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=6`)
    // Assuming the response is in JSON format, parse it
    const jsonResponseDraw = await responseDraw.json();
    // Access the 'cards' array from the parsed JSON [0,1,2,3,4,5,6]
    const drawnCards = jsonResponseDraw.cards;
    const firstPlayer = drawnCards.slice(0, 2);
    const secondPlayer = drawnCards.slice(2, 4);
    const dealer = drawnCards.slice(4, 6);

    // Calculate total values for each player and the dealer
    const firstPlayerTotal = calculateTotalValue(firstPlayer);
    const secondPlayerTotal = calculateTotalValue(secondPlayer);
    const dealerTotal = calculateTotalValue(dealer);

    // Output the total values
    console.log('First Player Total:', firstPlayerTotal);
    console.log('Second Player Total:', secondPlayerTotal);
    console.log('Dealer Total:', dealerTotal);

    // Check if any player or the dealer has Blackjack (total value of 21)
    if (firstPlayerTotal === 21) {
    console.log('First Player has Blackjack!');
    }
    if (secondPlayerTotal === 21) {
        console.log('Second Player has Blackjack!');
     }
     if (dealerTotal === 21) {
     console.log('Dealer has Blackjack!');
     }

     if (firstPlayerTotal !== 21 && secondPlayerTotal !== 21 && dealerTotal !== 21){
        if(firstPlayerTotal>secondPlayerTotal&&firstPlayerTotal>dealerTotal){
            console.log("First Player took the money")
         }else if(secondPlayerTotal>firstPlayerTotal&&secondPlayerTotal>dealerTotal){
            console.log("Second Player took the money")    
         }else{
            console.log("Dealer took all money") 
         }
     }
     
})


const calculateTotalValue = (cards) => {
    // Map each card to its numerical value
    const cardValues = cards.map((card) => {
      // Convert face cards (J, Q, K) to 10
      if (['JACK', 'QUEEN', 'KING'].includes(card.value)) {
        return 10;
      }
      // Ace can be 1 or 11
      if (card.value === 'ACE') {
        return 11;
      }
      // Convert numerical cards to their respective values
      return parseInt(card.value, 10);
    });
  
    // Calculate the total value
    let total = cardValues.reduce((sum, value) => sum + value, 0);
  
    // Handle Aces: If the total is over 21 and there are Aces, subtract 10 for each Ace
    cardValues.filter((value) => value === 11).forEach(() => {
      if (total > 21) {
        total -= 10;
      }
    });
  
    return total;
  };

