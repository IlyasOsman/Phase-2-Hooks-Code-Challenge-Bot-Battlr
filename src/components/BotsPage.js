import React, {useState, useEffect } from "react";
import YourBotArmy from "./YourBotArmy";
import BotCollection from "./BotCollection";
import BotCard from "./BotCard";
import BotSpecs from "./BotSpecs";


function BotsPage() {
  //start here with your code for step one
  const [bots, setBots] = useState([]);
  const [botsListed, setBotsListed] = useState([]);
  const [showBotSpecs, setShowBotSpecs] = useState(null);
  const [selectedBots, setSelectedBots] = useState([]);

  useEffect(()=> {
    fetch("http://localhost:8002/bots")
    .then(resp => resp.json())
    .then(data => {
      setBots(data);
      setSelectedBots(data);
    })
    .catch(err => console.log(err));
  }, [])

  //checks if a bot is listed 
  function listedBot(bot) {
    return Boolean(botsListed.find(botListed => botListed.id === bot.id))
  }

  //Group bots of the same class
  function botsOfSameClass (bot) {
    return botsListed.find(botListed => botListed.bot_class === bot.bot_class)
  }

  //Delete from server
  function deleteBot(botToDelete){
    fetch(`${"http://localhost:8002/bots"}/${botToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => resp.json())
    .then(() => {
      setBots(bots.filter(currentBot => currentBot.id !== botToDelete.id))
      setBotsListed(botsListed.filter(botListed => botListed.id !== botToDelete.id))
    })
  }

  //Handler for Bot event
  function handleBotClick(bot, event){
    switch(event){
      case "show-all-bots":
        setShowBotSpecs(null);
        break;
  
      case "show-bot-specs":
        setShowBotSpecs(bot);
        break;
      
      case "release-bot":
        deleteBot(bot)   
        break;

      case "enlist-bot":
        const listedBotsOfSameClass = botsOfSameClass(bot);
        if(!listedBotsOfSameClass){
          setBotsListed([...botsListed, bot])
          setSelectedBots(selectedBots.filter(currentBot => currentBot.id !== bot.id))
        }
        break;

      case "delist-bot":
        setBotsListed(botsListed.filter(currentBot => currentBot.id !== bot.id))
        setSelectedBots([...selectedBots, bot])
        break;

      
    }
  }

    const botsList = (bots) => {
    return bots.map(bot => <BotCard key={bot.id} bot={bot} handleBotClick={handleBotClick} /> )
  }

  return (
    <div>
      <YourBotArmy botsListed={botsList(botsListed)} />
      {showBotSpecs ? <BotSpecs bot={showBotSpecs} handleBotClick={handleBotClick} listedBot={listedBot(showBotSpecs)} /> : <BotCollection selectedBots={botsList(selectedBots)} />}
    </div>
  )
}

export default BotsPage;