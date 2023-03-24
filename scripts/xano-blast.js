let dialog_html=`
  <h1 style="border: none;"><img src="/systems/dnd5e/icons/spells/fireball-eerie-1.jpg" style="height: 32px; vertical-align: bottom; margin-bottom: 2px;"/> Pew! Pew! Pew!</h1>
  <p>
    BLAP BLAP PEW PEW
  </p>
  <label for="xano-hex">Hex</label>
  <input type="checkbox" id="xano-hex" />
  <p>
    <strong>How times did your attacks hit?</strong>
  </p>
`;

async function blast(hits) {
  const hex = document.getElementById('xano-hex').checked;
  const hexStr = hex ? `${hits}d6 +` : '';
  let roll = await new Roll(`${hits}d10 + ${hexStr} 3 + 4`).evaluate({async: true});
  let pew = '';
  let blap = '';
  for (let i = 0; i < hits; i++) {
    pew += 'pew ';
    blap += 'blap ';
  }

  let flavor_html = `
    <div class="dnd5e chat-card">
      <header class="card-header flexrow">
        <img src="/systems/dnd5e/icons/spells/fireball-eerie-1.jpg" title="Magic Missile" width="36" height="36" />
        <h3>Xano's ${pew} ${blap}</h3>
      </header>
      <div class="card-content br-text">
        <p>
          You just got blapped by Xano the Magnificent
        </p>
      </div>
    </div>
  `;

  roll.toMessage({
    speaker: ChatMessage.getSpeaker(),
    flavor: flavor_html,
  });
}

new Dialog({
  title: `Xano Blap`,
  content: dialog_html,
  buttons: {
    one: {
      label:`1`,
      callback: blast.bind(null, 1)
    },
    two: {
      label:`2`,
      callback: blast.bind(null, 2)
    }
  },
}, { id: "xano-blap-roll"}).render(true);
