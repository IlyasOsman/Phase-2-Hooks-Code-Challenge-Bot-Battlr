import React from "react";


function BotCollection( { selectedBots }) {
  // Your code here

  return (
    <div className="ui four column grid">
      <div className="row">
        {/*...and here..*/}
        Collection of all bots
        {selectedBots}
      </div>
    </div>
  );
}

export default BotCollection;